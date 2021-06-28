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
var myrankingname  = localStorage.getItem("myrankingname");
var drating = 0;
var modechange=1;
var message;
var turn = 0;
var enemyrating = 0;
var viewachievement = 0;
var pastrating  = [];
var pastratingnum;
var currentlemon;
var currentbarrier;
var currentattack;
var maxlemon;
var maxbarrier;
var maxattack;
var rankingname=[];
var rankingdata=[];
var rankingrating=[];
var achievementstatus = [];
var achievementname = ["Welcome to CC Lemon","Thunder","Comet","LaserBeam","Challenger","Veteran","Specialist","Dont Give up","Speed Hitman","NECK and NECK",
"You like lemons", "Fierce Attacker", "Solid Defender", "The first step", "Green lemon","Fly high","Pale Blue","Sour Lemonade","An orange","Legendary CCLemonist"];
var achievementexp = [
"You won.", "You won 5 times.", "You won 10 times.", "You won 50 times.", "You battled 5 times.", "You battled 25 times", "You battled 100 times",
"Your rating was less than 0.", "You won at the first turn.", "You experienced a game over 25 turns.", "You choose lemon 5 times in a row",
"You choose Attack 5 times in a row.", "You choose Barrier 10 times in a row.", "Your rating is more than 100.",
"Your rating is more than 200.","Your rating is more than 300.","Your rating is more than 400.","Your rating is more than 500.",
"Your rating is more than 600.","Your rating is more than 700."
];
var achievementclass  = [0,0,1,2,0,1,2,0,0,1,2,2,1,0,0,1,1,1,2,3];
var gotachievement = 0;
var gotachievementnumber=[];
var winnumber = Number(localStorage.getItem("winnumber"));
var battlenumber = Number(localStorage.getItem("battlenumber"));
var bgm = document.getElementById("mainBGM");
var se_click = document.getElementById("se_click");
se_click.volume=1.0;
var achievementsound = document.getElementById("achievement");

function checkname(entrynewname){ //0 no problem   else invalid
    if (entrynewname == "") return -1;
    return 0;
}
function sortranking(){ // sort of ranking
    var newrankingname=[];
    var newrankingdata=[];
    var newrankingrating=[];
    var isused=[];
    var tempmax = rankingrating[0];
    var tempmaxnum= 0;
    for(var i = 0; i <= 21;i++) isused[i] = 0;
    for (var i = 0; i <= 21; i++){
        for (var j = 0; j <= 21; j++){
            if (tempmax < rankingrating[j] && !isused[j]){
                tempmax = rankingrating[j];
                tempmaxnum=j;
            }
        }
        newrankingname[i] = rankingname[tempmaxnum];
        newrankingdata[i] = rankingdata[tempmaxnum];
        newrankingrating[i] = rankingrating[tempmaxnum];
        isused[tempmaxnum]=1;
    }
    for (var i = 0; i < 21; i++){
        rankingdata[i] = newrankingdata[i];
        rankingname[i]=newrankingname[i];
        rankingrating[i]=newrankingrating[i];
    }
}

function coloring(colrating){ ////////////coloring or rating
    if (colrating == null) colrating = rating;
    if(colrating <= 100){
        return "#AAAAAA";
    } else if(colrating < 200){
        return "#AA6600";
    } else if(colrating < 300){
        return "#00BB00";
    } else if(colrating < 400){
        return "#88FFFF";
    } else if(colrating < 500){
        return "#6566FF";
    } else if(colrating < 600){
        return "#DDDD00";
    } else if(colrating < 700){
        return "#FF9900";
    } else if(colrating < 1000){
        return "#FF0000";
    } else if (colrating < 1300){
        return "#DDDDDD";
    } else if(colrating < 1600){
        return "#D1CD00";
    } else{
        return "#CFFFFF";
    }
}

function resetachievement(){
    winnumber=0;
    battlenumber=0;
    rating = 0;
    pastratingnum=0;
    pastrating=[];
    for (var i = 0; i < 20; i++) {
        achievementstatus[i] = 0;
        localStorage.setItem("achievementstatus"+i,0);
    }
    localStorage.setItem("winnumber",winnumber);
    localStorage.setItem("battlenumber",battlenumber);
    localStorage.setItem("rating",rating);
    for (var i = 0; i <= 50; i++) localStorage.setItem("pastrating"+i,0);
    localStorage.setItem("pastratingnum",0);
    return 0;
}

function decideact(enemrating){ ///////////enemy action
    var enem,temp;
    enem =Math.floor(Math.random()*3); //randamly choose

    if (enemrating + 100*Math.random() > 500){ //choose barrier more frequently  (about 550)
        temp = Math.floor(Math.random()*3)+Math.floor(Math.random()*3); //randamly choose
        if (temp == 2 || temp == 0){ //////         4/9
            enem = 2;
        } else if (temp == 3 || temp == 4){    //   3/9
            enem = 1;
        } else if (temp == 1){                  //   2/9
            enem = 0;
        }
    }
    if (enemrating + 100*Math.random() > 300){ //do not choose barrier when myattack is zero (about 250)
        if (myattack == 0){
            if (Math.floor(Math.random()*2) < 1 && enemyattack != 0){
                enem = 1;
            } else {
                enem = 0;
            }
        }
    }
    if (enem == 1 && enemyattack == 0){
        if (Math.floor(Math.random())*2 < 1){
            enem = 2;
        } else{
            enem = 0;
        }
    }
    return enem;
}

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
            if (!viewachievement){
                ctx.fillStyle="rgba(" + [0,0,0,0.5] + ")";
                ctx.fillRect(300,370,280,55);
                ctx.font="33px serif";
                ctx.fillStyle="#FFFFFF";
                ctx.textAlign = "center";
                ctx.fillText("CC LEMON",440,250);
                ctx.font="20px serif";
                ctx.fillText("click or tap to start", 440,400);
            } else{
                ctx.textAlign = "left";
                ctx.fillStyle="rgba(" + [0,0,0,0.5] + ")";
                ctx.fillRect(60,60,cwidth - 120,cheight - 80);
                if (viewachievement==1){
                    ctx.fillStyle="#FFFFFF";
                    for (var i = 0; i < 20; i++){
                        var acleft;
                        var actop;
                        if (i < 10){
                            acleft = 140;
                            actop = 40 * i + 88;
                        } else{
                            acleft = 460;
                            actop = 40 * (i-10) + 88;
                        }
                        if (achievementstatus[i]){
                            if (achievementclass[i] == 0){
                                ctx.fillStyle="#953500";
                            } else if(achievementclass[i] == 1){
                                ctx.fillStyle="#DDDDDD";
                            } else if(achievementclass[i] == 2){
                                ctx.fillStyle="#D1CD00";
                            } else {
                                ctx.fillStyle="#BDFFFF";
                            }
                            ctx.font="15px serif";
                            ctx.fillText("●", acleft-30,actop);                                
                            ctx.fillStyle="#FFFFFF";
                            ctx.font="15px serif";
                            ctx.fillText(achievementname[i], acleft,actop);                                
                            ctx.font="10px serif";
                            ctx.fillText(achievementexp[i], acleft+30,actop+15);                                
                        } else {
                            ctx.fillStyle="#333333";
                            ctx.font="15px serif";
                            ctx.fillText("●", acleft-30,actop);                                
                            ctx.fillStyle="#FFFFFF";
                            ctx.fillText("?????????", acleft,actop);        
                        }
                    }    
                    ctx.fillStyle="rgba(" + [0,0,0,0.5] + ")";
                    ctx.fillRect(400,470,20,20);
                    ctx.fillRect(440,470,20,20);
                    ctx.textAlign = "left";
                    ctx.font="16px serif";
                    ctx.fillStyle="#AAAAAA";
                    ctx.fillText("<",406,485);
                    ctx.fillStyle="#FFFFFF";
                    ctx.fillText(">",446,485);
                } else if(viewachievement==2){
                    ////////////////////////////////////                 view graph
                    pastratingnum = localStorage.getItem("pastratingnum");
                    for (var i = 0; i < pastratingnum;i++) pastrating[i] = Number(localStorage.getItem("pastrating" + i));
                    var min=pastrating[0],max=pastrating[0];
                    for (var i = 0; i < pastratingnum;i++){ 
                        if (min > pastrating[i]) min = pastrating[i];
                        if (max < pastrating[i]) max = pastrating[i];
                    }
                    min -= (min%100);
                    max += (100-max%100);
                    if (max == min) max+=100;
                    for (var i = 0; i <= (max-min) / 100;i++){
                        ctx.fillStyle="#FFFFFF";
                        ctx.fillRect(100,(min+i*100)*(400-120)/(min-max) + (400*max-120*min)/(max-min),cwidth-200,1);
                        ctx.font="10pt serif";
                        ctx.fillStyle=coloring(min+i*100);
                        ctx.fillText(min+100*i,100,(min+i*100)*(400-120)/(min-max) + (400*max-120*min)/(max-min)-10);
                    }
                    for (var i = 0; i < pastratingnum; i++){
                        var pleft = 150+((pastratingnum -i-1)*5300)/(pastratingnum+1);
                        var ptop=pastrating[i] * (400-120) / (min - max) + (400*max-120*min)/(max-min);
                        if (i != 0){
                            ctx.beginPath();
                            ctx.moveTo(150+((pastratingnum -i)*5300)/(pastratingnum+1),pastrating[i-1] * (400-120) / (min - max) + (400*max-120*min)/(max-min));
                            ctx.lineTo(pleft,ptop);
                            ctx.lineWidth=1;
                            ctx.strokeStyle="#FFFFFF";
                            ctx.stroke();
                        }
                        ctx.fillStyle=coloring(pastrating[i]);
                        ctx.font="12px serif"
                        ctx.fillText("●",pleft-3,ptop+3);
                    }
                    ctx.font="16px serif";
                    ctx.fillStyle="#FFFFFF";
                    ctx.fillText("battle: " + battlenumber,100,445);
                    ctx.fillText("win: " + winnumber,250,445);
                    if (battlenumber!=0){                          
                        ctx.fillText("WP: " + Math.round(winnumber*100/battlenumber) + "%", 380,445);
                    } else{
                        ctx.fillText("WP: ---", 380,445);
                    }
                    ctx.fillStyle="rgba(" + [0,0,0,0.5] + ")";
                    ctx.fillRect(400,470,20,20);
                    ctx.fillRect(440,470,20,20);
                    ctx.textAlign = "left";
                    ctx.fillStyle="#FFFFFF";
                    ctx.font="16px serif";
                    ctx.fillStyle="#FFFFFF";
                    ctx.fillText("<",406,485);
                    ctx.fillStyle="#FFFFFF";
                    ctx.fillText(">",446,485);
                } else if(viewachievement == 3){ ////////////////////////////////// ranking
                    for (var i = 0; i < 22; i++){
                        var rankleft;
                        var ranktop;
                        if (i < 11){
                            rankleft = 140;
                            ranktop = 30*i + 88;
                        } else{
                            rankleft = 450;
                            ranktop = 30 * (i-11) + 88;
                        }
                        if (i == 0 || i == 11){
                            ctx.fillStyle="#FFFFFF";
                            ctx.font="14px serif";
                            ctx.fillText("    name", rankleft-30,ranktop);                                
                            ctx.font="12px serif";
                            ctx.fillText("rating", rankleft+50,ranktop);   
                            ctx.fillText("date", rankleft+130,ranktop); 
                        } else{
                            var ranknum = i;
                            if (i > 11) ranknum--;
                            if (rankingname[ranknum] != null || rankingname[ranknum] != "" || rankingrating[ranknum] == -1){
                                ctx.fillStyle="#FFFFFF";
                                ctx.font="14px serif";
                                ctx.fillText(ranknum,rankleft-30,ranktop);
                                ctx.fillText(rankingname[ranknum], rankleft,ranktop);                                
                                ctx.fillStyle=coloring(rankingrating[i]);
                                ctx.font="12px serif";
                                ctx.fillText(rankingrating[ranknum], rankleft+70,ranktop);  
                                ctx.fillStyle="#FFFFFF"                              
                                ctx.font="12px serif";
                                ctx.fillText(rankingdata[ranknum], rankleft+150,ranktop);                                    
                            } else{
                                ctx.fillStyle="#FFFFFF";
                                ctx.font="14px serif";
                                ctx.fillText("    - - -", rankleft-30,ranktop);                                
                                ctx.font="12px serif";
                                ctx.fillText("- - ", rankleft+50,ranktop);   
                                ctx.fillText("--/--/--", rankleft+130,ranktop);                                    
                            }
                        }
                    }    
                    ctx.font="22px serif";
                    ctx.fillStyle="rgba(" + [100,100,100,0.5] + ")";
                    ctx.fillRect(130,430,100,30);
                    ctx.textAlign="left";
                    ctx.fillStyle="#FFFFFF";
                    ctx.fillText("entry",155,450);
                    ctx.fillStyle="rgba(" + [0,0,0,0.5] + ")";
                    ctx.fillRect(400,470,20,20);
                    ctx.fillRect(440,470,20,20);
                    ctx.textAlign = "left";
                    ctx.fillStyle="#FFFFFF";
                    ctx.font="16px serif";
                    ctx.fillStyle="#FFFFFF";
                    ctx.fillText("<",406,485);
                    ctx.fillStyle="#AAAAAA";
                    ctx.fillText(">",446,485);
                }
            }
            ctx.textAlign = "center";
            ctx.fillStyle="#FFFFFF";
            ctx.font="20px serif";
            ctx.fillText("rating: ", 740,40);
            if (viewachievement == 0){
                ctx.font="20px serif";
                ctx.fillText("achievements", 750,470);
            } else{
                ctx.font="20px serif";
                ctx.fillText("close", 750,470);
                ctx.font="15px serif";
                ctx.fillText("reset", 750,90);
            }
            ctx.font="20px serif";
            ctx.fillStyle=coloring();
            ctx.fillText(rating, 790,40);
            ctx.fill();    
        };
        background.src = "./background_town.jpg";
    }else if (endflg) { //ending window//////////////////////////
        canvas=document.getElementById("canvas");
        ctx=canvas.getContext("2d");    
        var background = new Image();
        background.onload=function(){
            ctx.drawImage(background,0,0,cwidth,cheight);
            ctx.font="33px serif";
            ctx.fillStyle="#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText(message,440,200);
            ctx.font="20px serif";
            ctx.fillText("turn: " + turn, 440,300);
            ctx.font="20px serif";
            ctx.fillText("click or tap to continue", 440,450);
            ctx.font="20px serif";
            if (drating > 0){
                ctx.fillText("new rating:            (+" + drating + ")", 443,342);
            } else if(drating < 0){
                ctx.fillText("new rating:            (" + drating + ")", 443,342);
            } else{
                ctx.fillText("new rating:            (0)", 460,340);
            }
            for (var i = 0; i < gotachievement;i++){
                ctx.textAlign="left";
                ctx.fillStyle="rgba(" + [0,0,0,0.5] + ")";
                ctx.fillRect(580,i * 40 + 100,350,30);
                if (achievementclass[gotachievementnumber[i]] == 0){
                    ctx.fillStyle="#953500";
                } else if(achievementclass[gotachievementnumber[i]] == 1){
                    ctx.fillStyle="#DDDDDD";
                } else if(achievementclass[gotachievementnumber[i]] == 2){
                    ctx.fillStyle="#D1CD00";
                } else {
                    ctx.fillStyle="#BDFFFF";
                }
                ctx.font="12px serif";
                ctx.fillText("●", 600,i*40+120);                                
                ctx.fillStyle="#FFFFFF";
                ctx.fillText('You got "' + achievementname[gotachievementnumber[i]] + '"',630,i*40+120);
            }
            ctx.fillStyle="rgba(" + [0,0,0,0.5] + ")";
            ctx.fillRect(600,410,150,40);
            ctx.fillStyle="#FFFFFF";
            ctx.textAligh="left";
            ctx.font="20px serif";
            ctx.fillText("Tweet!", 662,437);
            ctx.textAlign="center";
            ctx.fillStyle=coloring();
            ctx.font="20px serif";
            ctx.fillText(rating, 470,340);
            ctx.fill();    
        };
        background.src = "./background_town.jpg";
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
                if (myaction == 0){
                    currentlemon++;
                    currentattack=0;
                    currentbarrier=0;
                    if (currentlemon > maxlemon) maxlemon = currentlemon;
                } else if(myaction == 1){
                    currentattack++;
                    currentlemon=0;
                    currentbarrier=0;
                    if (currentattack > maxattack) maxattack=currentattack;
                } else if(myaction == 2){
                    currentbarrier++;
                    currentlemon=0;
                    currentattack=0;
                    if (currentbarrier > maxbarrier) maxbarrier = currentbarrier;
                }
                ////////////////////////////////win or lose
                if (myaction == 0 && enemyaction == 1){
                    drating=Math.floor(Math.atan(-0.005*(enemyrating-200))*20 - 33);
                    drating*= (3.75/(turn+5) + 0.75);
                    drating=Math.floor(drating);
                    rating+=50;
                    rating+=drating;
                    rating=Math.floor(rating);
                    gotachievement = 0;
                    bgm.src = "endBGM.mp3";
                    message = "YOU LOSE";
                    bgm.play();     
                    endflg=1;
                } else if (myaction == 1 && enemyaction == 0){
                    drating=Math.floor(Math.atan(-0.003*enemyrating)*30 + 60);
                    drating*= (3.75/(turn+5) + 0.75);
                    drating=Math.floor(drating);
                    rating+=50;
                    rating+=drating;
                    rating=Math.floor(rating);
                    ///////////////////////////    achievements check ///////////////////////////
                    winnumber=localStorage.getItem("winnumber");
                    winnumber++;
                    gotachievement = 0;
                    if (achievementstatus[0] == 0){
                        achievementstatus[0] = 1;
                        gotachievementnumber[gotachievement] = 0;
                        gotachievement++;
                    }
                    if (achievementstatus[1] == 0 && winnumber>= 5){
                        achievementstatus[1] = 1;
                        gotachievementnumber[gotachievement] = 1;
                        gotachievement++;
                    }
                    if (achievementstatus[2] == 0 && winnumber >= 10){
                        achievementstatus[2] = 1;
                        gotachievementnumber[gotachievement] = 2;
                        gotachievement++;
                    }
                    if (achievementstatus[3] == 0 && winnumber >= 50){
                        achievementstatus[3] = 1;
                        gotachievementnumber[gotachievement] = 3;
                        gotachievement++;
                    }
                    if (achievementstatus[8] == 0 && turn == 0){
                        achievementstatus[8] = 1;
                        gotachievementnumber[gotachievement] = 8;
                        gotachievement++;
                    }    
                    localStorage.setItem("winnumber",winnumber);
                    /////////////////////////////////////////////////////////////////////////////
                    bgm.src = "endBGM.mp3";
                    message="YOU WIN";
                    bgm.play();
                    endflg=1;
                }
                ///////////////////////////    achievements check ///////////////////////////
                if (endflg){
                    battlenumber = localStorage.getItem("battlenumber");
                    battlenumber++;
                    if (achievementstatus[4] == 0 && battlenumber >= 5){
                        achievementstatus[4] = 1;
                        gotachievementnumber[gotachievement] = 4;
                        gotachievement++;
                    }
                    if (achievementstatus[5] == 0 && battlenumber>= 25){
                        achievementstatus[5] = 1;
                        gotachievementnumber[gotachievement] = 5;
                        gotachievement++;
                    }
                    if (achievementstatus[6] == 0 && battlenumber >= 100){
                        achievementstatus[6] = 1;
                        gotachievementnumber[gotachievement] = 6;
                        gotachievement++;
                    }
                    if (achievementstatus[7] == 0 && rating < 0){
                        achievementstatus[7] = 1;
                        gotachievementnumber[gotachievement] = 7;
                        gotachievement++;
                    }
                    if (achievementstatus[9] == 0 && turn >= 25){
                        achievementstatus[9] = 1;
                        gotachievementnumber[gotachievement] = 9;
                        gotachievement++;
                    }
                    if (achievementstatus[10] == 0 && maxlemon >= 5){
                        achievementstatus[10] = 1;
                        gotachievementnumber[gotachievement] = 10;
                        gotachievement++;
                    }
                    if (achievementstatus[11] == 0 && maxattack >= 5){
                        achievementstatus[11] = 1;
                        gotachievementnumber[gotachievement] = 11;
                        gotachievement++;
                    }
                    if (achievementstatus[12] == 0 && maxbarrier >= 10){
                        achievementstatus[12] = 1;
                        gotachievementnumber[gotachievement] = 12;
                        gotachievement++;
                    }
                    for (var i = 0;i < 7;i++){
                        if (achievementstatus[i+13] == 0 && rating >= i * 100 + 100){
                            achievementstatus[i+13] = 1;
                            gotachievementnumber[gotachievement] = i+13;
                            gotachievement++;
                        }
                    }
                    localStorage.setItem("battlenumber",battlenumber);
                    /////////////////////////////////////////////////////////////////////////////    UPDATE local Storage
                    localStorage.setItem("rating", rating);
                    for (var i = 0; i < 50; i++){
                        localStorage.setItem("achievementstatus" + i,achievementstatus[i]);
                    }
                    pastratingnum = localStorage.getItem("pastratingnum");
                    for (var i = 0; i < pastratingnum; i++){
                        pastrating[i+1] = localStorage.getItem("pastrating"+i);
                    }
                    pastrating[0] = rating;
                    pastratingnum++;
                    if (pastratingnum > 50) pastratingnum = 50;
                    localStorage.setItem("pastratingnum",pastratingnum);
                    for (var i = 0; i < pastratingnum; i++){
                        localStorage.setItem("pastrating" + i,pastrating[i]);
                    }
                    if (gotachievement) achievementsound.play();/////////////////// achievement sound
                }
                ////////////////////////////////inclement or declement of lemon
                if (myaction == 0) myattack++;
                if (enemyaction == 0) enemyattack++;
                if (myaction == 1) myattack--;
                if (enemyaction == 1) enemyattack--;
                if (myaction == 1 && myattack == 0) myaction = 2;

                gauge=0;
                mode=0;

                enemyaction = decideact(enemyrating);
                turn++;
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
                ctx.lineTo(attackl+125,mytop+15);
            } else if(myaction == 2){
                ctx.moveTo(barrierl,mytop+15);
                ctx.lineTo(barrierl+140,mytop+15);
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
            ctx.fillRect(170,220,cwidth-170,1.5)/////////////////enemyline
            ctx.fillRect(0,370,cwidth-170,1.5)/////////////////myline
            ctx.font="13px serif";
            ctx.fillText("You",30,385);
            ctx.fillText("Enemy", cwidth-80,235);
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
    ///////////////////////////show or close achievements
    var square = { //square of show button
        x: 710, y: 430,  
        w: 150, h: 50  
    };
    if (viewachievement == 0){
        if ((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
        && (square.y <= point.y && point.y <= square.y + square.h)){
            viewachievement = 1;
            se_click.play();    
        }
    } else{
        if ((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
        && (square.y <= point.y && point.y <= square.y + square.h)){
            viewachievement = 0;
            se_click.play();    
        }
        var square = { //square of show button
            x: 700, y: 60,  
            w: 200, h: 50  
        };    
        if ((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
        && (square.y <= point.y && point.y <= square.y + square.h)){
            if(window.confirm("Are you sure? Your progress will be lost forever.")) resetachievement();
        }
    }
    var square = { //square of ranking entry button
        x: 125, y: 425,  
        w: 120, h: 40  
    };
    if (viewachievement == 3){
        if ((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
        && (square.y <= point.y && point.y <= square.y + square.h)){
            se_click.play();
            myrankingname=localStorage.getItem("myrankingname");
            if (myrankingname == null) myrankingname = "";
            var entryname = window.prompt("Please enter your name.",myrankingname);
            if (!checkname(entryname)){
                //entrynameとのかぶりを検索→一致があればそれを書き換え→なければ配列の末尾に追加→（共通）並び替え→ファイルへの書き込み
                var used = -1;
                for (var i = 0; i < 20;i++){
                    if (rankingname[i] == entryname) used=i;
                }
                var now = new Date();
                if (used == -1){
                    rankingname[20] = entryname;
                    rankingrating[20] = rating;
                    rankingdata[20] = now.getFullYear() % 2000 + "/" + now.getMonth + "/" + now.getdate + " " + now.gettime;
                } else {
                    rankingrating[used] = rating;
                    rankingdata[used] = now.getFullYear() % 2000 + "/" + now.getMonth + "/" + now.getdate + " " + now.gettime;
                }
                sortranking();
                var data = {
                    newname : entryname,
                    newrating : rating,
                    newdate : "this is a test"
                };
/*                $.ajax({
                    type:"post",url:"index.php",data:data,success: function(data,dataType){
                        window.alert("succeed!");
                    }
                })*/
                var request = new XMLHttpRequest();
                request.open("GET","https://yodai49.github.io/cclemon/index.php", true);
                request.responseType = 'json';
                request.addEventListener('load', function (response) {
                });
                request.send();

                localStorage.setItem("myrankingname",myrankingname);
            } else{
                window.alert("Your name is invalid");
            }
        }
    };

    var square = { //square of viewachievement_left button
        x: 395, y: 465,  
        w: 30, h: 30  
    };
    if (viewachievement == 2 || viewachievement == 3){
        if ((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
        && (square.y <= point.y && point.y <= square.y + square.h)){
            viewachievement--;
            se_click.play();
        }
    };
    var square = { //square of viewachievement_right button
        x: 435, y: 465,  
        w: 30, h: 30  
    };
    if (viewachievement == 1 || viewachievement == 2){
        if ((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
        && (square.y <= point.y && point.y <= square.y + square.h)){
            viewachievement++;
            if (viewachievement==3){ //////////////////////////////// load ranking
                var req = new XMLHttpRequest();
                req.open("get","ranking.csv",true);
                req.send(null);
                req.onload=function(){
                    var loadtemp=req.responseText.split("\n");
                    var loadtemp2;
                    for (var i = 0; i < loadtemp.length;i++){
                        loadtemp2=loadtemp[i].split(",");
                        rankingname[i] = loadtemp2[0];
                        rankingrating[i]=loadtemp2[1];
                        rankingdata[i] = loadtemp2[2];
                    }
                }
            }
            se_click.play();        
        }
    }
    var square = { //square of start button
        x: 300, y: 370,  
        w: 280, h: 55  
    };
    const start =
            (square.x <= point.x && point.x <= square.x + square.w)  // horizontal
         && (square.y <= point.y && point.y <= square.y + square.h)  // vertical
         && (startflg)&&(!viewachievement) //startflg    

    var square = { //square of tweet button
        x: 600, y: 410,  
        w: 150, h: 40  
    };
    if((square.x <= point.x && point.x <= square.x + square.w)  // horizontal
      && (square.y <= point.y && point.y <= square.y + square.h)  // vertical
      && (endflg)){
        var EUC = encodeURIComponent;
        var twitter_url = "https://twitter.com/intent/tweet?text=";
        var URL = window.location.href;
        var twmessage="";
        for (var i = 0;i < gotachievement; i++){
            twmessage +='NEW ACHIEVEMENT! >>>"' + achievementname[gotachievementnumber[i]] + '"\n';
            if (i == (gotachievementnumber-1)) twmessage+="\n\n";
        }
        if (message == "YOU WIN"){
            twmessage+="I won!";
        }else{
            twmessage+="I lost!";
        }
        twmessage = twmessage + "My new rating is " + rating + ".\n - - - - - - - - - - - -\n Why don't you play CCLemon?\n" + URL;
        if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
            location.href = twitter_url + EUC(twmessage);
        }else{
            window.open(twitter_url + EUC(twmessage), "_blank","top=50,left=50,width=500,height=500,scrollbars=1,location=0,menubar=0,toolbar=0,status=1,directories=0,resizable=1");
        }
    } //////////////////tweet

    var square = { //square of end button
        x: 0, y: 0,  
        w: cwidth, h: cheight  
    };
    const end =
         (square.x <= point.x && point.x <= square.x + square.w)  // horizontal
      && (square.y <= point.y && point.y <= square.y + square.h)  // vertical
      && (endflg) //endflg    

    if (start) {/////////////////////////////////////////////initialize
        startflg=0;
        myattack=1;
        enemyattack=1;
        turn = 0;
        maxlemon=0;
        currentlemon=0;
        maxattack=0;
        currentattack=0;
        maxbarrier=0;
        currentbarrier=0;
        rating-=50;
        localStorage.setItem("rating",rating);
        enemyrating=Math.floor(rating-40 + 80  * Math.random());
        bgm.src = "mainBGM.mp3";
        bgm.play();
        se_click.play(0);
    }
    if (end) {/////////////////////////////////////////////end clicked
        startflg=1;
        endflg=0;
        bgm.src = "titleBGM.mp3";
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
bgm.volume=0.8;
bgm.play();
for (var i = 0; i < 20; i++){
    achievementstatus[i] = Number(localStorage.getItem("achievementstatus" + i));
}
setInterval(loop,20);
