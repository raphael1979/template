$(document).ready(function(){

  var counter;
  var nbMyst;
  var i = 1;
  var score;
  var lives;
  var guessStorage = localStorage;
  var hiScores = JSON.parse(localStorage.getItem('hiScores'));
  var output = "";
  var countSuccess = 0;
  var countFirst = 0;
  $('[data-toggle="tooltip"]').tooltip();
  $("#achievements").children("div").children(".glyphicon-star").hide();
      $("#konami").hide();

  // modif hiScores
  localStorage.clear();
  localStorage.setItem('hiScores', JSON.stringify({'1':'LDE','2':'LDE','3':'LDE'}));
  hiScores = JSON.parse(localStorage.getItem('hiScores'));
  // fin modif hiScores

  refreshHiScores();

  function Chrono(currentTime) {
    $("#guessInput").hide();
    $("#guessBtn").hide();
    this.time = currentTime;
    this.start = function(){
      clearInterval(counter);
      counter = setInterval(timer, 1000);
      timer();
    };
    this.hard = function(){
      clearInterval(counter);
      counter = setInterval(timer, 100);
      timer();
    };
    this.stop = function(){
      stop();
    };
  }

  var Chronometre = new Chrono(61, 0);

  $("#start").click(function(){
    nbMyst = (Math.floor((9)*Math.random()+1));
        $("#konami").html("Solution : " + nbMyst);
    Chronometre.start();
    $("#start").hide();
    $("#hard").hide();
    $("#over").hide();
    $("#guessInput").show();
    $("#guessBtn").show();
    i = 1;
    score = 0;
    $("#score").html('Score : ' + score);
    lives = ("<img src='img/heart.png'>").repeat(3);
    $("#life").html(lives);
    var hiScores = JSON.parse(localStorage.getItem('hiScores'));
    countSuccess = 0;
    countFirst = 0;
  });

  $("#hard").click(function(){
    nbMyst = (Math.floor((9)*Math.random()+1));
        $("#konami").html("Solution : " + nbMyst);
    Chronometre.hard();
    $("#start").hide();
    $("#hard").hide();
    $("#over").hide();
    $("#guessInput").show();
    $("#guessBtn").show();
    i = 1;
    score = 0;
    $("#score").html('Score : ' + score);
    lives = ("<img src='img/heart.png'>").repeat(3);
    $("#life").html(lives);
    var hiScores = JSON.parse(localStorage.getItem('hiScores'));
    countSuccess = 0;
    countFirst = 0;
  });

var k = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
n = 0;
$(document).keydown(function (e) {
    if (e.keyCode === k[n++]) {
        if (n === k.length) {
            $("#konami").show();
            n = 0;
            return false;
        }
    }
    else {
        n = 0;
    }
});

  $( "#guessForm" ).submit(function( event ) {
    $("#next").hide();
    guessMysteryNumber();
  });

  $( "#guessBtn" ).click(function() {
    $( "#guessForm" ).submit();
  });

  function timer(){
    Chronometre.time -=1;
    var minute = Math.floor((Chronometre.time)/60);
    var seconds = Chronometre.time - (minute*60);
    if (seconds<10) {
      seconds = "0" + seconds;
    }
    if (minute<10) {
      minute = "0" + minute;
    }
    if (Chronometre.time <= 0) {
      stop();
      gameOver();
      unlockAchievement("highlander");
    }
    $("#timer").html(minute + ":" + seconds);
  }


  function stop(){
    clearInterval(counter);
    Chronometre.time = 61;
    $("#timer").html("01:00");
  }

  function gameOver(){
    $("#over").html('GAME OVER');
    $("#over").show();
    $("#start").show();
    $("#hard").show();
    $("#result").empty();
    $("#next").hide();
    $("#guessInput").val('');
    $("#guessInput").hide();
    $("#guessBtn").hide();
    stop();
    hiScore();
  }

  function refreshHiScores(){
    output = "";
    $("#hiScores").empty();
    for (var property in hiScores) {
      output += '<h2>' + hiScores[property] + ': ' + property+'</h2>';
    }
    $("#hiScores").html(output);
  }
  // If necessary, add hiScore, max 3
  function hiScore(){
    var arr = Object.keys( hiScores ).map(function ( key ) { return key; });

    var min = Math.min.apply( null, arr );
        var max = Math.max.apply( null, arr );
    // var max = Math.max.apply( null, arr );
    if (score > min || arr.length < 3){
      var initiales = prompt('Bravo, tu as réalisé un high-score! Entre ton nom : ');
      hiScores[score] = initiales;
      unlockAchievement("hiscore");
    }
    if (score > max){
      unlockAchievement("champion");
    }
    if (Object.keys(hiScores).length > 3){
      delete hiScores[min];
    }
    localStorage.setItem('hiScores', JSON.stringify(hiScores));
    hiScores = JSON.parse(localStorage.getItem('hiScores'));
    refreshHiScores();
  }

  function unlockAchievement(achievement){
    achievement = "#" + achievement;
    if ($("#achievements").children(achievement).attr("class").includes("alert-warning")){
      $("#achievements").children(achievement).children(".glyphicon-star").show();
      $("#achievements").children(achievement).children(".glyphicon-star-empty").hide();
      $("#achievements").children(achievement).toggleClass("alert-warning");
      $("#achievements").children(achievement).toggleClass("alert-success" );
    }
  }

  function guessMysteryNumber(){
    var guess = document.getElementById("guessInput").value;

    if (guess < nbMyst){
      $("#result").html('Le nombre mystère est plus grand !');
    } if (guess > nbMyst) {
      $("#result").html('Le nombre mystère est plus petit !');
    } if (guess == nbMyst) {
      if (i == 1){
        unlockAchievement("gontran");
        countFirst++;
        if(countFirst > 3){
          unlockAchievement("cheater");
        }
      }
      if (nbMyst == 7){
        unlockAchievement("seven");
      }
      $("#result").html('Bravo ! le nombre mystère était bien ' + nbMyst);
      $("#next").html('Nouveau chiffre!');
      $("#next").show();
      score += 5 - i;
      $("#score").html('Score : ' + score);
      nbMyst = (Math.floor((9)*Math.random()+1));
          $("#konami").html("Solution : " + nbMyst);

      i = 0;
      unlockAchievement("grand");
      countSuccess++;
      if(countSuccess > 3){
        unlockAchievement("lepers");
      }
    }
    lives = ("<img src='img/heart.png'>").repeat(3-i);
    $("#life").html(lives);
    i++;

    if (i>3){
      gameOver();
    }
  }

});
