//List of NPM and inherent packages
var mysql = require("mysql");
require("dotenv").config();
var fs = require("fs");
var express = require('express');
var app = express();
var router = express.Router();
var methodOverride = require('method-override');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require("path");

app.use(methodOverride('_method'));
app.use(session({ secret: 'app', cookie: { maxAge: 1*1000*60*60*24*365 }}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static content for the app from the "public" directory in the application directory.
// you need this line here so you don't have to create a route for every single file in the public folder (css, js, image, etc)
//index.html in the public folder will over ride the root route
app.use(express.static("public"));

//sets EJS available
app.set('view engine', 'ejs');

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  
  // Your port; if not 3306
  port: 3306,
  
  // Your username
  user: process.env.DB_USER,
  
  // Your password
  password: process.env.DB_PASSWORD,  //placeholder for your own mySQL password that you store in your own .env file
  database: process.env.DB_NAME    //TBD
});


//base routes (Home page, login, registration page, logout)  
app.get('/', function(req, res) {
  res.redirect('/home');
  // console.log("getting root");
});
app.get('/home', function(req, res) {
  // res.sendFile(path.join(__dirname, 'public/home.html'));
  if(req.session.username)   res.render('pages/decks', {data: [req.session]});
  else res.render('pages/index');
});
app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname, 'public/login.html'));
});
app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  console.log(username + " " + password);
  connection.query('SELECT * FROM users WHERE username = ?', [username],function (error, results, fields) {
    if (error) throw error;
  
    //  res.json(results);
    if (results.length == 0){
      res.redirect('/login');
    }
    else {
      bcrypt.compare(password, results[0].password, function(err, result) {
      if (result == true){
        req.session.user_id = results[0].id;
        req.session.email = results[0].email;
        req.session.username = results[0].username;
        req.session.firstName = results[0].first_name;
        req.session.lastName = results[0].last_name;
        // res.redirect('decks');
        res.render('pages/decks', {data: [req.session]});
      }
      else{
        res.redirect('/login');
      }
      });
    }
  });
});

app.get('/logout', function(req, res){
  req.session.destroy(function(err){
    res.redirect("/home");
  })
});

app.get('/construction', function(req, res){
  res.sendFile(path.join(__dirname, 'public/construction.html'));
});

app.get('/FAQ', function(req, res){
  if(req.session.username)  res.render('pages/faq',{data: [req.session]});
  else res.sendFile(path.join(__dirname, 'public/unauthorized.html'));
});

//external routes
var flashcardRoutes = require('./routes/flashcards.js');
var deckRoutes = require('./routes/decks.js');
var signupRoutes = require('./routes/signup.js');
var profileRoutes = require('./routes/routesLN.js');
app.use('/flashcards', flashcardRoutes);
app.use('/decks', deckRoutes);
app.use('/signup', signupRoutes);
app.use('/profile',profileRoutes);

app.post('/bio', function(req, res){
  console.log(req.body);
    connection.query('UPDATE userProfile SET biography = ? WHERE users_id = ? ;', [req.body.biography,req.session.user_id],function(error, results, fields){
      if (error) throw error;
    });
    res.redirect("/home");
});

// app.listen(3000);
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Server Started");
});