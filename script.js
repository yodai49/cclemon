const cwidth= 880; //size of canvas
const cheight= 520;
var current = 30;    
var canvas;
var ctx;
var zpressed = false;
var xpressed = false;
var cpressed = false;
var startflg=1;
var endflg=0;
var myattack = 1;
var enemyattack=1;
var mode=0; //0 waiting 1 battling
var myaction = 0;//0 lemon 1 attack 2 barrier
var enemyaction = 0;
var mytop=350,enemytop=190;
var gauge = 0,waittime=0; 
var lemonl=170,attackl =370,barrierl=570;
var rating = Number(localStorage.getItem("rating"));
var modechange=1;

var bgm = document.getElementById("mainBGM");
var se_click = document.getElementById("se_click");
se_click.volume=1.0;

function loop(){
    if (startflg ==1){ //start window//////////////////////////
        if (bgm.paused==true) {
            bgm.src="titleBGM.mp3";
            bgm.play();
        }
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
            ctx.fillText("click or tap to start", 440,400);
            ctx.font="20px serif";
            ctx.fillText("rating: " + rating, 740,40);
            ctx.fill();    
        };
        background.src = "./background_town.jpg";
    }else if (endflg ==1) { //ending window//////////////////////////

    }else { //gaming windows/////////////////////////////////////////
        //////////////////////////////////////////////////////////drawing
        ////////////////////////////////////////////background
        canvas=document.getElementById("canvas");
        ctx=canvas.getContext("2d");    
        var background = new Image();
        background.onload=function(){
            ctx.drawImage(background,0,0,cwidth,cheight);

        if (mode == 1){ //battling

            timewait--;
            if (timewait <= 0) { 
                ////////////////////////////////win or lose
                if (myaction == 0 && enemyaction == 1){
                    rating-=50;
                    window.alert("YOU LOSE rating=" + rating);
                    bgm.src = "titleBGM.mp3";
                    bgm.play();        
                    startflg=1;
                } else if (myaction == 1 && enemyaction == 0){
                    rating+=50;
                    window.alert("YOU WIN rating=" + rating);
                    bgm.src = "titleBGM.mp3";
                    bgm.play();        
                    startflg=1;
                }
                localStorage.setItem("rating", rating);
                ////////////////////////////////inclement or declement of lemon
                if (myaction == 0) myattack++;
                if (enemyaction == 0) enemyattack++;
                if (myaction == 1) myattack--;
                if (enemyaction == 1) enemyattack--;
                if (myaction == 1 && myattack == 0) myaction = 2;

                gauge=0;
                mode=0;

                enemyaction =Math.floor(Math.random()*3);
                if (enemyaction == 1 && enemyattack == 0){
                    if (Math.floor(Math.random())*2 < 1){
                        enemyaction = 2;
                    } else{
                        enemyaction = 0;
                    }
                }
            }

            ctx.font="30px serif";///////////////enemy and my actions
            ctx.fillStyle="#FFFFFF";
            ctx.textAlign = "left";
            if (myaction==0){
                ctx.fillText("LEMON",lemonl,mytop);
            } else if(myaction == 1){
                ctx.fillText("ATTACK",attackl,mytop);
            } else if (myaction == 2){
                ctx.fillText("BARRIER",barrierl,mytop);
            }
            if (enemyaction==0){
                ctx.fillText("LEMON",lemonl,enemytop);
            } else if(enemyaction == 1){
                ctx.fillText("ATTACK",attackl,enemytop);
            } else if (enemyaction == 2){
                ctx.fillText("BARRIER",barrierl,enemytop);
            }
        } else{ //waiting
            gauge++;
            if (gauge>= 100){
                mode=1;
                timewait=30;
            }
            ctx.fillRect(30,490,gauge*8.8,3)/////////////////gauge

            ctx.font="30px serif";///////////////enemy and my actions
            ctx.fillStyle="#FFFFFF";
            ctx.textAlign = "left";
            ctx.fillText("LEMON",lemonl,enemytop);
            ctx.fillText("ATTACK",attackl,enemytop);
            ctx.fillText("BARRIER",barrierl,enemytop);
            ctx.fillText("LEMON",lemonl,mytop);
            ctx.fillText("ATTACK",attackl,mytop);
            ctx.fillText("BARRIER",barrierl,mytop);

            ctx.beginPath();
            ctx.strokeStyle="#FFFFFF"; /////////current action
            ctx.lineWidth=5;
            if (myaction == 0){
                ctx.moveTo(lemonl,mytop+15);
                ctx.lineTo(lemonl+110,mytop+15);
            } else if(myaction == 1){
                ctx.moveTo(attackl,mytop+15);
                ctx.lineTo(attackl+110,mytop+15);
            } else if(myaction == 2){
                ctx.moveTo(barrierl,mytop+15);
                ctx.lineTo(barrierl+110,mytop+15);
            }
            ctx.stroke();
        }
            ctx.font="28px serif";///////////////my attack
            ctx.fillStyle="#FFFFFF";
            ctx.textAlign = "left";
            ctx.fillText("attack: " + myattack,640,440);

            ctx.font="28px serif";///////////////enemy atack
            ctx.fillStyle="#FFFFFF";
            ctx.textAlign = "left";
            ctx.fillText("attack: " + enemyattack,140,100);
            /////////////////////////////////////////////drawing
            ctx.fill();
        };
        background.src = "./background_town.jpg";
    }
}

/////////*main*///////////////////////////////////////////////////////

////click /////////////////////////////////////////
document.getElementById("canvas").addEventListener("click", (e)=>{
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }; 

    var square = { //square of start button
        x: 0, y: 0,  
        w: cwidth, h: cheight  
    };
    const start =
            (square.x <= point.x && point.x <= square.x + square.w)  // horizontal
         && (square.y <= point.y && point.y <= square.y + square.h)  // vertical
         && (startflg) //startflg      

    if (start) {/////////////////////////////////////////////initialize
        startflg=0;
        myattack=1;
        enemyattack=1;
        bgm.src = "mainBGM.mp3";
        bgm.play();
        se_click.play(0);
    }
    
    if (mode == 0){
        square = { //square of lemmon
            x: lemonl, y: mytop-30,  
            w: 200, h: 50  
        };
        if((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
            && (square.y <= point.y && point.y <= square.y + square.h)){
                myaction=0;
                se_click.currentTime=0;
                se_click.play(); //lemon
            }  // vertical
        square = { //square of attack
            x: attackl, y: mytop-30,  
            w: 200, h: 50  
        };
        if((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
            && (square.y <= point.y && point.y <= square.y + square.h)  // vertical
            && (myattack != 0)){
            myaction=1;
            se_click.currentTime=0;
            se_click.play(); //attack
        }
        square = { //square of barrier
            x: barrierl, y: mytop-30,  
            w: 200, h: 50  
        };
        if((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
            && (square.y <= point.y && point.y <= square.y + square.h)){
                myaction=2;
                se_click.currentTime=0;
                se_click.play(); //barrier
            }  // vertical
    }
});

////initialize
bgm.src = "titleBGM.mp3";
bgm.volume=0.2;
bgm.play();
setInterval(loop,20);
