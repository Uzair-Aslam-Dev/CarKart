

const express = require('express');
const cors = require('cors');


const router  = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());

app.use(router);




const port = process.env.PORT || 5000;

app.get("/",(req , res)=>{
    console.log("Welcome to home page");

    res.send("Welcome to homepage");
})

    const db = require('./config/db');
    db.query('SELECT 1')
        .then(() => console.log('Database connected successfully'))
        .catch((err) => console.log('Database connection failed:', err.message));

module.exports=app;