import os
import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from neo4j import GraphDatabase

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

# ── SEED DATA DEFINITIONS ─────────────────────────────────────────────────────

# Standard materials and their details for MongoDB
MATERIALS_DATA = [
    # Masonry
    {"material_id": "m1", "name": "Fired Brick", "category": "Masonry", "carbon_kg_co2": 0.24, "cost_pkr": 12, "unit": "nos", "urdu": "pakki eent"},
    {"material_id": "m2", "name": "AAC Blocks", "category": "Masonry", "carbon_kg_co2": 0.09, "cost_pkr": 9, "unit": "nos", "urdu": "AAC block"},
    {"material_id": "m3", "name": "Red Clay Brick", "category": "Masonry", "carbon_kg_co2": 0.22, "cost_pkr": 9, "unit": "nos", "urdu": "lal eent"},
    {"material_id": "m4", "name": "Fly Ash Bricks", "category": "Masonry", "carbon_kg_co2": 0.08, "cost_pkr": 8, "unit": "nos", "urdu": "fly ash eent"},
    
    # Structural
    {"material_id": "m5", "name": "Concrete", "category": "Structural", "carbon_kg_co2": 0.41, "cost_pkr": 180, "unit": "cubic ft", "urdu": "concrete"},
    {"material_id": "m6", "name": "Fly Ash Concrete", "category": "Structural", "carbon_kg_co2": 0.21, "cost_pkr": 150, "unit": "cubic ft", "urdu": "fly ash concrete"},
    {"material_id": "m7", "name": "Cement", "category": "Structural", "carbon_kg_co2": 0.83, "cost_pkr": 1480, "unit": "bag", "urdu": "cement"},
    {"material_id": "m8", "name": "Fly Ash / Slag Cement", "category": "Structural", "carbon_kg_co2": 0.35, "cost_pkr": 1258, "unit": "bag", "urdu": "fly ash cement"},
    {"material_id": "m9", "name": "Steel Rebar", "category": "Structural", "carbon_kg_co2": 1.46, "cost_pkr": 320, "unit": "kg", "urdu": "saria"},
    {"material_id": "m10", "name": "Recycled Steel Rebar", "category": "Structural", "carbon_kg_co2": 0.62, "cost_pkr": 272, "unit": "kg", "urdu": "recycled saria"},
    {"material_id": "m11", "name": "GFRP (Basalt) Rebar", "category": "Structural", "carbon_kg_co2": 0.51, "cost_pkr": 288, "unit": "kg", "urdu": "GFRP saria"},

    # Sand & Aggregate
    {"material_id": "m12", "name": "River Sand", "category": "Aggregate", "carbon_kg_co2": 0.05, "cost_pkr": 38000, "unit": "truckload", "urdu": "darya ki ret"},
    {"material_id": "m13", "name": "Crushed Stone Sand (Washed)", "category": "Aggregate", "carbon_kg_co2": 0.02, "cost_pkr": 34200, "unit": "truckload", "urdu": "crush ret"},
    {"material_id": "m14", "name": "Crushed Stone", "category": "Aggregate", "carbon_kg_co2": 0.04, "cost_pkr": 125, "unit": "cubic ft", "urdu": "bajri"},
    {"material_id": "m15", "name": "Recycled Concrete Aggregate", "category": "Aggregate", "carbon_kg_co2": 0.01, "cost_pkr": 100, "unit": "cubic ft", "urdu": "recycled concrete bajri"},

    # Flooring
    {"material_id": "m16", "name": "Marble", "category": "Flooring", "carbon_kg_co2": 0.45, "cost_pkr": 220, "unit": "sqft", "urdu": "marmar"},
    {"material_id": "m17", "name": "Terrazzo (Chips Flooring)", "category": "Flooring", "carbon_kg_co2": 0.18, "cost_pkr": 143, "unit": "sqft", "urdu": "chips farsh"},
    {"material_id": "m18", "name": "Ceramic Tile", "category": "Flooring", "carbon_kg_co2": 0.59, "cost_pkr": 95, "unit": "sqft", "urdu": "ceramic tile"},
    {"material_id": "m19", "name": "Terrazzo Tiles", "category": "Flooring", "carbon_kg_co2": 0.22, "cost_pkr": 71, "unit": "sqft", "urdu": "terrazzo tile"},

    # Wood
    {"material_id": "m20", "name": "Timber", "category": "Wood", "carbon_kg_co2": 0.31, "cost_pkr": 850, "unit": "cubic ft", "urdu": "lakri"},
    {"material_id": "m21", "name": "Bamboo", "category": "Wood", "carbon_kg_co2": 0.05, "cost_pkr": 450, "unit": "nos", "urdu": "baans"},
    {"material_id": "m22", "name": "WPC (Wood Plastic Composite)", "category": "Wood", "carbon_kg_co2": 0.12, "cost_pkr": 808, "unit": "sqft", "urdu": "WPC board"},

    # Piping
    {"material_id": "m23", "name": "PVC Pipe", "category": "Piping", "carbon_kg_co2": 2.50, "cost_pkr": 280, "unit": "meter", "urdu": "PVC pipe"},
    {"material_id": "m24", "name": "PPRC Piping", "category": "Piping", "carbon_kg_co2": 1.10, "cost_pkr": 322, "unit": "meter", "urdu": "PPRC pipe"},

    # Paint
    {"material_id": "m25", "name": "Paint", "category": "Paint", "carbon_kg_co2": 2.10, "cost_pkr": 1200, "unit": "liter", "urdu": "rang"},
    {"material_id": "m26", "name": "Low-VOC Water-Based Paint", "category": "Paint", "carbon_kg_co2": 0.90, "cost_pkr": 1080, "unit": "liter", "urdu": "low VOC rang"},

    # Glass
    {"material_id": "m27", "name": "Single Glaze Glass", "category": "Glass", "carbon_kg_co2": 0.85, "cost_pkr": 350, "unit": "sqft", "urdu": "single sheesha"},
    {"material_id": "m28", "name": "Double Glazed Glass", "category": "Glass", "carbon_kg_co2": 0.42, "cost_pkr": 455, "unit": "sqft", "urdu": "double glazed sheesha"}
]

# Substitution Graph data (standard -> alternative)
ALTERNATIVES_EDGES = [
    ("Fired Brick", "AAC Blocks", 62, 25),
    ("Red Clay Brick", "Fly Ash Bricks", 64, 11),
    ("Concrete", "Fly Ash Concrete", 49, 17),
    ("Cement", "Fly Ash / Slag Cement", 58, 15),
    ("Steel Rebar", "Recycled Steel Rebar", 58, 15),
    ("Steel Rebar", "GFRP (Basalt) Rebar", 65, 10),
    ("River Sand", "Crushed Stone Sand (Washed)", 60, 10),
    ("Crushed Stone", "Recycled Concrete Aggregate", 75, 20),
    ("Marble", "Terrazzo (Chips Flooring)", 60, 35),
    ("Ceramic Tile", "Terrazzo Tiles", 63, 25),
    ("Timber", "Bamboo", 84, 47),
    ("Timber", "WPC (Wood Plastic Composite)", 61, 5),
    ("PVC Pipe", "PPRC Piping", 56, -15),
    ("Paint", "Low-VOC Water-Based Paint", 57, 10),
    ("Single Glaze Glass", "Double Glazed Glass", 51, -30)
]

def seed_mongodb():
    if not MONGO_URI:
        print("❌ MONGO_URI missing in .env. Skipping MongoDB Seeding.")
        return
    
    print("🔌 Connecting to MongoDB...")
    client = MongoClient(MONGO_URI)
    db = client.get_database("ecoscan")
    
    # 1. Seed Materials Collection
    print("🌱 Seeding 'materials' collection...")
    db.materials.drop()
    db.materials.insert_many(MATERIALS_DATA)
    db.materials.create_index("name", unique=True)
    db.materials.create_index([("carbon_kg_co2", 1), ("cost_pkr", 1)])
    
    # 2. Setup Scans Collection & TTL Index (90 days)
    print("🌱 Setting up indexes on 'scans' collection...")
    try:
        db.scans.drop_index("timestamp_1")
    except Exception:
        pass
    # TTL Index (90 days = 7776000 seconds)
    db.scans.create_index("timestamp", expireAfterSeconds=7776000)
    db.scans.create_index([("location", 1), ("timestamp", -1)])
    
    # 3. Setup Analytics Cache & TTL Index (24 hours = 86400 seconds)
    print("🌱 Setting up indexes on 'analytics_cache' collection...")
    db.analytics_cache.create_index("generated_at", expireAfterSeconds=86400)
    
    # 4. Seed Contractor Profiles
    print("🌱 Seeding sample 'contractors' collection...")
    db.contractors.drop()
    db.contractors.insert_many([
        {"contractor_id": "c1", "name": "Al-Rehman Builders", "region": "Gulberg, Lahore", "total_scans": 42, "preferred_materials": ["AAC Blocks", "Fly Ash Cement"]},
        {"contractor_id": "c2", "name": "Crescent Construction", "region": "DHA Phase 6, Lahore", "total_scans": 18, "preferred_materials": ["Fly Ash Concrete", "Timber"]},
        {"contractor_id": "c3", "name": "Punjab Developers", "region": "Johar Town, Lahore", "total_scans": 95, "preferred_materials": ["Recycled Steel Rebar", "Terrazzo Tiles"]}
    ])
    
    print("✅ MongoDB Seeding Completed successfully.")

def seed_neo4j():
    if not NEO4J_URI or not NEO4J_PASSWORD:
        print("❌ NEO4J_URI or NEO4J_PASSWORD missing in .env. Skipping Neo4j Seeding.")
        return
    
    print("🔌 Connecting to Neo4j...")
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    
    with driver.session() as session:
        print("🧹 Clearing Neo4j Graph Database...")
        session.run("MATCH (n) DETACH DELETE n")
        
        # 1. Create Category nodes
        print("🌱 Seeding Category nodes...")
        categories = set(m["category"] for m in MATERIALS_DATA)
        for cat in categories:
            session.run("CREATE (:Category {name: $name})", name=cat)
            
        # 2. Create Material nodes
        print("🌱 Seeding Material nodes...")
        for m in MATERIALS_DATA:
            session.run("""
                CREATE (:Material {
                    name: $name,
                    carbon_score: $carbon,
                    cost_pkr: $cost,
                    unit: $unit,
                    urdu: $urdu,
                    category: $category
                })
            """, name=m["name"], carbon=m["carbon_kg_co2"], cost=m["cost_pkr"], unit=m["unit"], urdu=m["urdu"], category=m["category"])
            
        # 3. Create BELONGS_TO relationships
        print("🌱 Creating BELONGS_TO relationships...")
        session.run("""
            MATCH (m:Material), (c:Category)
            WHERE m.category = c.name
            CREATE (m)-[:BELONGS_TO]->(c)
        """)
        
        # 4. Create HAS_ALTERNATIVE substitution relationships
        print("🌱 Creating HAS_ALTERNATIVE relationships...")
        for src, dest, carb_saved, cost_saved in ALTERNATIVES_EDGES:
            session.run("""
                MATCH (a:Material {name: $src}), (b:Material {name: $dest})
                CREATE (a)-[:HAS_ALTERNATIVE {
                    carbon_reduction_pct: $carb_saved,
                    cost_delta_pct: $cost_saved
                }]->(b)
            """, src=src, dest=dest, carb_saved=carb_saved, cost_saved=cost_saved)
            
    driver.close()
    print("✅ Neo4j Seeding Completed successfully.")

if __name__ == "__main__":
    print("🚀 Starting EcoScan PK Advanced Database Seed Script...")
    seed_mongodb()
    seed_neo4j()
    print("🎉 Polyglot Persistence Layer successfully seeded!")
