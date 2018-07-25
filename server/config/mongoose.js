var mongoose = require('mongoose')
var path = require('path')
var fs = require('fs')


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Smash');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection to db successful!');
});

var models_path = path.join(__dirname, '../models');
// read all of the files in the models_path and require (run) each of the javascript files
fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf('.js') >= 0) {
    // require the file (this runs the model file which registers the schema)
    require(models_path + '/' + file);
   }
})