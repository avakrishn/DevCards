$(window).ready(function(){
    showDecks();
    showCards();
    toggleBubbles();

    $('.deckHolder').on( 'click', '.delete-spin', function () {
        var deck_id = $(this).children('.delete-deck').attr('deck-id');
        $('#deleteMyDeck').attr('action', `/decks/deletedeck/${deck_id}`);
    });
    
});




function showDecks(){
    var address = '/decks/dash';
    $.ajax({
        url: address,
        method: 'GET'
    }).then(function(res){
        //res is the array of objects for my decks
        console.log(res);
        var length = res.length
        for(var i = 0; i<length;i++){
            var deckName = res[i].name;
            var nametag = $('<li>').attr('class', 'nametag').text(deckName);
            var cardCount = $('<li>').attr('class', 'cardCounttag').text(`Cards in Deck: ${res[i].card_count}`);
            var studyDeck = $('<a>').attr('href','/flashcards/deck/' + res[i].id).text('Study').attr('class', 'spin-text');
            var editDeck = $('<a>').attr('href','/decks/edit/' + res[i].id).text('Edit').attr('class', 'spin-text'); 
            var deleteDeck = $('<p>').text('Delete').attr({
                'class': 'spin-text delete-deck',
                'data-toggle': "modal",
                'data-target':"#deleteDeckModal",
                'id':`deleteDeckModalLink + ${res[i].id}`,
                'deck-id': res[i].id
            }); 

            var spinnerStudy =  $('<li>');
            if(parseInt(res[i].card_count) > 0){
                spinnerStudy.addClass('active spin study-spin mr-3').append(studyDeck);
            }
            var spinnerEdit = $('<li>').addClass('active spin edit-spin').append(editDeck);
            var spinnerDelete = $('<li>').addClass('active spin delete-spin').append(deleteDeck);
            var spinnerDiv = $('<div>').addClass('spinnerDiv').append(spinnerStudy,spinnerEdit, spinnerDelete);
            var collector = $('<ul>').append(nametag, cardCount, spinnerDiv);
            var newDiv = $('<div>').attr('class','box deck-contain').append(collector);
            $('.deckHolder').append(newDiv);
        }
    });
}

function showCards(){
    var address = '/flashcards/community_cards'; 
    $.ajax({
        url: address,
        method: 'GET'
    }).then(function(res){
        var length = res.length;
        for(var i = 0; i<length;i++){
            var cardFront = res[i].front;
            var add = $('<a>').attr('href','/decks/add/'+ res[i].id).text('[+]');
            var newDiv = $('<div>').text('Card # ' + res[i].id + ' : ').append(cardFront, add);
            $('#availCards').append(newDiv);
        }
    });
}

function toggleBubbles() {
    $('#toggle').on('click', function() {
        $('.speech-bubble').toggle();
        $('.speech-bubble-t2').toggle();
    });
};
