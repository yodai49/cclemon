const cwidth= 880; //size of canvas
const cheight= 520;
window.onload=function(){
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");    
    var background = new Image();
    background.onload=function(){
        ctx.drawImage(background,0,0,cwidth,cheight);
    };
    background.src = "./background.jpg";
    ctx.rect(0,40,50,50);
    ctx.fillStyle="#FF00FF";
    ctx.fill();
};