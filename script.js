const cwidth= 880; //size of canvas
const cheight= 520;
var current = 30;    
var canvas;
var ctx;
var zpressed = false;
var xpressed = false;
var cpressed = false;
var startflg=1;

window.onload=function(){
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");    
    var background = new Image();
    background.onload=function(){
        ctx.drawImage(background,0,0,cwidth,cheight);
        ctx.font="33px serif";
        ctx.fillStyle="#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("CCLEMON",440,250);
        ctx.font="20px serif";
        ctx.fillText("press Z key to start", 440,400);
        ctx.fill();    
    };
    background.src = "./background_town.jpg";
};

function loop(){

}

/////////*main*///////////////////////////////////////////////////////

////click /////////////////////////////////////////
document.getElementById("canvas").addEventListener("click", (e)=>{
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }; 
    const square = { //square of start button
        x: 0, y: 0,  
        w: cwidth, h: cheight  
    };
    const start =
            (square.x <= point.x && point.x <= square.x + square.w)  // horizontal
         && (square.y <= point.y && point.y <= square.y + square.h)  // vertical
         && (startflg) //startflg
      
    if (start) {
        alert('start!'); 
        startflg=0;
    }
});

setInterval(loop,10);
