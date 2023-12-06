const express = require('express');
const app = express()
require('dotenv').config();

app.use(express.json());
const authmw = require('./Middleware/checkToken');
const token = require('./Route/authRoute')
const routes = require('./Route/userRoute');
const routesUnivers = require('./Route/universRoute');
const OpenAI = require("openai");
const routesCharacters=require('./Route/charactersRoute');
const routeConversation=require('./Route/conversationRoute');
const routeMessage=require('./Route/messageRoute');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

app.use(authmw);
app.use('/', routes); 
app.use('/',token);
app.use('/',routesUnivers);
app.use('/',routesCharacters);
app.use('/',routeConversation);
app.use('/',routeMessage);
app.listen(8080)























