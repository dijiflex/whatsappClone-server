// Importing 
import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Messages from './dbMessages.js';

//App configuration
const app = express();
const port = process.env.PORT || 9000

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1213942",
  key: "9437e4eacdd7efa52e4e",
  secret: "11a337efa71c30c3157f",
  cluster: "mt1",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});

//reading .env fle to nodeprocess
dotenv.config({ path: './config.env' });

// Middlewares
app.use(express.json()) 

/// Database Config
const connection_url = process.env.databaseconnection;
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//???? 


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
app.listen(port, ()=> console.log(`Listening on port ${port}`))




