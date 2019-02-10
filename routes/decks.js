var mysql = require("mysql");
require("dotenv").config();
var fs = require("fs");
var express = require('express');
var app = express();
var router = express.Router();

//you need this to be able to process information sent to a POST route
var bodyParser = require('body-parser');
// var deleteCard = require('../public/assets/javascript/deck'); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

var path = require("path");

// Serve static content for the app from the "public" directory in the application directory.
// you need this line here so you don't have to create a route for every single file in the public folder (css, js, image, etc)
//index.html in the public folder will over ride the root route
app.use(express.static("public"));

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
    database: process.env.DB_NAME,    //TBD
});

router.get('/', function(req,res){

    res.render('pages/decks',{
        data: [req.session]});
    console.log(module.filename);
});

//Returns deck details 
router.get('/dash', function(req, res){
    connection.query('SELECT decks.id, decks.name, decks.users_id, decks.date, COUNT(deck_cards.cards_id) AS card_count FROM decks LEFT JOIN deck_cards ON decks.id = deck_cards.decks_id WHERE users_id = ? GROUP BY decks.id ORDER BY decks.date DESC;', [req.session.user_id], function (error, results, fields) {
    if (error) throw error;
    
    // req.session.decks = res.json(results); 
    res.json(results);
    });
});

//Views a list of deck details in JSON form 
router.get('/viewer',function(req,res){
    res.redirect('/decks/dash')
})

//Creates a new deck 
router.post('/create', function(req, res){
    var deck_name = req.body.name;
    deck_name = deck_name.trim();
    if(deck_name !== ""){
        connection.query('INSERT INTO decks (users_id, name) VALUES (?,?);', [req.session.user_id, req.body.name],function(error, results, fields){
            if (error) throw error;
    
            res.redirect('/');
        })

    }

    
});

var deckIden; 

router.get('/edit/:id', function(req,res){
    
    deckIden = req.params.id;
    console.log("database Connection");
    connection.query('SELECT DISTINCT cards.id, cards.front, decks.name FROM cards LEFT JOIN deck_cards ON deck_cards.cards_id = cards.id LEFT JOIN decks ON deck_cards.decks_id = decks.id WHERE decks_id = ?',[req.params.id], function(error, results, fields){
        
        //First for loop separates the array of objects and combines it into a long string
    
        var front = '';
        var deckName = "";
        // console.log('this is front' + JSON.stringify(results));
        if(results.length>0){
            for(var i =0; i<results.length;i++) {
                front += results[i].id +'/'+  results[i].front+'<br>';
            }
            deckName = results[0].name;
        }
        //splitID then splits the long string and puts it into an array
        console.log("FRONT: " + front);
        
        var splitID = front.split('<br>');
        var phrase =[]; 
        var iden =[];
        splitID.splice(splitID.length-1, 1);
        // console.log(phrase);
        // console.log(iden);
        // console.log(splitID);
        //For loop separates the cardIden and question, pushes it to an array, and allows EJS to create ul for each position of the array
        if(splitID){
            for(var s =0; s<splitID.length; s++){
                var text = splitID[s].split('/')
                // console.log(text);
                var pass = text[1]; 
                phrase.push(pass);
                var num =text[0]
                iden.push(num);
            }
        }   
        console.log("PHRASE: " + phrase);
        res.render('pages/edit_decks', {
            data: [req.session],
            random: iden,
            phrase: phrase,
            deckName: deckName
        });
    })  
});

// router.get('/edit', function(req,res){
//     res.render('pages/edit_decks');

// })

router.get('/add/:id', function(req,res){
    connection.query('INSERT INTO deck_cards (decks_id, cards_id) VALUES (?,?);',[deckIden,req.params.id],function(err,result,fields){
        console.log('successfully added card #' + req.params.id);
        res.redirect('/decks/edit/'+ deckIden);
    })
});

router.get('/delete/:id', function(req, res){
    connection.query('DELETE FROM deck_cards WHERE decks_id = ? AND cards_id = ?;',[deckIden, req.params.id],
    function(err,results,fields){
        console.log('successfully deleted card ' + req.params.id);
        res.redirect('/decks/edit/'+ deckIden);
    })
});

router.post('/deletedeck/:id', function(req,res){
    connection.query('DELETE FROM deck_cards WHERE decks_id = ?;',[req.params.id],function(err,result,fields){
        console.log('successfully deleted from deck_cards #' + req.params.id);
        connection.query('DELETE FROM decks WHERE id = ?;',[req.params.id],function(err,result,fields){
            console.log('successfully deleted deck #' + req.params.id);
            res.redirect('/');
        })
    })
});

module.exports = router;


