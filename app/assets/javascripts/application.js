// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery-ujs
//= require_tree .

function play(data){
  url = data.mp3_url;

  var audioElement = document.createElement('audio');
  $('#spinner').html('');

  if(typeof(url)== 'string'){
    console.log('playing audio');
    audioElement.setAttribute('src', url);
    audioElement.play();

    $('#word').html(data.word);
    $('#definition').html(data.definition);

    return true;
  }

  $('#word').html("Sorry, no audio for: " + data.word);
  $('#definition').html(data.definition);

  console.log('Not found');
  return false;
}

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

function lookup(e){
  e.preventDefault();

  var word = $('#word_field').val();
  $('#word_field').html('');
  var url = '';

  var lookup_url = '/words?word=' + word;

  spin();

  $.ajax({url: lookup_url,
    success: play,
    dataType: 'json'});

  return false;
};

$(function(){



  $('#word_form').submit(function(e){
    lookup(e);
  });

  $('#word_field').blur(function(e){
    lookup(e);
  });


  return true;

});
