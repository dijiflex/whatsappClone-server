// Importing 
import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors'

//App configuration
const app = express();
const port = process.env.PORT || 9000;
dotenv.config({ path: './config.env' });
 
const pusher = new Pusher({
    appId: "1213942",
    key: `${process.env.PUSHERKEY}`,
    secret: `${process.env.pusherSecret}`,
    cluster: "mt1",
    useTLS: true
  });

// pusher.trigger("my-channel", "my-event", {
//   message: "hello world"
// });

// Middlewares
app.use(express.json()) 

app.use(cors())

/// Database Config
const connection_url = process.env.databaseconnection;
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'));

//???? 
const db = mongoose.connection
db.once('open', ()=>{
    const msqCollection = db.collection('messagecontents');
    const changeStream = msqCollection.watch();

    changeStream.on('change',   (change) => {
        // console.group(change);

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
           
                pusher.trigger('messages', 'inserted',{
                    name : messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received
                })

           
        } else {
            console.log('Error triggering pusher')
        }
    })
})



//Api routes
app.get('/', (req, res) => res.status(200).send('Hello world bro'));
app.get('/api/v1/messages/sync', (req, res) => {
    const dbMessage = req.body;
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else{
            res.status(200).send(data)
        }
    })
})

app.post('/api/v1/messages/new', (req, res) => {
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else{
            res.status(201).send(data)
        }
    })
})


//Listn
const server = app.listen(port, ()=> console.log(`Listening on port ${port}`))

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });



