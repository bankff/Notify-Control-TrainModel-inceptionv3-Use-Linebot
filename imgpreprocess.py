from keras.preprocessing.image import ImageDataGenerator

def panupongAugImage():
  train_datagen =ImageDataGenerator(rescale=1./255,
                                    rotation_range=25,
                                    horizontal_flip = 'true')

  validation_datagen = ImageDataGenerator(rescale = 1./255)

  # Change the batchsize according to your system RAM
  train_batchsize = 64
  val_batchsize = 10

  train_generator = train_datagen.flow_from_directory(
          '/content/cats_and_dogs_filtered/train',
          target_size=(224, 224),
          batch_size=train_batchsize,
          class_mode='categorical')

  validation_generator = validation_datagen.flow_from_directory(
          '/content/cats_and_dogs_filtered/validation',
          target_size=(224, 224),
          batch_size=val_batchsize,
          class_mode='categorical')

  return train_generator,validation_generator
