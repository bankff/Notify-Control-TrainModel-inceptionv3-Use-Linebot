import firebase_admin
from firebase_admin import credentials
from  InceptionV3  import bankModel
from  imgpreprocess  import panupongAugImage
from keras.optimizers import Adam,SGD,Adagrad,Adadelta,RMSprop
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

cred = credentials.Certificate("")
firebase_admin.initialize_app(cred, {
    'databaseURL' : ''
})

from firebase_admin import db
ref = db.reference('users')
ref2 = db.reference('status')
ref3 = db.reference('runtime')
ref4 = db.reference('optimize')
ref5 = db.reference('statusOPT')

history=[]
def call_model(opt='adam',lr=1e-3,):
  model = bankModel()
  if (opt == 'adam'):
      opt=Adam(lr=lr)
  else:
      opt = SGD(lr=lr)
  model.compile(optimizer=opt, loss='categorical_crossentropy',metrics=['accuracy'])
  model.summary()

  return model

def main():
  batchsize=64
  model = call_model()
  train_generator,validation_generator = panupongAugImage()
  checkpoint = ModelCheckpoint("/weights-adamv2-{epoch:02d}.h5", monitor='val_accuracy', verbose=2, save_best_only=True, save_weights_only=False, mode='max')
  while(True):
    epoch=0
    while(ref3.child('0').get() == 'start'):
      if(ref5.child('0').get() == 'set'):
          model = call_model(ref4.child('opt').get(),ref4.child('lr').get())
          batchsize = ref4.child('batchsize').get()
          ref5.update({
              '0':'unset'
          })
      print("start")
      epoch+=1
      print(epoch)
      history = model.fit(
            train_generator,
            epochs=1,
            batch_size=batchsize,
            validation_data=validation_generator,
            verbose=1,callbacks=[checkpoint])
      print(history.history['loss'])
      ref.update({
      'accuracy': history.history['accuracy'],
      'loss': history.history['loss'],
      'val_accuracy': history.history['val_accuracy'],
      'val_loss': history.history['val_loss'],
      })
      #   อัพเดท epoch เพื่อให้ nodejs ส่งผลลัพธ์ของเเต่ epoch ไปที่ Line
      #.  สร้าง node เเยกเพราะ API ของ firebase ดัก event ที่ node นั้นถึงเเม้จะกำหนด ref
      #.  ไปที่ node ลูกนั้นๆเเล้ว เเต่ถ้า node ลูกอื่นๆอัพเดทจะทำให้  node ลูกที่เรา ref ไปนั้นอัพเดทด้วยถึงเเม้ค่าข้างในไม่เปลี่ยนเเปลงก็ตาม
      #.  อาจมีวิธีที่ดีกว่านี้เเต่มีเวลาทำจำกัด เลยใช้วิธีสร้าง node เเยกซึ่งจัดการได้ง่ายกว่า
      ref2.update({
          '0':epoch
      })
      if (epoch == ref4.child('numepoch').get() ):
          ref2.update({
              '0':0
          })
          ref3.update({
              '0':'stop'
          })
          break

if __name__ == "__main__":
    main();
