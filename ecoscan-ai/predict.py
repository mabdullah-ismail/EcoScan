import os
import sys
import numpy as np
import tensorflow as tf
from PIL import Image

CLASSES = ['Brick', 'Concrete', 'Glass', 'Steel', 'Wood', 'Marble', 'Granite', 'Tile', 'PVC', 'Paint']

def test_prediction(image_path):
    model_path = '../ecoscan-pk/material_classifier.h5'
    
    # Check if model exists
    if not os.path.exists(model_path):
        print(f"❌ Saved model not found at: {model_path}")
        print("👉 Please run 'python generate_mock_model.py' to generate a mock weights file first.")
        return
        
    print(f"🔌 Loading Keras model from: {model_path}...")
    try:
        model = tf.keras.models.load_model(model_path)
        print("✅ Model loaded successfully.")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return
    
    # Process image input
    if image_path == 'dummy':
        print("🎨 Generating a random texture image for mathematical verification...")
        # Create a random RGB image (224x224x3)
        img_data = np.random.randint(0, 256, (224, 224, 3), dtype=np.uint8)
        img = Image.fromarray(img_data)
    else:
        if not os.path.exists(image_path):
            print(f"❌ File not found: {image_path}")
            return
        try:
            img = Image.open(image_path)
            print(f"📸 Loaded image: {image_path}")
        except Exception as e:
            print(f"❌ Failed to open image: {e}")
            return
        
    # Preprocess image to match training parameters
    img_processed = img.convert("RGB").resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img_processed)
    img_array = tf.expand_dims(img_array, 0) / 255.0  # Normalize to [0, 1]
    
    # Run prediction
    print("🧠 Running forward inference pass...")
    try:
        predictions = model.predict(img_array)
        probabilities = predictions[0]
        
        best_idx = np.argmax(probabilities)
        best_class = CLASSES[best_idx]
        best_prob = probabilities[best_idx]
        
        print("\n📊 ─── PREDICTION RESULTS ───")
        print(f"🏆 Match Category : {best_class}")
        print(f"📈 Confidence     : {best_prob:.2%}")
        print("\nProbability Breakdown:")
        for idx, prob in enumerate(probabilities):
            bar = "█" * int(prob * 20)
            print(f" - {CLASSES[idx]:<10}: {prob:>7.2%} {bar}")
            
    except Exception as e:
        print(f"❌ Prediction failed: {e}")

if __name__ == '__main__':
    img_path = 'dummy'
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
    else:
        print("💡 Hint: You can pass any image path to test. Example: python predict.py brick_photo.jpg")
        
    test_prediction(img_path)
