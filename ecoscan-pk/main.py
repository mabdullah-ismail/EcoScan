from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from google.cloud import texttospeech
from PIL import Image
import io, json, base64, os, asyncio

app = FastAPI()

# Allow React frontend to call this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Gemini API Key Rotation ───────────────────────────────────────────────────
# Add GEMINI_API_KEY and GEMINI_API_KEY_2 (and beyond) in Render environment vars.
# When one key hits its quota (429), the system automatically retries with the next.

_api_keys = [k for k in [
    os.environ.get("GEMINI_API_KEY"),
    os.environ.get("GEMINI_API_KEY_2"),
    os.environ.get("GEMINI_API_KEY_3"),
] if k]  # filter out any unset keys

if not _api_keys:
    print("WARNING: No GEMINI_API_KEY environment variables set!")

_current_key_index = 0

def _get_model():
    """Return a Gemini model configured with the current active API key."""
    genai.configure(api_key=_api_keys[_current_key_index])
    return genai.GenerativeModel("gemini-2.0-flash")

async def generate_with_rotation(prompt_parts, timeout=30.0):
    """Call Gemini with automatic failover to the next key on quota errors (429)."""
    global _current_key_index
    last_error = None
    for attempt in range(len(_api_keys)):
        idx = (_current_key_index + attempt) % len(_api_keys)
        try:
            genai.configure(api_key=_api_keys[idx])
            m = genai.GenerativeModel("gemini-2.0-flash")
            response = await asyncio.wait_for(
                m.generate_content_async(prompt_parts),
                timeout=timeout
            )
            _current_key_index = idx  # remember the working key
            return response
        except Exception as e:
            if "429" in str(e) or "ResourceExhausted" in str(type(e).__name__):
                print(f"Key #{idx+1} quota exhausted — trying next key...")
                last_error = e
                continue
            raise  # re-raise non-quota errors immediately
    raise last_error  # all keys exhausted


# Load Google Cloud Credentials using a relative path that works anywhere
cred_path = os.path.join(os.path.dirname(__file__), "..", "ecoscan-494416-31a68658518d.json")
if os.path.exists(cred_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = cred_path

# Materials database with eco alternatives (Lahore market prices, PKR)
# saving       = carbon saving %  (calculated from carbon vs alt_carbon, kept for reference)
# cost_saving  = price difference % (positive = cheaper, negative = costs more upfront)
MATERIALS = {
    # ── Bricks ────────────────────────────────────────────────────────────────
    "Fired Brick":         {"carbon":0.24, "cost":12,   "alt":"AAC Blocks",                  "alt_carbon":0.09, "saving":62, "cost_saving":30, "urdu":"pakki eent"},
    "Brick":               {"carbon":0.24, "cost":12,   "alt":"AAC Blocks",                  "alt_carbon":0.09, "saving":62, "cost_saving":30, "urdu":"eent"},
    "Red Clay Brick":      {"carbon":0.22, "cost":9,    "alt":"Fly Ash Bricks",              "alt_carbon":0.08, "saving":64, "cost_saving":12, "urdu":"lal eent"},
    "Clay Brick":          {"carbon":0.22, "cost":9,    "alt":"Fly Ash Bricks",              "alt_carbon":0.08, "saving":64, "cost_saving":12, "urdu":"mitti ki eent"},
    "Fly Ash Brick":       {"carbon":0.08, "cost":10,   "alt":"AAC Blocks",                  "alt_carbon":0.06, "saving":25, "cost_saving":10, "urdu":"fly ash eent"},

    # ── Cement ────────────────────────────────────────────────────────────────
    "Concrete":            {"carbon":0.41, "cost":180,  "alt":"Fly Ash Concrete",            "alt_carbon":0.21, "saving":49, "cost_saving":20, "urdu":"concrete"},
    "Cement":              {"carbon":0.83, "cost":1480, "alt":"Fly Ash / Slag Cement",       "alt_carbon":0.35, "saving":58, "cost_saving":15, "urdu":"cement"},
    "OPC Cement":          {"carbon":0.83, "cost":1480, "alt":"Fly Ash / Slag Cement",       "alt_carbon":0.35, "saving":58, "cost_saving":15, "urdu":"ordinary cement"},
    "Solid Concrete Slab": {"carbon":0.41, "cost":180,  "alt":"Hollow Core Slabs",           "alt_carbon":0.22, "saving":46, "cost_saving":18, "urdu":"solid concrete slab"},
    "Concrete Slab":       {"carbon":0.41, "cost":180,  "alt":"Hollow Core Slabs",           "alt_carbon":0.22, "saving":46, "cost_saving":18, "urdu":"concrete slab"},

    # ── Sand & Aggregate ──────────────────────────────────────────────────────
    "River Sand":          {"carbon":0.05, "cost":38000,"alt":"Crushed Stone Sand (Washed)", "alt_carbon":0.02, "saving":60, "cost_saving":10, "urdu":"darya ki ret"},
    "Sand":                {"carbon":0.05, "cost":38000,"alt":"Crushed Stone Sand (Washed)", "alt_carbon":0.02, "saving":60, "cost_saving":10, "urdu":"ret"},

    # ── Flooring ──────────────────────────────────────────────────────────────
    "Marble":              {"carbon":0.45, "cost":220,  "alt":"Terrazzo (Chips Flooring)",   "alt_carbon":0.18, "saving":60, "cost_saving":35, "urdu":"marmar"},
    "Marble Flooring":     {"carbon":0.45, "cost":220,  "alt":"Terrazzo (Chips Flooring)",   "alt_carbon":0.18, "saving":60, "cost_saving":35, "urdu":"marmar farsh"},
    "Granite":             {"carbon":0.65, "cost":3500, "alt":"Recycled Glass Countertops",  "alt_carbon":0.22, "saving":66, "cost_saving":8,  "urdu":"granite"},
    "Granite Counter":     {"carbon":0.65, "cost":3500, "alt":"Recycled Glass Countertops",  "alt_carbon":0.22, "saving":66, "cost_saving":8,  "urdu":"granite counter"},
    "Ceramic Tile":        {"carbon":0.59, "cost":95,   "alt":"Earth/Clay Wall Plaster",     "alt_carbon":0.08, "saving":86, "cost_saving":55, "urdu":"ceramic tile"},
    "Ceramic Wall Tile":   {"carbon":0.59, "cost":95,   "alt":"Earth/Clay Wall Plaster",     "alt_carbon":0.08, "saving":86, "cost_saving":55, "urdu":"deewar ka tile"},
    "Tile":                {"carbon":0.59, "cost":95,   "alt":"Terrazzo Tiles",              "alt_carbon":0.22, "saving":63, "cost_saving":25, "urdu":"tile"},

    # ── Wood & Composites ─────────────────────────────────────────────────────
    "Timber":              {"carbon":0.31, "cost":850,  "alt":"Bamboo",                      "alt_carbon":0.05, "saving":84, "cost_saving":47, "urdu":"lakri"},
    "Wood":                {"carbon":0.31, "cost":850,  "alt":"Bamboo",                      "alt_carbon":0.05, "saving":84, "cost_saving":47, "urdu":"lakri"},
    "Sheesham":            {"carbon":0.31, "cost":950,  "alt":"WPC (Wood Plastic Composite)","alt_carbon":0.12, "saving":61, "cost_saving":5,  "urdu":"sheesham"},
    "Kail Wood":           {"carbon":0.28, "cost":800,  "alt":"WPC (Wood Plastic Composite)","alt_carbon":0.12, "saving":57, "cost_saving":5,  "urdu":"kail ki lakri"},
    "Plywood":             {"carbon":0.45, "cost":750,  "alt":"Bamboo Boards",               "alt_carbon":0.05, "saving":89, "cost_saving":33, "urdu":"plywood"},
    "Plywood Ceiling":     {"carbon":0.45, "cost":750,  "alt":"Bamboo Boards",               "alt_carbon":0.05, "saving":89, "cost_saving":33, "urdu":"plywood chhat"},
    "Bamboo":              {"carbon":0.05, "cost":450,  "alt":"Hempcrete",                   "alt_carbon":0.02, "saving":60, "cost_saving":20, "urdu":"baans"},

    # ── Steel & Metal ─────────────────────────────────────────────────────────
    "Steel Rebar":         {"carbon":1.46, "cost":320,  "alt":"Recycled Steel Rebar",        "alt_carbon":0.62, "saving":58, "cost_saving":15, "urdu":"saria"},
    "Steel Reinforcement": {"carbon":1.46, "cost":320,  "alt":"Recycled Steel Rebar",        "alt_carbon":0.62, "saving":58, "cost_saving":15, "urdu":"taqatwaar saria"},
    "Steel":               {"carbon":1.46, "cost":320,  "alt":"GFRP (Basalt) Rebar",         "alt_carbon":0.51, "saving":65, "cost_saving":10, "urdu":"steel"},
    "Aluminum":            {"carbon":8.24, "cost":4500, "alt":"UPVC Window Frames",          "alt_carbon":2.55, "saving":69, "cost_saving":42, "urdu":"aluminum"},
    "Aluminum Window":     {"carbon":8.24, "cost":4500, "alt":"UPVC Window Frames",          "alt_carbon":2.55, "saving":69, "cost_saving":42, "urdu":"aluminum khirkiyaan"},

    # ── Glass ─────────────────────────────────────────────────────────────────
    "Glass":               {"carbon":0.85, "cost":350,  "alt":"Double Glazed Glass",         "alt_carbon":0.42, "saving":51, "cost_saving":-30, "urdu":"sheesha"},
    "Single Glaze Glass":  {"carbon":0.85, "cost":350,  "alt":"Double Glazed Glass",         "alt_carbon":0.42, "saving":51, "cost_saving":-30, "urdu":"single sheesha"},

    # ── Paint & Coatings ──────────────────────────────────────────────────────
    "Paint":               {"carbon":2.10, "cost":1200, "alt":"Low-VOC Water-Based Paints",  "alt_carbon":0.90, "saving":57, "cost_saving":10, "urdu":"rang"},
    "Oil Paint":           {"carbon":2.10, "cost":1200, "alt":"Low-VOC Water-Based Paints",  "alt_carbon":0.90, "saving":57, "cost_saving":10, "urdu":"oil rang"},
    "Oil-Based Paint":     {"carbon":2.10, "cost":1200, "alt":"Low-VOC Water-Based Paints",  "alt_carbon":0.90, "saving":57, "cost_saving":10, "urdu":"oil based rang"},

    # ── Roofing ───────────────────────────────────────────────────────────────
    "Bitumen":             {"carbon":0.38, "cost":180,  "alt":"White Solar-Reflective Paint","alt_carbon":0.12, "saving":68, "cost_saving":5,  "urdu":"bitumen"},
    "Bitumen Roofing":     {"carbon":0.38, "cost":180,  "alt":"White Solar-Reflective Paint","alt_carbon":0.12, "saving":68, "cost_saving":5,  "urdu":"bitumen chhatt"},
    "Roofing":             {"carbon":0.38, "cost":180,  "alt":"White Solar-Reflective Paint","alt_carbon":0.12, "saving":68, "cost_saving":5,  "urdu":"chhatt"},

    # ── Piping ────────────────────────────────────────────────────────────────
    "PVC":                 {"carbon":2.50, "cost":280,  "alt":"PPRC Piping",                 "alt_carbon":1.10, "saving":56, "cost_saving":-15, "urdu":"plastic pipe"},
    "PVC Pipe":            {"carbon":2.50, "cost":280,  "alt":"PPRC Piping",                 "alt_carbon":1.10, "saving":56, "cost_saving":-15, "urdu":"PVC pipe"},
    "Plastic Pipe":        {"carbon":2.50, "cost":280,  "alt":"PPRC Piping",                 "alt_carbon":1.10, "saving":56, "cost_saving":-15, "urdu":"plastic nali"},
}

@app.get("/health")
def health():
    return {"status": "running", "message": "EcoScan backend is alive"}

@app.post("/scan")
async def scan_material(file: UploadFile = File(...)):
    img_bytes = await file.read()

    # Detect MIME type from uploaded file
    content_type = file.content_type or "image/jpeg"

    # Pass image as inline bytes dict (required for Gemini 2.x+)
    image_part = {
        "inline_data": {
            "mime_type": content_type,
            "data": base64.b64encode(img_bytes).decode("utf-8")
        }
    }

    # ── STAGE 1: Ask Gemini ONLY for the material name + confidence ──────────
    # This is a lightweight prompt that returns fast for all scans.
    id_prompt = """Look at this image and identify the primary construction or building material.
If no clear construction/building material is visible, reply: {"material": "None", "confidence": 0.0}
Otherwise reply ONLY with JSON, no extra text. Example: {"material": "Fired Brick", "confidence": 0.91}"""

    try:
        id_response = await generate_with_rotation([id_prompt, image_part], timeout=30.0)
        text = id_response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        id_result = json.loads(text.strip())
    except Exception as e:
        import traceback
        print("Gemini ID Error in /scan:", e)
        print(traceback.format_exc())
        id_result = {"material": "Concrete", "confidence": 0.5}

    material_name = id_result.get("material", "None")
    confidence = id_result.get("confidence", 0.0)

    if material_name == "None" or confidence < 0.2:
        return {
            "material": "No material detected",
            "confidence": 0.0,
            "carbon": 0.0,
            "cost": 0,
            "alt": "N/A",
            "alt_carbon": 0.0,
            "saving": 0,
            "urdu_response": "Tasweer mein koi tameeri mawad nahi mila."
        }

    # ── STAGE 2: Look up hardcoded dictionary (instant, no API call) ─────────
    material_lower = material_name.lower()
    matched_key = next((k for k in MATERIALS.keys() if k.lower() in material_lower or material_lower in k.lower()), None)

    if matched_key:
        # ✅ Found in hardcoded dict — super fast, no extra API call needed
        d = MATERIALS[matched_key]
    else:
        # ── STAGE 3: Unknown material — ask Gemini for eco data ──────────────
        print(f"Unknown material '{material_name}' — calling Gemini for eco data...")
        eco_prompt = f"""For the construction material "{material_name}", provide eco-friendly alternative data.
CRITICAL: Do NOT suggest "Recycled {material_name}" — suggest a completely different innovative substitute.
Reply ONLY with JSON, no extra text.
Example: {{"cost": 500, "carbon": 0.4, "alt": "Hempcrete", "alt_carbon": 0.08, "saving": 80, "urdu": "urdu name here"}}"""
        try:
            eco_response = await generate_with_rotation(eco_prompt, timeout=25.0)
            eco_text = eco_response.text.strip()
            if eco_text.startswith("```"):
                eco_text = eco_text.split("```")[1]
                if eco_text.startswith("json"):
                    eco_text = eco_text[4:]
            d = json.loads(eco_text.strip())
        except Exception as e:
            print("Gemini eco fallback error:", e)
            d = {"carbon": 0.5, "cost": 500, "alt": "Eco-friendly alternative", "alt_carbon": 0.2, "saving": 35, "urdu": material_name}

    # ── Build Urdu description ────────────────────────────────────────────────
    urdu_name = d.get("urdu") or material_name

    # Carbon saving: calculated from actual carbon vs alt_carbon values
    carbon = d.get("carbon", 0.5)
    alt_carbon = d.get("alt_carbon", 0.2)
    carbon_saving_pct = round((carbon - alt_carbon) / carbon * 100) if carbon > 0 else 0

    # Cost saving: use explicit cost_saving field if available, else fall back to saving
    cost_saving_pct = d.get("cost_saving", d.get("saving", 35))

    if cost_saving_pct >= 0:
        cost_text = f"aur {cost_saving_pct} fisad sasta bhi hai"
    else:
        cost_text = f"lekin iski qeemat {abs(cost_saving_pct)} fisad zyada hai — magar durr tak faida deta hai"

    urdu_text = (
        f"Yeh {urdu_name} hai. "
        f"Iska eco alternative {d['alt']} hai "
        f"jo {carbon_saving_pct} fisad kam carbon deta hai "
        f"{cost_text}. "
        f"Environment ke liye behtar choice hai."
    )

    return {
        "material": material_name,
        "confidence": confidence,
        "carbon": carbon,
        "cost": d["cost"],
        "alt": d["alt"],
        "alt_carbon": alt_carbon,
        "carbon_saving_pct": carbon_saving_pct,
        "cost_saving_pct": cost_saving_pct,
        "saving": cost_saving_pct,  # kept for backwards compatibility
        "urdu_response": urdu_text,
    }

@app.post("/speak")
async def speak_urdu(data: dict):
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=data["text"])
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-IN",
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    audio_b64 = base64.b64encode(response.audio_content).decode("utf-8")
    return {"audio": audio_b64}

@app.get("/market-data")
async def market_data():
    prompt = """Fetch the current construction material prices in Lahore, Pakistan today (Cement, Steel, Bricks, Sand, Crush).
Provide the response EXACTLY in the following JSON format (do not include markdown formatting or backticks, just the raw JSON object):
{
    "status": "Live",
    "items": [
        { "name": "Bricks (Per 1000)", "price": "₨...", "trend": "...%", "up": true, "icon": "trending_up" },
        { "name": "Cement (Per Bag)", "price": "₨...", "trend": "...%", "up": false, "icon": "trending_down" },
        { "name": "Steel (Per Tonne)", "price": "₨...", "trend": "...%", "neutral": true, "icon": "horizontal_rule" }
    ],
    "prediction": {
        "text": "Based on recent trends, [Provide a realistic 1-2 sentence prediction about prices next week]",
        "confidence": 85
    },
    "hotspot": {
        "title": "Hotspot: [Some relevant place like Raiwind Industrial]",
        "desc": "[Short description of why it's a hotspot]",
        "sand": { "price": "₨...", "trend": "+₨...", "up": true },
        "crush": { "price": "₨...", "trend": "-₨...", "up": false }
    }
}
Ensure the prices and predictions are as accurate as possible based on today's market rates in Pakistan."""

    try:
        response = await asyncio.wait_for(
            model.generate_content_async(prompt, tools='google_search'),
            timeout=30.0
        )
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()
        data = json.loads(text)
        return data
    except Exception as e:
        print("Error fetching real-time data:", e)
        # Return fallback data if real-time fails
        return {
            "status": "Active (Cached)",
            "items": [
                { "name": "Bricks (Per 1000)", "price": "₨20,500", "trend": "1.2%", "up": True, "icon": "trending_up" },
                { "name": "Cement (Per Bag)", "price": "₨1,480", "trend": "0.5%", "up": False, "icon": "trending_down" },
                { "name": "Steel (Per Tonne)", "price": "₨320k", "trend": "0.0%", "neutral": True, "icon": "horizontal_rule" }
            ],
            "prediction": {
                "text": "Based on current market conditions and recent kiln openings, we project a stable pricing environment with a slight downward trend of 1-2% for bulk materials next week.",
                "confidence": 85
            },
            "hotspot": {
                "title": "Hotspot: Raiwind Industrial",
                "desc": "Supplies are 10% cheaper due to new local kiln openings.",
                "sand": { "price": "₨38,000", "trend": "+₨2,000 vs LW", "up": True },
                "crush": { "price": "₨125", "trend": "-₨5 vs LW", "up": False }
            }
        }

@app.get("/list-models")
async def list_models():
    try:
        models = []
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                models.append(m.name)
        return {"available_models": models}
    except Exception as e:
        return {"error": str(e)}
