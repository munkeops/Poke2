var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./api/models/usermodel'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/Tododb'); 
const string1=" "// add your database string here
mongoose.connect(string1,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex: true,useFindAndModify:false}); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/userroutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Users RESTful API server started on: ' + port);