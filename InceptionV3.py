import keras
from keras.applications.inception_v3 import InceptionV3
from keras.preprocessing import image
from keras.models import Model
from keras.layers import Dense, GlobalAveragePooling2D,Dropout,Flatten
from keras.preprocessing.image import ImageDataGenerator
from keras import backend as K
from keras.callbacks import ModelCheckpoint
from keras.callbacks import TensorBoard
import numpy as np
from sklearn.utils import class_weight
import os.path
import fnmatch
import itertools
import functools
from keras.utils import to_categorical
from keras.optimizers import Adam,SGD,Adagrad,Adadelta,RMSprop
from keras.callbacks import Callback
from keras.callbacks import ModelCheckpoint, EarlyStopping ,ReduceLROnPlateau
from keras.layers import Input

def bankModel():
    # create the base pre-trained model
  base_model = InceptionV3(include_top=False,input_shape=(224, 224, 3))
  x = base_model.output
  x = Flatten()(x)
  predictions = Dense(2, activation='softmax')(x)

    # this is the model we will train
  model = Model(inputs=base_model.input, outputs=predictions)

  return model
