const express = require('express');
const cors = require('cors');
const session = require('express-session');


const router  = require('./routes/index');

const app = express();



app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({secret : 'vehicle_marketplace' , resave : false , saveUninitialized : false , cookie : {maxAge : 60*60* 1000 , httpOnly : true , secure : false  , sameSite: 'lax'}}))
app.use(router);




const port = process.env.PORT || 5000;

app.get("/",(req , res)=>{
    console.log("Welcome to home page");
    res.send("Welcome to homepage");
});

const db = require('./config/db');

db.query('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.log('Database connection failed:', err.message));

module.exports=app;