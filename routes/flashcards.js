var mysql = require("mysql");
require("dotenv").config();
var fs = require("fs");
var express = require('express');
var app = express();
var router = express.Router();

//you need this to be able to process information sent to a POST route
var bodyParser = require('body-parser');

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
    database: process.env.DB_NAME    //TBD
});

router.get('/', function(req, res){
    if(req.session.user_id){
        res.redirect('/flashcards/my_cards') 
    }
    else{
        res.redirect('/')
    }  

});

router.get('/my_cards', function(req,res){
    if(req.session.user_id){
        res.render('pages/flashcards', {data: [req.session]});
    }
    else{
        res.redirect('/')
    } 
})

router.put('/edit', function(req, res){

    if(req.body.front){
        connection.query('UPDATE cards SET front = ? WHERE id = ?', [req.body.front, req.body.id],function(error, results, fields){
            if (error) throw error;
    
            res.json(results);
        });


    }else if(req.body.back){
        connection.query('UPDATE cards SET back = ? WHERE id = ?', [req.body.back, req.body.id],function(error, results, fields){
            if (error) throw error;
    
            res.json(results);

        });
    }else if(req.body.category){
        connection.query('UPDATE cards SET category = ? WHERE id = ?', [req.body.category, req.body.id],function(error, results, fields){
            if (error) throw error;
    
            res.json(results);
        });
    }else{
        connection.query('UPDATE cards SET difficulty = ? WHERE id = ?', [req.body.difficulty, req.body.id],function(error, results, fields){
            if (error) throw error;
    
            res.json(results);
        }); 
    }

});


router.get('/view_all_my_cards', function(req, res){

    connection.query('SELECT * FROM cards WHERE creator_id = ? ORDER BY id DESC;', [req.session.user_id], function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});


router.get('/new_card', function(req, res){
    if(req.session.user_id){
        res.render('pages/create_cards', {data: [req.session]});
    }
    else{
        res.redirect('/')
    }

})

router.post('/create', function(req, res){

    if(req.session.user_id && req.body.category && req.body.front && req.body.back && req.body.difficulty){
        connection.query('INSERT INTO cards (creator_id, category, front, back, difficulty) VALUES (?,?, ?, ?, ?);', [req.session.user_id, req.body.category, req.body.front, req.body.back, req.body.difficulty],function(error, results, fields){
            if (error) throw error;
            if(req.body.deck_id){
                connection.query('INSERT INTO deck_cards (decks_id, cards_id) VALUES (?, ?);', [req.body.deck_id, results.insertId],function(error, deckRes, fields){
                    if (error) throw error;
                }) 
            } 
            res.redirect('/flashcards/new_card');     
        })
    }
    else{
        res.redirect('/flashcards/new_card');
    }
});

router.get('/all_cards', function(req, res){

    if(req.session.user_id){
        res.render('pages/all_cards', {data: [req.session]});
    }
    else{
        res.redirect('/')
    } 
});

router.get('/community_cards', function(req, res){
    
    connection.query('SELECT * FROM cards ORDER BY id DESC',function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });

});

router.get('/fill', function(req,res){
    connection.query('SELECT category FROM cards GROUP BY category ORDER BY category;', function(error, results, fields){
        if (error) throw error;
        res.json(results);
    })
});

router.get('/fill_user', function(req,res){
    connection.query('SELECT category FROM cards WHERE creator_id = ? GROUP BY category ORDER BY category;',[req.session.user_id], function(error, results, fields){
        if (error) throw error;
        res.json(results);
    })
});



router.get('/deck/:id', function(req,res){
    if(req.session.user_id){
        connection.query('SELECT * FROM decks WHERE id = ? AND users_id = ?;',[req.params.id, req.session.user_id], function (error, results, fields){
            if (error) throw error;

            else if(!results.length){
                res.render('pages/invalid_deck');
                
            }
            else{
                res.render('pages/cards_in_deck', {data: [req.session]});
            }
        })
    }
    else{
        res.redirect('/')
    } 

});

router.get('/view_cards/deck/:deckID', function(req, res){
    connection.query('SELECT * FROM cards WHERE id IN (SELECT cards_id FROM deck_cards WHERE decks_id = ?)',[req.params.deckID],function(error, results,fields){
        if (error) throw error;
        res.json(results);
    })


});

router.get('/deckName/:deckID', function(req, res){
    connection.query('SELECT * FROM decks WHERE id = ?',[req.params.deckID],function(error, results,fields){
        if (error) throw error;
        res.json(results);
    })


});

router.post('/add_to_deck', function(req, res){
    connection.query('INSERT INTO deck_cards (decks_id, cards_id) VALUES (?, ?);', [req.body.deck_id, req.body.cards_id],function(error, deckRes, fields){
        if (error) throw error;
      
        res.redirect('/flashcards/deck/'+req.body.deck_id);
       
    })       
   
});

router.get('/categories/community_cards', function(req, res){
    if(req.session.user_id){
        res.redirect('/flashcards/all_cards');
    }
    else{
        res.redirect('/')
    }
    
});

router.post('/categories/community_cards', function(req, res){
    var cat = req.body.category
    connection.query('DELETE FROM filterCategories WHERE users_id = ?',[req.session.user_id],function (error, results, fields) {
        if (error) throw error;
        if(typeof cat == 'string'){
            connection.query('INSERT INTO filterCategories (users_id, category) VALUES (?,?)',[req.session.user_id, cat],function (error, results, fields) {
                if (error) throw error;
            });
            res.render('pages/all_cards.ejs', {data: [req.session]});
        }
        else{
            for (var i in cat){
                connection.query('INSERT INTO filterCategories (users_id, category) VALUES (?,?)',[req.session.user_id, cat[i]],function (error, results, fields) {
                    if (error) throw error;
                });
            }
            res.render('pages/all_cards.ejs', {data: [req.session]});
        }
       
        
    });
});

router.get('/categories/my_cards', function(req, res){
    if(req.session.user_id){
        res.redirect('/flashcards/my_cards');
    }
    else{
        res.redirect('/') 
    }
});


router.post('/categories/my_cards', function(req, res){
    var cat = req.body.category
    connection.query('DELETE FROM filterCategories WHERE users_id = ?',[req.session.user_id],function (error, results, fields) {
        if (error) throw error;

        if(typeof cat == 'string'){
            connection.query('INSERT INTO filterCategories (users_id, category) VALUES (?,?)',[req.session.user_id, cat],function (error, results, fields) {
                if (error) throw error;
            });
            res.render('pages/flashcards.ejs', {data: [req.session]});
        }
        else{
            for (var i in cat){
                connection.query('INSERT INTO filterCategories (users_id, category) VALUES (?,?)',[req.session.user_id, cat[i]],function (error, results, fields) {
                    if (error) throw error;
                });
            }
            res.render('pages/flashcards.ejs', {data: [req.session]});
        }
        
    });
});



router.get('/filter/community_cards', function(req, res){
    connection.query('SELECT * FROM cards WHERE category IN (SELECT category FROM filterCategories WHERE users_id = ?)',[req.session.user_id],function(error, results,fields){
        if (error) throw error;
        res.json(results);
    })
});


router.get('/filter/my_cards', function(req, res){
    connection.query('SELECT * FROM cards WHERE creator_id = ? AND category IN (SELECT category FROM filterCategories WHERE users_id = ?)',[req.session.user_id, req.session.user_id],function(error, results,fields){
        if (error) throw error;
        res.json(results);
    })
});

router.get('/filter/category_names', function(req, res){
    connection.query('SELECT category FROM filterCategories WHERE users_id = ?',[req.session.user_id],function(error, results,fields){
        if (error) throw error;
        res.json(results);
    })
});

router.post('/delete_my_card', function(req, res){

    connection.query('DELETE FROM deck_cards WHERE cards_id = ?', [req.body.id], function(error, results,fields){
        if (error) throw error;
        connection.query('DELETE FROM cards WHERE ?',[req.body],function(error, results,fields){
            if (error) throw error;
            res.redirect('/flashcards/my_cards');
        });
    });

});


module.exports = router;