const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({limit: '20mb', extended: true});
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO.listen(server);
const jwtRouteAuth = require('./helper/jwtAuthentication.js');
const Emit = require('./api/emit/emit.controller.js');
const fileUpload = require('express-fileupload');
const config = require('./config');
const routes = require('./router');
var mongoose = require('mongoose');
const { StreamChat } = require('stream-chat');
require('dotenv').config();
//var morgan = require('morgan');
//var morganext = require('mongo-morgan-ext');
app.use(express.urlencoded({extended: false}));
const  request = require('request');

//cors
app.use(cors());
app.use(fileUpload());
// Bordy parser
app.use(bodyParser.json({limit: '20mb'}));
app.use(urlencodedParser);
// Authenticate Requests to the api
// app.use(jwtRouteAuth());
app.use(express.static('./files'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/access_token',(req,res)=>{
    //access token

    request ({

    },
        (error,response,body) =>{}
    )
}) ;
 
const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
      console.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
      setTimeout(()=>{
        Emit(app, io);
      }, 1)
  });

  next()
};

app.use(logRequestStart);

// Connecting to database
mongoose.connect(config.mongo.url, {useNewUrlParser: true, useCreateIndex: true}).then(r =>{
  console.log('Database Connected...');
}).catch(r =>{ console.log('Database Not Connected!!')});

//chats
const serverSideClient = new StreamChat(
    process.env.STREAM_API_KEY,
    process.env.STREAM_APP_SECRET
);

app.post('/join', async (req, res) => {
    const { username } = req.body;
    const token = serverSideClient.createToken(username);
    try {
        await serverSideClient(
            {
                id: username,
                name: username,
            },
            token
        );
    } catch (err) {
        console.log(err);
    }

    const admin = { id: 'admin' };
    const channel = serverSideClient.channel('team', 'talkshop', {
        name: 'Talk Shop',
        created_by: admin,
    });

    try {
        await channel.create();
        await channel.addMembers([username, 'admin']);
    } catch (err) {
        console.log(err);
    }

    return res
        .status(200)
        .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
});

//Socket Connection
io.on('connection', function(){});

routes.register(app);


// Listening to port
server.listen(8000, () => {
  console.log('Server running on localhost:8000');
});

module.exports = app;
