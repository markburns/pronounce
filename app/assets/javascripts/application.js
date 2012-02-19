// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery-ujs
//= require_tree .



function spin(){
  $('#definition').html('');
  $('#word').html('');

  var opts = {
    lines: 10, // The number of lines to draw
    length: 3, // The length of each line
    width: 4, // The line thickness
    radius: 10, // The radius of the inner circle
    color: '#000', // #rgb or #rrggbb
    speed: 0.8, // Rounds per second
    trail: 64, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: true // Whether to use hardware acceleration
  };
  var target = document.getElementById('spinner');
  new Spinner(opts).spin(target);
};

Search = {
  lastQuery: '',

  lastResult: ''
};

Word = {
  audio: document.createElement('audio'),

  lookup: function(e){
    Word.reset();
    e.preventDefault();

    var word = $('#word_field');
    word.focus();
    word.select();
    word = word.val();
    Search.lastQuery = word;
    Word.lastWord = word;

    $('#word_field').html('');
    var url = '';

    var lookup_url = '/words?word=' + word;

    spin();

    $.ajax({url: lookup_url,
      success: Word.update,
      error:   Word.error,
      dataType: 'json'});

    return false;
  },

  reset: function(){
    $('#spinner').html('');
    $('#word').html('');
    $('#definition').html('');
  },

  update: function(word){
    Search.lastResult = word;
    Word.reset();

    if(typeof(word.mp3_url)== 'string'){
      definition = word.definition;
      Word.play(word.mp3_url);
      if(typeof(word.definition)=='string' && definition.length > 0){

        $('#word').html(word.word);
        $('#definition').html(definition);
      }

      return true;
    }

    $('#word').html("Sorry, no audio for: " + word.word);
    $('#definition').html(word.definition);

    return false;
  },

  error: function(e){
    Word.reset();
    $('#definition').html("Problem looking up word: " + Search.lastQuery);
    console.log(e);
  },

  play: function(url){
    Word.audio.setAttribute('src', url);
    Word.audio.play();
  }
};

$(function(){
  $('#word_form').submit(function(e){
    Word.lookup(e);
  });

  $('#word_field').blur(function(e){
    Word.lookup(e);
  });


  return true;

});
