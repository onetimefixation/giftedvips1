const dotenv = require('dotenv').config();
//const { QuickTwitchBot } = require("quick-chat-bot");
const path = require("path");
const tmi = require('tmi.js')
const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");
const uri = process.env.URI;
const dbClient = new MongoClient(uri);

const client = new tmi.Client({
    options: { debug: true },
     identity: {
     username: process.env.RP_CHANNEL_USERNAME,
     password: process.env.RP_OAUTH_TOKEN
      },
     channels: [ process.env.RP_CHANNEL_NAME ]
      });

 client.connect();

// do any special broadcaster commands here like unVIPing a user
   client.on('join', (channel, tags, message, self) => {
   console.log('connected ..........');

   setTimeout(function(){
    client.say(channel, `/unvip catzofduty`);
 }, 5000)
});  
 


   async function checkDB1() {
    try {
      await dbClient.connect();
      const database = dbClient.db("mysterydb");
      const VIPCollection = database.collection("collectVIP");
      console.log('Connected to DB to check expirations');
  
      //const searchCursor = await VIPCollection.find();
  
      // OPTION 1 - while method for retieving all documents --- USE THIS FOR A LARGE AMOUNT OF DOCUMENT
      /* while (await searchCursor.hasNext()){
        console.log(await searchCursor.next());
      } */
  //******************************************************************************************************/
      // OPTION 2 - read everything and put it into an array --- VERY EXPENSIVE - ONLY FOR SMALL NUMBER OF DOCUMENTS
  
      //const result = await searchCursor.toArray();
      //result.forEach(r=>console.log(r));
      //console.table(result);
  //******************************************************************************************************/
      // OPTION 3 - use a filter --- PROBABLY MOST COMMON
  
       const findResult = await VIPCollection.deleteMany({
          "timestamp":{$lt: new Date((new Date())-1000*60*60*24)}}); 
      //findResult.forEach(r=>console.log(r)); 

  //******************************************************************************************************/
  
   }
      catch (ex) {
  
        console.log(`Something bad happened ${ex}`);
     
    } finally {
  
    }
  }
  
  
  function cron(ms, fn) {
    function cb() {
        clearTimeout(timeout)
        timeout = setTimeout(cb, ms)
        fn()
    }
    let timeout = setTimeout(cb, ms)
    return () => {}
  }
  
  // invoke the cron job every 12 hrs
  cron(1000 * 60 * 1, () => {
                    console.log("checking on database file");
                    checkDB1();
                    });