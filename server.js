/* Template for app modulization */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8000;
var path = require('path');

// require express-session to use it
var session = require('express-session');

app.use(session({
    secret: 'keyboardHero',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))


var server = app.listen(port, function() {
    console.log(`Listening on port ${port}`);
})

app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json  //  since Angular is processing JSON, it must be json!!!!!
app.use(bodyParser.json())

//app.use(express.static(path.join(__dirname, './client/static')));

//angular_app_name/dist/angular_app_name
app.use(express.static( __dirname + '/smash/dist/smash' ));

// this route will be triggered if any of the routes above did not match
/*app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./smash/dist/smash/index.html"))
});*/


require('./server/config/mongoose.js')   // Models
require('./server/models/allMod.js');
require('./server/config/routes.js')(app);  // routes.js is  export module (app) got it?


