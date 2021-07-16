const dotenv = require('dotenv').config();
const { QuickTwitchBot } = require("quick-chat-bot");
const path = require("path");
const tmi = require('tmi.js');
const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");



/* 
const countElement = document.querySelector('#count');
const winnerElement = document.querySelector('#winner');
const rndNumElement = document.querySelector('#nextWinNumber');
const params = new URLSearchParams(window.location.search); */

const percentage = 10;
var userName = '';
var totalSubs = 0;
var totalGifts = 0;


// connnect to DB

const uri = process.env.URI
const dbClient = new MongoClient(uri);

//https://www.youtube.com/watch?v=M9Fs-CCe0Jo

async function insertDB() {
  try {
    await dbClient.connect();
    const database = dbClient.db("mysterydb");
    const VIPCollection = database.collection("collectVIP");
    console.log('Connected to DB to insert a record');
    // create a document to be inserted
    const doc = {
      giftedUser: userName,
      percentage: percentage,
      timestamp: new Date()
    };
    const result = await VIPCollection.insertOne(doc);
    totalGifts = totalGifts + 1;
    console.log(`Total Gifted VIPS = ${totalGifts}`);
    console.log( `${result.insertedCount} document for ${userName} inserted with the _id: ${result.insertedId}`);
      
    
      // blank out the userName
    //    userName = '';
  } 
  catch (ex){

    console.log(`Something bad happened ${ex}`);
  }
  finally {
  }
}

// -------------------------------------------------------------------------
function monitorChat() {
const client = new tmi.Client({
   options: { debug: true },
    identity: {
    username: process.env.RP_CHANNEL_USERNAME,
    password: process.env.RP_OAUTH_TOKEN
     },
    channels: [ process.env.RP_CHANNEL_NAME ]
     });

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages from this bot
	    if (self) return;

    var parsedMessage = message.split(' ');

      // Scrub the messages for subscriptions -------------------------------------------------
   if (((parsedMessage[1] === "just") &&
      (parsedMessage[2] === "subscribed") &&
      (parsedMessage[3] === "for") &&
      (parsedMessage[5] === "months") &&
      (parsedMessage[6] === "in") &&
      (parsedMessage[7] === "a") &&
      (parsedMessage[8] === "row") &&
      (parsedMessage[9] === "PogChamp")
      ) 

      || 
      
      ((parsedMessage[1] === "just") &&
      (parsedMessage[2] === "subscribed") &&
      (parsedMessage[3] === "PogChamp")))
      {
totalSubs = totalSubs + 1;
console.log(`Total Subs = ${totalSubs}`);

        // call the calcRandomNum function to see if it gets a gifted VIP
        if (calcRandomNum()){
        userName = parsedMessage[0];

        // add to database
        insertDB().catch(console.dir);

        //VIP the user
        //client.say(channel, `/unvip a__and__w`);
        client.say(channel, `/vip ${userName}`);

        //connect as the BOT to announce to chat
        connectAsBot(userName);


        
        function connectAsBot(userName){

            const client = new tmi.Client({
              options: { debug: true },
               identity: {
               username: process.env.MELON_BOT,
               password: process.env.MELON_BOT_OAUTH_TOKEN
                },
               channels: [ process.env.RP_CHANNEL_NAME ]
                });
                
                client.connect(channel);

            setTimeout(function(){
              client.say(channel, `Congratulations ${userName}. Because of your subscription, you have been randomly gifted VIP status for 24 hours.`);
              client.disconnect();
            }, 15000)
       }
   }

      // Randomly select a VIP -------------------------------------------------
    // Table of Percentges https://www.ncbi.nlm.nih.gov/books/NBK126161/

      function calcRandomNum (){
      const min = 1;
      const max = 10;
      const match = 4;
          // generating a random number
      const a = Math.floor(Math.random() * (max - min + 1)) + min;
      
      if (a === match) {
        console.log(`Random value between ${min} and ${max} is ${a}.  There is a match with ${match}`);
          return(true);
             }
          else {
             return(false);
             }
      }
      // End Randomly select a VIP -------------------------------------------------
    } 
}  
 )//end client.on
}

monitorChat();
