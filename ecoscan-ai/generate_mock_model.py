import os
import tensorflow as tf
from tensorflow.keras import layers, models

CLASSES = ['Brick', 'Concrete', 'Glass', 'Steel', 'Wood', 'Marble', 'Granite', 'Tile', 'PVC', 'Paint']

def generate_mock():
    # Build a tiny CNN model matching the input/output shape requirements
    model = models.Sequential([
        layers.Input(shape=(224, 224, 3)),
        layers.Conv2D(8, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(len(CLASSES), activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Save the model
    target_dir = '../ecoscan-pk'
    os.makedirs(target_dir, exist_ok=True)
    target_path = os.path.join(target_dir, 'material_classifier.h5')
    model.save(target_path)
    print(f"Tiny mock Keras model successfully saved to: {target_path}")

if __name__ == '__main__':
    generate_mock()
