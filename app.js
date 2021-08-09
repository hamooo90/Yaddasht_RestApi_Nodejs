const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const cors = require('cors');
const Note = require('./models/Note');
///////////////////////////////////

let port = process.env.PORT || 3000;


/// Middleware
app.use(cors());//hroku git:///// to use api from other domain
app.use(bodyParser.json());


const notesRoute = require ('./routes/note_route');
const authRoute = require('./routes/auth_route');

app.use('/api/notes',notesRoute);
app.use('/api/users',authRoute);

/// ROUTES
app.get('/',(req,res) => {
    res.send('we are on home');
});



/// connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,{ useNewUrlParser: true , useUnifiedTopology: true } ,() => {
        console.log('connected to DB!');
});

// starts lisstening
app.listen(port, () => {
    console.log('Listening on port ', port);
});