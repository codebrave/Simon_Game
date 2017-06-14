$(document).ready(function(){
  // Memory for the random colors
  var memcl = [];
  // Memory for pressing the colors.
  var mem = [];
  // Memory of the indexed colors. 
  var clr = ["green","red","blue","yellow"];
  var num = 0;
  
  // These audio files were created from LMMS
  // (Linux Multimedia Studio) with a pan flute
  // instrument. The audio files play to the
  // correspond color, wrong color, or victory
  // sound.
  var gr=new Audio("https://dl.dropbox.com/s/33eb8tqazwe27gd/Pan_A4.wav?dl=0");
  var rd=new Audio("https://dl.dropbox.com/s/axp5fyhdzjmjmpz/Pan_D5.wav?dl=0");
  var yl=new Audio("https://dl.dropbox.com/s/mhrjeq3n0l1hvwv/Pan_C5.wav?dl=0");
  var bl=new Audio("https://dl.dropbox.com/s/ru7dpuw09vok7ma/Pan_Bb4.wav?dl=0");
  var wr=new Audio("https://dl.dropbox.com/s/gbmho9c328jmxb4/Pan_D3.wav?dl=0"); 
  var wn=new Audio("https://dl.dropbox.com/s/jh3toq1n04umpuo/Zelda_Flute.wav?dl=0");
  
  // Link the corresponding colors to the
  // audio files.
  var cl = {
    "green":gr,
    "red":rd,
    "yellow":yl,
    "blue":bl
  };
  
  // Create a new sm object.
  var s=new sm();
  $("#rst").hide();

  // This function activates the sound of the specific
  // color. If the user wins, a victory sound outputs
  // and the level counter resets to 0. If the user
  // presses the wrong ordered color, a wrong sound
  // will output. The level counter also resets to
  // 0 if the user is in strict mode and picks
  // the wrong ordered color. 
  $("#circle").on("click",".pick",function(){
    // If the game is on, then the sounds will be
    // outputted to the specific color. 
    if(s.getGame()){
      mem.push(clr.indexOf(this.id));
      num++;
      
      // If the color index matches with memcl's
      // index color, then the color sound 
      // will play.
      if(mem[num-1]===memcl[num-1]){
        cl[this.id].load();
        // If num is not 20, then the color sound
        // will play.
        if(num!==20){
          cl[this.id].play();
        } // end of if
      } // end of if
      
      // Otherwise, the wrong sound plays and 
      // num resets to 0.
      else {
        wr.load();
        wr.play();
        num=0;
        mem=[];

      } // end of else
 
      $("#"+this.id).animate({backgroundColor:"white"},
                                200);        
      $("#"+this.id).animate(
       {backgroundColor:this.id},200); 
      
      // If num is 0, the ordered colors 
      // will output.
      if(num===0){
        // If the checkbox is checked, then 
        // memcl is emptied and a new random
        // color is pushed into memcl.
        if($("#ch").is(":checked")){
          memcl = [];  
          randomCl();          
          s.setLvl(1);
          $("#lv").html(s.getLvl());    

        } // end of if        
        outputStep();
      } // end of if
      
      // Otherwise, if num equals to memcl.length,
      // the next order of colors outputs.
      else if(num===memcl.length){
        // If num is less than 20, a new random color
        // is pushed into memcl and the next order
        // of colors plays. 
        if(num < 20){
          
          randomCl();
          s.setLvl(memcl.length);
          $("#lv").html(s.getLvl());
          outputStep();
          num=0;
          mem=[];
        } // end of if
        
        // Otherwise, a victory sound plays and
        // the game resets to a new random color.
        else {
          memcl = [];
          mem = [];  
          s.setLvl(1);
          $("#lv").html(s.getLvl()); 
          victory();
          randomCl();
          s.setWin(true);
          $("#sts").html("Victory!");
          
          // Wait for victory sound to end and then
          // output the next step.
          setTimeout(function(){
            // If s.getWin is true, then the next
            // random color plays.
            if(s.getWin()){
            outputStep();
            s.setWin(false);
            $("#sts").html("No win");              
            }
          },3000); 
          num = 0;        
        } // end of else
      } // end of else if
    } // end of if
    
  }); // end of $("#circle") function
  
  // This pushes a new random color into memcl. 
  function randomCl(){
   var c = Math.floor((Math.random()*clr.length));
   memcl.push(c);    
  } // end of randomCl function
  
  // This function plays the order of colors on 
  // memcl's index location.
  function outputStep(){
   var x = 0; 
   $("#green,#red,#yellow,#blue").removeClass("pick");
   // Play the next ordered color every 700ms until
   // x equals to memcl.length.
   var inter = setInterval(function(){

      cl[clr[memcl[x]]].load();
      cl[clr[memcl[x]]].play();
   
      $("#"+clr[memcl[x]]).animate(      
      {backgroundColor:"white"},200);

      $("#"+clr[memcl[x]]).animate(
      {backgroundColor:clr[memcl[x]]},200); 
      x++;
      // If x equals to memcl.length, the time 
      // interval gets cleared and the colors
      // become clickable.
      if(x===memcl.length){
        clearInterval(inter);
         $("#green,#red,#yellow,#blue").addClass("pick");  
      }
   },700);
   
  } // end of outputStep function
  
  // This makes the colors not clickable and plays
  // the victory the sound.
  function victory(){
    $("#green,#red,#yellow,#blue").removeClass("pick");
    wn.load();
    wn.play();
  } // end of victory function
  
  // This starts the game and plays a new
  // random color. 
  $("#st").click(function(){
    $("#st").hide();
    $("#rst").show();   
    randomCl();
    outputStep();
    s.setGame(true);   
  }); // end of $("#st") function
  
  // This function resets the game and
  // stops all playing sounds.
  $("#rst").click(function(){
    // Stop the sound of all colors
    // in a for loop.
    for(var i=0;i<4;i++){
      cl[clr[i]].pause();      
    } // end of for
    
    wn.pause();
    s.setWin(false);
    $("#sts").html("No win");     
    memcl=[];
    mem=[];   
    num=0;
    s.setLvl(1);
    $("#lv").html(s.getLvl());    
    $("#rst").hide();
    $("#st").show();
    $("#green,#red,#yellow,#blue").removeClass("pick");
    s.setGame(false);
  }); // end of $("#rst") function

}); // end of $(document).ready

// Create a sm class for setting the game, level,
// and win value. 
var sm = function(){
  var bool = false;
  var vic = false;
  var lvl = 0;
  
  // This sets the game in 
  // Boolean value.
  this.setGame = function(g){
    bool = g;
    return bool;
  };
  
  // This gets the value of
  // the game.
  this.getGame = function(){
    return bool;
  };
  
  // This sets the game level.
  this.setLvl = function(d){
    lvl = d;
    return lvl;
  };
  
  // This gets the game level.
  this.getLvl = function(){
    return lvl;
  };
  
  // This sets the win in Boolean
  // value.
  this.setWin = function(v){
    vic = v;
    return vic;
  };
  
  // This gets the win status of the
  // game.
  this.getWin = function(){
    return vic;
  }
}; // end of function