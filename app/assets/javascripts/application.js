// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery-ujs
//= require_tree .
$(function(){
  function play(data){
    console.log(data);
    url = data.mp3_url;
    if(typeof(url)== 'string'){

      audioElement.setAttribute('src', url);
      audioElement.play();
      definition(data);
      return true;
    }

    definition("Sorry, no audio for: " + data);
    return false;
  }

  function definition(word){
    $('#word').html(word.word);
    $('#definition').html(word.definition);
  }

  var audioElement = document.createElement('audio');

  $('#word_form').submit(function(e){
    e.preventDefault();

    var word = $('#word_field').val();
    var url = '';
    console.log(word);

    var lookup_url = '/words?word=' + word;
    console.log(lookup_url);

    $.ajax({url: lookup_url,
      success: play,
      dataType: 'json'});
  });

  return true;

});
