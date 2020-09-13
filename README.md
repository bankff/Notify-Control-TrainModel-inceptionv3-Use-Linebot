# Notify-Control-TrainModel-inceptionv3-Use-Linebot
Notify and Control train model inceptionv3 use Linebot 
.This Demo train Dog-Cat use model inceptionv3 CNN 

## Preprocess
   - NodeJS
   - Python(use train model)
   - Firebase realtime database
   - LineAPI
   
## Features
   - Notify result train model every epoch by Linebot
   - Start and Stop train model by Linebot
   - Change epoch,activate and batch size by Linebot

## Settting
   - index.js
   
   `LINE Messaging API SDK for nodejs`   
    
   ``https://line.github.io/line-bot-sdk-nodejs``
      
   ```
   const config = {
           channelAccessToken: '',
           channelSecret: ''}
   ```
           
   `Firebase`
   
   `Can see structure database on file lineaitrain-export.json`
   ```
   var firebaseConfig = {
           apiKey: "",
           authDomain: "",
           databaseURL: "",
           projectId: "",
           storageBucket: "",
           messagingSenderId: "",
           appId: "",
           measurementId: ""
         }
   ```
   - main.py
   
   ```
   cred = credentials.Certificate("")
   ```
   
   ```
   firebase_admin.initialize_app(cred, {
    'databaseURL' : ''
   })
   ```
   
   ## Run
   - Deploy NodeJS to server 
   - Download dataset Cat-Dog
      
      ``!wget --no-check-certificate \
    https://storage.googleapis.com/mledu-datasets/cats_and_dogs_filtered.zip``
    
      ``!unzip /cats_and_dogs_filtered.zip``
   - Run main.py
   - You can start,control on line-bot
   
   ## Config train 
   
   ![Image of Yaktocat](https://github.com/bankff/Notify-Control-TrainModel-inceptionv3-Use-Linebot/blob/master/%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%AD%202563-09-14%20%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%2000.06.31.png)
   
   ## Notify result 
   
  ![Image of Yaktocat](https://github.com/bankff/Notify-Control-TrainModel-inceptionv3-Use-Linebot/blob/master/%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%88%E0%B8%AD%202563-09-14%20%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%2000.11.00.png)



#โปรเจคนี้เป็นเพียงเเค่การโชว์ระบบเเจ้งเตือนผลเเละควบคุมการเทรนโมเดลเท่านั้น ไม่ได้เน้นประสิทธิภาพโมเดล

