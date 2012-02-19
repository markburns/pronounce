// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery-ujs
//= require_tree .

function play(word){
  $('#spinner').html('');

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

  var word = $('#word_field');
  word.focus();
  word.select();
  word = word.val();
  $('#word_field').html('');
  var url = '';

  var lookup_url = '/words?word=' + word;

  spin();

  $.ajax({url: lookup_url,
    success: play,
    dataType: 'json'});

  return false;
};

Words = {
  save: function(word, audio){
    localStorage[word]=audio;
  },
  read: function(word){
    return localStorage[word];
  }

};

Word = {
  audio: document.createElement('audio'),

  play: function(url){
    Word.audio.setAttribute('src', url);
    Word.audio.play();
  }
};

$(function(){
  var canvas = document.getElementById('fft');
  var ctx = canvas.getContext('2d');
  var channels;
  var rate;
  var frameBufferLength;
  var fft;

    Word.audio.addEventListener('MozAudioAvailable', audioAvailable, false);
    Word.audio.addEventListener('loadedmetadata', loadedMetadata, false);



  $('#word_form').submit(function(e){
    lookup(e);
  });

  $('#word_field').blur(function(e){
    lookup(e);
  });


  return true;

});

function loadedMetadata(){
  channels          = Word.audio.mozChannels;
  rate              = Word.audio.mozSampleRate;
  frameBufferLength = Word.audio.mozFrameBufferLength;

  fft = new FFT(frameBufferLength / channels, rate);
};

function audioAvailable(event){
  var fb = event.frameBuffer,
      t  = event.time, /* unused, but it's there */
      signal = new Float32Array(fb.length / channels),
      magnitude;

  for (var i = 0, fbl = frameBufferLength / 2; i < fbl; i++ ) {
    // Assuming interlaced stereo channels,
    // need to split and merge into a stero-mix mono signal
    signal[i] = (fb[2*i] + fb[2*i+1]) / 2;
  }

  fft.forward(signal);

  // Clear the canvas before drawing spectrum
  ctx.clearRect(0,0, canvas.width, canvas.height);
  var i=0;

  for (i = 0; i < fft.spectrum.length; i++){
    // multiply spectrum by a zoom value
    magnitude = fft.spectrum[i] * 4000;

    // Draw rectangle bars for each frequency bin
    ctx.fillRect(i * 4, canvas.height, 3, -magnitude);
  }
}

// FFT from dsp.js, see below
var FFT = function(bufferSize, sampleRate) {
  this.bufferSize   = bufferSize;
  this.sampleRate   = sampleRate;
  this.spectrum     = new Float32Array(bufferSize/2);
  this.real         = new Float32Array(bufferSize);
  this.imag         = new Float32Array(bufferSize);
  this.reverseTable = new Uint32Array(bufferSize);
  this.sinTable     = new Float32Array(bufferSize);
  this.cosTable     = new Float32Array(bufferSize);

  var limit = 1,
      bit = bufferSize >> 1;

  while ( limit < bufferSize ) {
    for ( var i = 0; i < limit; i++ ) {
      this.reverseTable[i + limit] = this.reverseTable[i] + bit;
    }

    limit = limit << 1;
    bit = bit >> 1;
  }

  for ( var i = 0; i < bufferSize; i++ ) {
    this.sinTable[i] = Math.sin(-Math.PI/i);
    this.cosTable[i] = Math.cos(-Math.PI/i);
  }
};

FFT.prototype.forward = function(buffer) {
  var bufferSize   = this.bufferSize,
      cosTable     = this.cosTable,
      sinTable     = this.sinTable,
      reverseTable = this.reverseTable,
      real         = this.real,
      imag         = this.imag,
      spectrum     = this.spectrum;

  if ( bufferSize !== buffer.length ) {
    throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + bufferSize + " Buffer Size: " + buffer.length;
  }

  for ( var i = 0; i < bufferSize; i++ ) {
    real[i] = buffer[reverseTable[i]];
    imag[i] = 0;
  }

  var halfSize = 1,
      phaseShiftStepReal,
      phaseShiftStepImag,
      currentPhaseShiftReal,
      currentPhaseShiftImag,
      off,
      tr,
      ti,
      tmpReal,
      i;

  while ( halfSize < bufferSize ) {
    phaseShiftStepReal = cosTable[halfSize];
    phaseShiftStepImag = sinTable[halfSize];
    currentPhaseShiftReal = 1.0;
    currentPhaseShiftImag = 0.0;

    for ( var fftStep = 0; fftStep < halfSize; fftStep++ ) {
      i = fftStep;

      while ( i < bufferSize ) {
        off = i + halfSize;
        tr = (currentPhaseShiftReal * real[off]) - (currentPhaseShiftImag * imag[off]);
        ti = (currentPhaseShiftReal * imag[off]) + (currentPhaseShiftImag * real[off]);

        real[off] = real[i] - tr;
        imag[off] = imag[i] - ti;
        real[i] += tr;
        imag[i] += ti;

        i += halfSize << 1;
      }

      tmpReal = currentPhaseShiftReal;
      currentPhaseShiftReal = (tmpReal * phaseShiftStepReal) - (currentPhaseShiftImag * phaseShiftStepImag);
      currentPhaseShiftImag = (tmpReal * phaseShiftStepImag) + (currentPhaseShiftImag * phaseShiftStepReal);
    }

    halfSize = halfSize << 1;
  }

  i = bufferSize/2;
  while(i--) {
    spectrum[i] = 2 * Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / bufferSize;
  }
};
