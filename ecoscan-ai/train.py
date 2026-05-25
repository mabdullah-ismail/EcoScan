import os
import tensorflow as tf
from tensorflow.keras import layers, models, applications
import matplotlib.pyplot as plt

# ── CONFIGURATION ─────────────────────────────────────────────────────────────
CLASSES = ['Brick', 'Concrete', 'Glass', 'Steel', 'Wood', 'Marble', 'Granite', 'Tile', 'PVC', 'Paint']
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
DATASET_DIR = './dataset'

def build_model(num_classes):
    """
    Builds a Transfer Learning model using MobileNetV2.
    It freezes the base model and attaches a new classification head.
    """
    base_model = applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    # Freeze base model parameters
    base_model.trainable = False

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(128, activation='relu'),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def load_data(dataset_path):
    """
    Loads and splits dataset from directory.
    Uses image_dataset_from_directory for fast tf.data loading.
    """
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE
    )
    return train_ds, val_ds

def plot_metrics(history):
    """Plots training and validation accuracy/loss curves."""
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']
    
    epochs_range = range(len(acc))

    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label='Training Accuracy')
    plt.plot(epochs_range, val_acc, label='Validation Accuracy')
    plt.legend(loc='lower right')
    plt.title('Training and Validation Accuracy')

    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label='Training Loss')
    plt.plot(epochs_range, val_loss, label='Validation Loss')
    plt.legend(loc='upper right')
    plt.title('Training and Validation Loss')
    plt.savefig('training_metrics.png')
    print("Metrics plotted and saved to training_metrics.png")

if __name__ == '__main__':
    print("AI Lab: Material Classification Pipeline Initialized")
    
    # 1. Create a dummy dataset directory if none exists, to allow script to compile
    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)
        for c in CLASSES:
            os.makedirs(os.path.join(DATASET_DIR, c), exist_ok=True)
        print(f"Created empty dataset skeleton in '{DATASET_DIR}'. Place training images here.")
        print("Please gather ~100 sample images per material or download MINC-23 subset.")
    else:
        try:
            train_ds, val_ds = load_data(DATASET_DIR)
            
            # 2. Build model
            model = build_model(len(CLASSES))
            model.summary()
            
            # 3. Train
            print("Starting training...")
            history = model.fit(
                train_ds,
                validation_data=val_ds,
                epochs=EPOCHS
            )
            
            # 4. Save metrics and weights
            plot_metrics(history)
            model.save('../ecoscan-pk/material_classifier.h5')
            print("Model weights successfully saved to ../ecoscan-pk/material_classifier.h5")
        except Exception as e:
            print("Dataset folder is empty or not fully populated yet. Skipping execution loop.")
            print(f"Details: {e}")
