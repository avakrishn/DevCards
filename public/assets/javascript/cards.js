//----------------------------------Global Variables
var i = 0;
var length, getURL, fillURL, currentText, deckName;
var canSwitch = true;

//----------------------------------Functions

// functions empties the div that contains the flashcard before invoking AJAX query to repopulate card with properties from the object at index int
function updateCard(int){
    $('.front, .back').empty();
    $.ajax({
        url: URL,
        method: 'GET'
    }).then(function(res){
        fillCard(res, int);
        

    });
}

function fillCard (res, int){
    length = res.length;
        // console.log(res);
        if (length > 0){
            
            var category = $("<p>").html(res[int].category).addClass('edit ').attr('id', 'category').attr('data-cardId', res[int].id);
            var front = $("<p>").html(res[int].front).addClass('edit').attr('id', 'front').attr('data-cardId', res[int].id);
            var back = $("<p>").html(res[int].back).addClass('edit').attr('id', 'back').attr('data-cardId', res[int].id);
            var difficulty = $("<p>").html(res[int].difficulty).addClass('edit ').attr('id', 'difficulty').attr('data-cardId', res[int].id);
            var cardNum = $("<p>").html(`${int+1}/${res.length}`).attr('id', 'cardNum');
            if($("#card_deck").length != 0) {
                $("#card_deck").attr("value", res[int].id);
              }
            $('.front').append(category, front, cardNum);
            $('.back').append(back, difficulty);
            $('#delete_card_id').attr('value', res[int].id);
        }
        else{
            $('main').hide();
            var newDiv = $('<div>').addClass('center');
            var noCards = $('<h2>').html('You have no cards in this deck').addClass('mb-4')
            var createCards = $('<a>').attr('href', '/flashcards/new_card').html('Create New Cards').addClass('createCards');
            $(newDiv).append(noCards, createCards)
            $('body').append(newDiv);
            $('.footer , .sidebarFilter, #sidebartogglerFilter, #tabFilter').hide();
        }
}
 
// onclick of .leftArrow the subtract function is called that decreases the variable i by 1 and then executes the updateCard function with i as its argument
function subtract(){
    $('.flashcard').removeClass('is-flipped');
    setTimeout(function(){
        if(i > 0){
            i--;
            updateCard(i);
        }
    }, 500);
}

// onclick of the .rightArrow the add function is called that increases the variable i by 1 and then executes the updateCard function with i as its argument
function add(){
    $('.flashcard').removeClass('is-flipped');
    setTimeout(function(){
        if(i <= length-2){
            i++;
            updateCard(i);
        }
    }, 500);
    
}

//function allows user to edit the text on page (when they double click on text)
function editText(){
    currentText = $(this).text();
    // contenteditable allows you to have the user edit the content of the page
    $(this).attr('contenteditable','true');
    canSwitch = false;
    $(this).on('keypress',doneEditText);
}

//when key is pressed if key = return or enter then html is no longer editable by user
// if user presses key enter and there are only white spaces typed then the text reverts back to previous text
function doneEditText(event){
    var y = event.which || event.keyCode;
    if(y == 13){
        $(this).attr('contenteditable','false');
        canSwitch = true;
        if($(this).text().trim().length < 1){
            $(this).text(currentText);
        }
        else{
            
            colkey = $(this).attr('id');
            colval = $(this).text();
            idkey = "id"
            idval = $(this).attr('data-cardId');

            var dataOb = {};
            dataOb[colkey]= colval;
            dataOb["id"] = idval;

            $.ajax({
                url: '/flashcards/edit',
                method: 'PUT',
                data: dataOb
            }).then(function(res){
                // console.log(res);
            });
        }
    }
}

function switchCards(){
    // left arrow
    if ((event.keyCode || event.which) == 37)
    {   
        subtract();
        // $('.flashcard').removeClass('is-flipped');
        // setTimeout(subtract, 1000);
    }
    // right arrow
    if ((event.keyCode || event.which) == 39)
    {
        add();
        // $('.flashcard').removeClass('is-flipped');
        // setTimeout(add, 1000);
    }   
}

// when the page loads and the window is ready, the updateCard function is executed with variable i= 0 as its argument
$(window).ready(function(){
    // window.location.href returns the href (URL) of the current page
    // setting the URL request for ajax query based on the href of the current page
    var hrefLocation = window.location.href.split('/flashcards/')[1];
    if (hrefLocation == 'all_cards'){
        URL = '/flashcards/community_cards';
        fillURL = '/flashcards/fill';
        deckName = 'Community';
        $('#deckName').html(`${deckName} Deck`);
    }else if(hrefLocation == "my_cards" ){
        URL = '/flashcards/view_all_my_cards';
        fillURL = '/flashcards/fill_user';
        $(document).on('click', '.edit', editText);
        deckName =  "My Cards"
        $('#deckName').html(`${deckName} Deck <h3> All the cards I have created </h3>`);
    }
    else if(window.location.href.indexOf('/flashcards/deck/') > -1){
        var deckID = window.location.href.split('/deck/')[1]
        URL = '/flashcards/view_cards/deck/'+ deckID;
        var nameURL = '/flashcards/deckName/' + deckID;
        addDeckName(nameURL);
    }
    else if(hrefLocation == 'categories/community_cards'){
        URL = '/flashcards/filter/community_cards';
        fillURL = '/flashcards/fill';
        deckName = 'Filtered Community Cards Deck';
        filterDeckName(deckName);
        
    }
    else if(hrefLocation == 'categories/my_cards'){
        URL = '/flashcards/filter/my_cards';
        fillURL = '/flashcards/fill_user';
        deckName = 'Filtered My Cards Deck';
        filterDeckName(deckName);
        
    }else if(hrefLocation == 'new_card'){
        canSwitch = false;
    }
    // else if(window.location.href.indexOf('/flashcards/categories') > -1){
    // }
    // console.log(i);
    updateCard(i);
    fillFilter();

});

// if the left key on keyboard is pressed then the subtract function is run and if the right key on the keyboard is pressed then the add function is run
$(document).on('keydown', function(){
    if(canSwitch){
        switchCards();
        flipCards();
    }
});

function flipCards(){
    if((event.keyCode || event.which) == 32){
        event.preventDefault();
        $('.flashcard').toggleClass('is-flipped');
    }
}

$('.flashcard').on('click', function(){
    $('.flashcard').toggleClass('is-flipped');
});

function filterDeckName(deckName){
    var generalTitle = deckName;
    $.ajax({
        url: '/flashcards/filter/category_names',
        method: 'GET'
    }).then(function(res){
        selectedCat = "";
        for (var i in res){
            if (i != res.length-1){
                selectedCat += res[i].category + " , "
            }
            else{
                selectedCat += res[i].category 
            }
        }
        $('#deckName').html(`${generalTitle} <br> <h3> Categories: ${selectedCat} </h3>`);
    });
}

function addDeckName(urlD){

    $.ajax({
        url: urlD,
        method: 'GET'
    }).then(function(res){
        // console.log(res);
        // console.log(res[0].name);
        deckName = res[0].name;
        $('#deckName').html(`${deckName} Deck`);
        $('#editLink').attr('href', `/decks/edit/${res[0].id}`)
    });

}

function fillFilter(){
    $.ajax({
        url: fillURL,
        method: 'GET'
    }).then(function(response){
        for(var i = 0 ; i < response.length; i++ ){
            var checkDiv = $('<div>').addClass("form-check");
            var input = $('<input>').addClass('form-check-input').attr({
                type: "checkbox", 
                name: "category",
                value: response[i].category,
                id : `checkbox${i}`
            });
            var label = $('<label>').addClass('form-check-label').attr('for', `checkbox${i}`).text(response[i].category);
            checkDiv.append(input, label);
            $('.checkboxes').append(checkDiv);
        }
    });

}



