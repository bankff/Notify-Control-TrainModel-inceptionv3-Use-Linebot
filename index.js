const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces');
const PORT = process.env.PORT || 5000
const line = require('@line/bot-sdk');
const bodyParser = require('body-parser')
const request = require('request')
var admin = require('firebase-admin');

const config = {
  channelAccessToken: '',
  channelSecret: ''
};
const client = new line.Client(config);
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.get('/cool', (req, res) => res.send(cool()));
app.get('/callback', (req, res) => res.end(`I'm listening. Please access with POST.`));

var firebase = require("firebase/app");

require("firebase/database");
require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

function writeUserData(name) {
  firebase.database().ref('status').update({
    '0': 0,
  },function(error) {
    if (error) {
      return console.log("The write failed");
    } else {
      return console.log("saved successfully");
    }
  });
  firebase.database().ref('runtime').update({
    '0': name,
  },function(error) {
    if (error) {
      return console.log("The write failed");
    } else {
      return console.log("saved successfully");
    }
  });
}
var loss = firebase.database().ref('users/' + 'loss/0').on('value',function(snapshot){
    global.val2="loss: "+snapshot.val()+"\n";
});
var accuracy = firebase.database().ref('users/' + 'accuracy/0').on('value',function(snapshot){
    global.val3="accuracy: "+snapshot.val()+"\n";
});
var val_accuracy = firebase.database().ref('users/' + 'val_loss/0').on('value',function(snapshot){
    global.val4="val_loss: "+snapshot.val()+"\n";
});
var val_loss = firebase.database().ref('users/' + 'val_accuracy/0').on('value',function(snapshot){
    global.val5="val_accuracy: "+snapshot.val()+"\n";
});
var runtime = firebase.database().ref('runtime/0').on('value',function(snapshot){
    global.val6=snapshot.val();
});
var starCountRef = firebase.database().ref('status/0');
starCountRef.on('value', function(snapshot) {
  if (snapshot.val() != '0') {
    return client.broadcast({type: 'text', text: snapshot.val()+"\n"+global.val2+global.val3+global.val4+global.val5});
  }
});

// webhook callback
app.post('/callback', line.middleware(config), (req, res) => {
  //console.log(req);
  if (req.body.destination) {
    console.log("Destination User ID: " + req.body.destination);
  }

  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  // handle events separately
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// callback function to handle a single event
function handleEvent(event) {
    if(event.type !== 'message' || event.message.type !== 'text'){
      return res.status(500).end();
    }
    var res = event.message.text;
    switch(event.message.text) {
      case 'stop':
          console.log(global.val6);
          if(global.val6 != 'start' ){
            return client.replyMessage(event.replyToken, { type: 'text', text: 'Can not stop Train model' });
          }
          writeUserData(event.message.text);
          return client.replyMessage(event.replyToken, { type: 'text', text: 'Stop train next epoch success' });
      case 'start':
            firebase.database().ref('runtime').update({
              '0': 'opt',
            },function(error) {
              if (error) {
                return console.log("The write failed");
              } else {
                return console.log("save success");
              }
            });
            return client.replyMessage(event.replyToken, { type: 'text', text: 'select opt SGD or adam' });
    default:
    //opt
    console.log(global.val6)
      if(global.val6 == 'opt' && (event.message.text == 'adam' || event.message.text == 'SGD' )){
        firebase.database().ref('optimize').update({
          'opt': event.message.text,
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        firebase.database().ref('runtime').update({
          '0': 'lr',
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        return client.replyMessage(event.replyToken, { type: 'text', text: 'select lr 1=0.01 ,2=0.001,3=0.0001,4=0.00001' });
      }
      //lr
      if(global.val6 == 'lr' && (parseFloat(event.message.text) == 0.01 || parseFloat(event.message.text) == 0.001|| parseFloat(event.message.text) == 0.0001||parseFloat(event.message.text) == 0.00001 )){
        firebase.database().ref('optimize').update({
          'lr': parseFloat(event.message.text),
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        firebase.database().ref('runtime').update({
          '0': 'numepoch',
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        return client.replyMessage(event.replyToken, { type: 'text', text: 'select numepoch' });
      }
      //num  epoch
      if(global.val6 == 'numepoch' && parseInt(event.message.text,10) >0 ){
        firebase.database().ref('optimize').update({
          'numepoch': parseInt(event.message.text,10),
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        firebase.database().ref('runtime').update({
          '0': 'batchsize',
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        return client.replyMessage(event.replyToken, { type: 'text', text: 'select batchsize < 129' });
      }
      if(global.val6 == 'batchsize' && parseInt(event.message.text,10) < 129){
        firebase.database().ref('optimize').update({
          'batchsize': parseInt(event.message.text,10),
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        firebase.database().ref('runtime').update({
          '0': 'start',
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        firebase.database().ref('statusOPT').update({
          '0': 'set',
        },function(error) {
          if (error) {
            return console.log("The write failed");
          } else {
            return console.log("saved successfully");
          }
        });
        return client.replyMessage(event.replyToken, { type: 'text', text: 'Start Train Model Success' });
      }
    return client.replyMessage(event.replyToken, { type: 'text', text: 'Please try again' });
    }
};

function setStart(name){
  firebase.database().ref('users').set({
    'accuracy': 0,
    'loss': 0,
    'val_accuracy': 0,
    'val_loss': 0,
    'epoch': 0
  },function(error) {
    if (error) {
      return console.log("The write failed");
    } else {
      return console.log("saved successfully");
    }
  });
  firebase.database().ref('runtime').set({
    '0': 'opt',
  },function(error) {
    if (error) {
      return console.log("The write failed");
    } else {
      return console.log("saved successfully");
    }
  });
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
