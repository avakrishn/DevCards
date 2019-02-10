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
//register get and post 
router.get('/', function(req, res){
  // res.sendFile(path.join(__dirname, 'public/registration.html'));
  res.render('pages/registration', {data: false})
});
  
  
router.post('/', function(req, res){
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var email = req.body.email;
  
  var avatarPath;
  if(req.body.profileAvatar === ""){
    avatarPath = "/assets/images/avatars/man.png";
  }else{
    avatarPath = req.body.profileAvatar;
  }
  // console.log(username + " " + password + " " + firstName + " " + lastName + " " + email);
  console.log(avatarPath);
  //need to add restrictions on username (must be unique), email (must be unique), password (must be between 8 - 16 characters)
  var query = connection.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email],function (error, results, fields) {
    if(error) throw error;
    if(results.length == 0)
    {
      console.log("no duplicate username or email" + password.length);  
      bcrypt.genSalt(10, function(err, salt) {
        // res.send(salt);
        bcrypt.hash(password, salt, function(err, p_hash) { 
          connection.query('INSERT INTO users (username, password, first_name, last_name, email) VALUES (?,?,?,?,?)', [username, p_hash, firstName, lastName, email],function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            connection.query('SELECT id FROM users WHERE username = ?', [username],function (error, results, fields) {
              if(error) throw error;
              console.log(results[0].id);
              connection.query('INSERT INTO userProfile (users_id, avatarPath) VALUES (?,?)', [results[0].id,avatarPath],function (error, results, fields) {
                if(error) throw error;
              });
            });
              // connection.query('INSERT INTO userProfile (users_id) VALUES (?)', [],function (error, results, fields) {
              // console.log("logged in");
              // res.redirect('/home/'+username);
              // start a session and then direct to landing page
              //   res.send("Account Created, go to home page and login");
            res.sendFile(path.join(__dirname, '../public/success.html'));
          })
        })
      })
    }
    else{
      console.log("username/email taken");
      res.render('pages/registration', {data: true});
    }
  });
});

module.exports = router;