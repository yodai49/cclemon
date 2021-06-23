const cwidth= 880; //size of canvas
const cheight= 520;
var current = 30;    
var canvas;
var ctx;
var zpressed = false;
var xpressed = false;
var cpressed = false;

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
    if (zpressed==true){
        
    }
}

/////////*main*///////////////////////////////////////////////////////

////key down//////////////////////////////////////
document.addEventListener("keydown", function (e){
    if(e.key=="z"){
        zperssed=true;
    } else if(e.key == "x"){
        xpressed=true;
    } else if(e.key =="c"){
        cpressed=true;
    }
    zpressed=true;
}, false);

////key up/////////////////////////////////////////
document.addEventListener("keyup", function(e){
    if(e.key=="z"){
        zperssed=false;
    } else if(e.key == "x"){
        xpressed=false;
    } else if(e.key =="c"){
        cpressed=false;
    }
}, false);

setInterval(loop,10);
