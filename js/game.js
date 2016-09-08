
'use strict';
window.addEventListener('load',init,false);
//window.AudioContext = window.AudioContext || window.webkitAudioContext;
//window.addEventListener('load',init,false);
var canvas=null,ctx=null;
var canvas2=null,ctx2=null;
var canvas3=null,ctx3=null;
var ctxA=null,ctxF=null;

//var ctxA=new (window.AudioContext || window.webkitAudioContext)();
var ctxA=new AudioContext();
//var ctxF=new (window.AudioContext || window.webkitAudioContext)();
var ctxF=new AudioContext();

var currentOsc, currentGain,osFondo,osGain,gg;
var scaleX=1,scaleY=1,rDead=0;
var touches=[];
var lastPress=null;
var i=0,j=0,k=0,m=0,n=0,tSp=0,p=0,tDead=0;//para los for, evita las variables locales

var counter=0,lastUpdate=0,ran=0;

var ancho=800,alto=450,cPira=800;//marca esta relacionada con los eventos touch
var x=0,y=0,anc=800,alt=450;
var objetosCargados=0,fCon=0,mCon=0,tBreaks=0;

var frame=0,pIndex=0,mParts=120;

var dataP={cx:0,cy:0,r:16,tx:2,w:32,h:32,sum:10,x:0,y:0,jump:0,vy:1,con1:0};
var dataCol={x:0,y:0,xf:0,yf:0,w:16,h:32,cx:0,cy:0,rx:8,ry:12,m:0,vx:1,vy:5,u:false,d:true,tl:0,j:2};//for collisions
var dataWorld={w:0,h:450};
var brdData={g:1,r:1.0,alp:1.0,up:false,outSd:false,do:false};
var dataLin={x:0,fr:false}
var dataSol={con:1.0,x:0,y:0,x2:-50,y2:-50,x1:ancho,y1:alto,rad:0};
var dataBreaks={p:0,w:0,m:0,r:true}


var dataJtPc={w:200,v:250,max:250,rect:200};
var gravity=1.025,mVol=1.0;

var iPlayer=new Image();
var iPiramide=new Image();
var iDest=new Image();
var iSnap=new Image();
var iBase=new Image();
var iReloj=new Image();
var iTurb=new Image();
var iCeleb=new Image();

var iMon1=new Image();//mountain big, proceduraly
var iMon2=new Image();//mountain little, proceduraly
var iFondo=new Image();//background image
var iHelp=new Image();//instrucs to gameplay

var reloj,cam;
//booleanas
var cargando=true,jugando=false,pausado=false,terminado=false,perdido=false;
var siMom=false,haySonido=true,isMenu=false,rSub=true,blur=true,mPira=true,sIn=false;
var PI=3.14159,alp=1.0,gr1=1.0,gr2=1.0;

var gradiente1;
//sonidos

var terrains=[],tTerr=[],trailChar=[],parts=[],frags=[];


//botones
var bPlay,bSoni,bPausa,bReset;

//funciones
function Camera() { 
	this.x = 0; 
	this.y = 0; 
} 
Camera.prototype = { constructor: Camera, focus: function (x, y) { this.x = x - canvas.width / 2; this.y = y - canvas.height / 2; if (this.x < 0) { this.x = 0; } else if (this.x > dataWorld.w - ancho) { this.x = dataWorld.w - ancho; mPira=false;} if (this.y < 0) { this.y = 0; } else if (this.y > dataWorld.h - alto) { this.y = dataWorld.h - alto; } } };

function getQBezierValue(t, p1, p2, p3) {//detect pos of sun
	var iT = 1 - t;
	return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function setBreak(){
	//create breakpoints in time
	
	if(tBreaks >= 2){
		
		if(dataCol.cx < terrains[8].center.x){
			
			dataBreaks.p=random(150,terrains[8].center.x);
			dataBreaks.w=random(150,terrains[5].center.x);
			dataBreaks.m=1;
			
		}else if(dataCol.cx >= terrains[5].center.x){
			if(random(1,2) == 1){
				//hacia adelante
				dataBreaks.p=random(dataCol.cx,terrains[48].center.x);
				dataBreaks.w=random(150,terrains[5].center.x);
				dataBreaks.m=1;
			}else{
				//hacia atras
				dataBreaks.p=random(dataCol.cx,terrains[48].center.x);
				dataBreaks.w=random(150,terrains[5].center.x);
				dataBreaks.m=2;
			}
		}
		tBreaks+=1;
	}
	
	switch(tBreaks){
		//
		case 0:
			if(random(1,2) == 1){
				//sucedera en la primer mitad
				//por lo tanto va hacia adelante

				dataBreaks.p=random(terrains[5].center.x,terrains[24].center.x);
				dataBreaks.w=random(terrains[5].center.x,terrains[10].center.x);
				dataBreaks.m=1;

			}else{
				//sucedera en la segunda mitad
				//por lo tanto va hacia atras
				dataBreaks.w=random(terrains[5].center.x,terrains[24].center.x);
				dataBreaks.p=(random(terrains[26].center.x,terrains[41].center.x));
				dataBreaks.m=2;
			}
			tBreaks=1;
		break;
		case 1:
	
			if(dataCol.cx > terrains[21].center.x){
				//estoy en la segunda mitad
				//este instante es pronto TERMINA el estrujo 1 de riempo
				if( dataCol.cx > terrains[36].center.x){
					dataBreaks.p=random(dataCol.cx,terrains[40].center.x);		
				}else{
					dataBreaks.p=random(dataCol.cx,terrains[37].center.x);
				}
				dataBreaks.w=random(terrains[5].center.x,terrains[10].center.x);

				dataBreaks.m=2;

			}else{
				//estoy en la primer mitad
				//este instante es pronto TERMINA el estrujo 1 de riempo
				dataBreaks.p=random(dataCol.cx,terrains[32].center.x);
				dataBreaks.w=random(terrains[5].center.x,terrains[10].center.x);
				dataBreaks.m=1;
			}
			tBreaks=2;
		
		break;
	}
	
}//fin de setbreak

function runBreak(){
	//execute obfuscation time
	if(!dataBreaks.r)return;
	osGain.gain.value=0;
	if(dataBreaks.m == 1){
		pIndex=dataCol.cx + dataBreaks.w;
	}else{
		pIndex=dataCol.cx - dataBreaks.w;
	}
	
	snap();
	if(pIndex > dataCol.cx){
		//glitch forward
		dataLin.x=0;
		dataLin.fr=true;
		reloj.mode=1;
		sRuido(0);
		reloj.actSec=~~((dataCol.cx*60)/4250);
		counter=reloj.actSec;
	}else{
		//glitch backward

		dataLin.x=ancho;
		dataLin.fr=false;
		reloj.mode=2;
		sRuido(1);
		reloj.actSec=~~((dataCol.cx*60)/4250);
		counter=reloj.actSec;
	}
	console.log(")-> debio lanzar;");
}

function winBlur(){
	switch(blur) {
		case true:
			blur=false;
			osGain.gain.value=0;
			//osGain.disconnect();
			if(dataCol.m == 2){
				dataCol.vy=5;
				dataCol.u=false;
				dataCol.d=true;
				stpJet();
			}
			
		break;
		case false:
			blur=true;
			//mCon=ctxF.currentTime();
			osGain.gain.value=0.1;
			//mMusic(true);
		break;
	}
}

function procedural(ir){
	
	var url;
		//create a terrains tiles background
	if(ir){
			canvas3.width = 120;
				canvas3.height = 256;

				ctx3.clearRect(0,0,120,256);
				//base de pasto
				for(i=0;i<=5; i+=1){
					for(j=0; j<=40; j+=1){
						ctx3.fillStyle="rgba("+random(90,180)+","+random(90,180)+",0,1.0)";
						ctx3.beginPath();
						ctx3.fillRect(j*3,i*3,3,3);
						ctx3.fill();
						ctx3.closePath();
					}
				}

				for(i=6;i<=255; i+=1){
					for(j=0; j<=40; j+=1){
						ctx3.fillStyle="rgba("+random(70,90)+","+random(70,90)+","+random(70,90)+",1.0)";
						ctx3.beginPath();
						ctx3.fillRect(j*3,i*3,3,3);
						ctx3.fill();
						ctx3.closePath();
					}
				}

				//base de piedra
				iBase.width = 120;
				iBase.height = 256;
				iBase.id = "tierra";
				iBase.name = "tierra";

				url = canvas3.toDataURL("image/png");
				iBase.src = url;
				//iBase.src = "SD/t.png";

				objetosCargados+=1;

				canvas3.width = 512;
				canvas3.height = 256;

				j=1;
				for(i=0;i<=15;i+=1){

					ctx3.save();
					ctx3.translate(256-(j*8), i*8);

					for(k=0;k<j;k+=1){

						ctx3.fillStyle="rgba("+random(10,30)+","+random(10,30)+","+random(10,30)+",1.0)";
						ctx3.beginPath();
						ctx3.fillRect(k*16,i*8,16,16);
						ctx3.fill();
						ctx3.closePath();

					}

					ctx3.restore();

					j+=2;

				}

				iPiramide.width = 512;
				iPiramide.height = 256;
				iPiramide.id = "pira";
				iPiramide.name = "pira";
				objetosCargados+=1;
				url = canvas3.toDataURL("image/png");

				iPiramide.src = url;

				//document.getElementById("procedural").style.display = "none";
				//document.getElementById("reloj").style.display = "none";
				//document.getElementById("canvas").style.display = "none";
				ctx3.clearRect(0,0,512,256);

			//celebration image, star light
			canvas3.width=256;
			canvas3.height=256;
			ctx3.clearRect(0,0,256,256);
			gradiente1=ctx3.createRadialGradient(128,128,0,128,128,128);
			gradiente1.addColorStop(1,"rgba(255,255,0,0.0)");
			gradiente1.addColorStop(0,"rgba(255,255,0,1.0)");
			ctx3.fillStyle=gradiente1;
			//ctx3.fillStyle="rgba(255,0,0,1.0)";

			//ctx3.arc(128,128,128,0,Math.PI*2,true);

			for(j=0;j<=9;j+=1){
				i=random(5,8);
				k=(j*20)+i;
				m=((j*20)+20)-i;

				k=k/100;
				m=m/100;
				//console.log("pedazo "+j+" k: "+k+" , m: "+m);
				//gr1=(k*Math.PI)/180;
				//gr2=(m*Math.PI)/180;

				//el pedazo
				ctx3.beginPath();
				ctx3.moveTo(128,128);
				ctx3.arc(128,128,128,m*Math.PI,k*Math.PI,true);
				ctx3.fill();
				ctx3.closePath();
			}
			gradiente1=ctx3.createRadialGradient(128,128,0,128,128,64);
			gradiente1.addColorStop(1,"rgba(255,255,0,0.0)");
			gradiente1.addColorStop(0.5,"rgba(255,255,0,0.8)");
			gradiente1.addColorStop(0,"rgba(255,255,0,1.0)");
			ctx3.fillStyle=gradiente1;


			ctx3.beginPath();
			ctx3.moveTo(128,128);
			ctx3.arc(128,128,72,0,2*Math.PI,true);
			ctx3.fill();
			ctx3.closePath();

			ctx3.fillStyle="rgba(255,255,255,1.0)";

			url = canvas3.toDataURL("image/png");
			objetosCargados+=1;
			iCeleb.width=256;
			iCeleb.height=256;
			iCeleb.id="iCeleb";
			iCeleb.name="iCeleb";

			iCeleb.src = url;

			ctx3.clearRect(0,0,256,256);

			//console.log("NOOO");
			//las montañas

			canvas3.width=800;
			canvas3.height=450;
			ctx3.clearRect(0,0,800,450);
		
			//color de montanas
			gradiente1=ctx3.createLinearGradient(0,270,0,alto);
			gradiente1.addColorStop(0.0,"rgba(112,37,4,1.0)");
			gradiente1.addColorStop(0.5,"rgba(39,25,19,1.0)");
			
			gradiente1.addColorStop(0.7,"rgba(53,30,19,1.0)");
			gradiente1.addColorStop(1.0,"rgba(3,85,51,1.0)");
			ctx3.fillStyle=gradiente1;

			//path de montanas
			ctx3.beginPath();
			ctx3.moveTo(0, 330);
			ctx3.bezierCurveTo(340, 340, 600, 270, ancho, alto-(~~(alto/2.88)));
			ctx3.lineTo(ancho,alto);
			ctx3.lineTo(0,alto);
			//ctx3.lineTo(0, alto-((alto/10)*3));
			ctx3.closePath();
			ctx3.fill();

			url = canvas3.toDataURL("image/png");
			objetosCargados+=1;
			iMon1.width=800;
			iMon1.height=450;
			iMon1.id="mon1";
			iMon1.name="mon1";


			iMon1.src = url;
			//la imagen de fondo
			ctx3.clearRect(0,0,800,450);
			gradiente1=ctx3.createLinearGradient(0,0,0,alto);
			gradiente1.addColorStop(0,"rgb(0,255,255)");
			gradiente1.addColorStop(0.9,"rgb(208,73,0)");
			gradiente1.addColorStop(1,"rgb(0,0,0)");
			ctx3.fillStyle=gradiente1;
			ctx3.beginPath();
			ctx3.fillRect(0,0,ancho,alto);
			ctx3.fill();
			ctx3.closePath();

			url = canvas3.toDataURL("image/png");
			objetosCargados+=1;
			iFondo.width=800;
			iFondo.height=450;
			iFondo.id="mon1";
			iFondo.name="mon1";
			iFondo.src=url;
			
			canvas3.width=160;
			canvas3.height=140;
			ctx3.clearRect(0,0,160,140);
			
			ctx3.fillStyle="rgba(0,45,1772,1.0)";
			ctx3.font="25Px Bold";
			ctx3.textAlign="origin";
			ctx3.fillText("Jump : space",0,20);
			ctx3.fillText("Jet Pack: w or ↑",0,55);
			ctx3.fillText("To pause : p",0,90);
			
			ctx3.textAlign="center";
      		ctx3.font = 'italic 20px Calibri';
			ctx3.fillText("!good luck :)",80,135);
			objetosCargados+=1;
			url = canvas3.toDataURL("image/png");
			iHelp.id="ayu";
			iHelp.name="ayu";
			iHelp.src=url;
			url=null;
			
		}//end of creation elements to world, only in initialize the game
		//after work in each restart game event
	
	//los terrenos
	i=0;
	j=0;
	k=0;
	for(i=0;i<=17;i+=1)tTerr[i]=1;
	for(i=18;i<=35;i+=1)tTerr[i]=2;
	for(i=36;i<=48;i+=1)tTerr[i]=3;
	//console.log(tTerr);
	for(j=0;j<=48;j+=1){
		k=random(0,tTerr.length-1);
		terrains[j]=new terrain(tTerr[k],0,0,j);
		tTerr.splice(k,1);

	}
	for(j=0;j<=48;j+=1){terrains[j].reset();}
	terrains[0].tipeDamage=1;
	terrains[0].maxDam=95;
	for(j=1;j<=4;j+=1){terrains[j].tipeDamage=0;}
	for(j=42;j<=48;j+=1){terrains[j].tipeDamage=0;}
	dataWorld.w=pIndex;
	pIndex=0;
}

function snap(){
	
	ctx3.clearRect(0,0,ancho,alto);
	var url;
	url = canvas.toDataURL("image/png");
	iSnap.src = url;
	url=null;
}

function creaBotones(){
	//x,y,width,height,cx,cy,id,tipo
	//bSoni=new Button(32,880,72,72,2,0,31,1);
	bPlay=new Button(272,alto-192,256,32,"Play",32);
	bSoni=new Button(272,alto-128,256,32,"Sound ON",32);
	bReset=new Button(272,alto-256,256,32,"Restart",32);


}

function switchAudio(t){
	//console.log("al sonido : "+haySonido);
	
		switch(haySonido){
		case true:
			
			localStorage.setItem("sonido","0");
			haySonido=false;
			bSoni.text="Sound OFF";
			
			//osGain.gain.value=0.0;
			osGain.disconnect();
		break;
		case false:
			localStorage.setItem("sonido","1");
			haySonido=true;
			bSoni.text="Sound ON";
			//osGain.gain.value=0.1;
			mMusic(true);
			
		break;
	}
	
	

}

function toPlayPause(){
	switch(jugando){
		case true:
			jugando=false;
			pausado=true;
			terminado=false;
			perdido=false;
			bPlay.text="Continue";
		break;
		case false:
			jugando=true;
			pausado=false;
			bPlay.text="Play";
			terminado=false;
			perdido=false;	
		break;
	}
}

function iniciaSonidos(){
	
	if(localStorage.getItem("sonido")=="0"){
		haySonido=false;
		bSoni.text="Sound OFF";
	}else if(localStorage.getItem("sonido")=="1"){

		haySonido=true;
		bSoni.text="Sound ON";

	}
	
}

function random(min, max){
   return Math.floor(Math.random()*(max-(min-1))) + min;
}

function sRuido(r){
		
	if(!haySonido | !jugando)return;
	osGain.gain.value=0.0;
	var frq = ruidos[r].f;
	//console.log("edse"+frq);
	var o = ctxA.createOscillator();
	var g = ctxA.createGain();
    
    if (currentOsc) currentOsc.stop(0);
    o.type = "triangle";
    o.frequency.value = frq;
	o.start(0);
	currentOsc = o;
	currentGain = g;

	g.gain.value = 1;
	o.connect(g);
	g.connect(ctxA.destination);
   
}//end of sRuido

function stRuid(){
	if(!haySonido)return;
	currentGain.gain.value = 0;
	
}

function sJet(){
	if(!haySonido)return;
	var frq = ruidos[2].f;
	var o = ctxA.createOscillator();
	var g = ctxA.createGain();
    
    if (currentOsc) currentOsc.stop(0);
    o.type = "sine";
    o.frequency.value = frq;
	o.start(0);
	currentOsc = o;
	currentGain = g;

	g.gain.value = 1;
	o.connect(g);
	g.connect(ctxA.destination);
}

function stpJet(){
	if(!haySonido)return;
	if(currentGain)currentGain.gain.value = 0;
}

function sDead(arr,lar,bp,it){
	if(!haySonido)return;
	//sound in moment of dead character
	var o, t=ctxA.currentTime;
	var arrayLength =lar;
	var playlength = 0;
	var bpm = bp;
	gg=ctxA.createGain();
	for (var i = 0; i < arrayLength; i++) {
        o = ctxA.createOscillator();
        // 1 second divided by number of beats per second times number of beats (length of a note)
        playlength = 1/(bpm/60) * arr[i].v;
        o.type = "sine";
        o.frequency.value = arr[i].f;
		
        o.start(t);
        o.stop(t + playlength);
        t += playlength;
		gg.gain.value=0.1;
		o.connect(gg);
        gg.connect(ctxA.destination);
    }
	
}

function sCeleb(){
	if(!haySonido)return;
	//sound in moment of dead character
	var o, t=ctxA.currentTime;
	
	var playlength = 0;
	
	var gg=ctxA.createGain();
	for (var i = 0; i < 15; i++) {
        o = ctxA.createOscillator();
        // 1 second divided by number of beats per second times number of beats (length of a note)
        playlength = 1/(200/60) * sFin[i].v;
        o.type = "triangle";
        o.frequency.value = sFin[i].f;
		
        o.start(t);
        o.stop(t + playlength);
        t += playlength;
		gg.gain.value=0.1;
		o.connect(gg);
        gg.connect(ctxA.destination);
    }
	
}

function mMusic(u){
	return;
	
}

function init(){


	//scaleX=(ancho/window.innerWidth);
	//scaleY=(alto/window.innerHeight);
	canvas=document.getElementById('canvas');
	ctx=canvas.getContext('2d',{antialias:false});
	canvas.width=ancho;
	canvas.height=alto;

	//canvas del reloj
	canvas2=document.getElementById('reloj');
	ctx2=canvas2.getContext('2d',{antialias:false});
	canvas2.width=ancho;
	canvas2.height=alto;
	canvas2.style.zIndex="2";

	//canvas procedural
	canvas3=document.getElementById('procedural');
	ctx3=canvas3.getContext('2d',{antialias:false});
	canvas3.width=ancho;
	canvas3.height=alto;
	canvas3.style.zIndex="-1";
	
	canvas.style.position='absolute';
	canvas2.style.position='absolute';
	canvas3.style.position='absolute';

	canvas.style.backgroundColor='transparent';
	canvas.style.top='0';
	canvas.style.left='0';
	//canvas.style.width='100%';
	//canvas.style.height='100%';
	canvas.style.zIndex="1";
	//audio canvas
	
	
	osGain=ctxF.createGain();
	osGain.value=1;

	iPlayer.onload=function(){
		
		dataP.cx=400;
		dataP.cy=alto - (70);
		
		dataP.x=dataP.cx - dataP.r;
		dataP.y=dataP.cy - dataP.r;
		objetosCargados+=1;

	}
	iPlayer.src="SD/c.png";
	iReloj.onload=function(){objetosCargados+=1;}	
	iReloj.src="SD/t.png";
	iTurb.onload=function(){objetosCargados+=1;}
	iTurb.src="SD/l.png";
	
	reloj=new Clock();
	
	cam=new Camera();
	
	for(j=0;j<=50;j++){
		trailChar[j]={m:false,x:0,y:0,a:1.0}
	}
	
	for(j=0;j<=mParts;j+=1){
		//console.log(450*(-j*0.1));
		parts[j]=new part();
	}
	
	for(j=0;j<=44;j+=1){
		//console.log(j*10);
		frags[j]={x:0,y:j*10,h:10,w:0,cy:j,cx:0}//to slice  image to show a glitch
	}
	
	//console.log(5*1.2);
	//console.log(5*(-1.2));
	
	
	brdData.alp=1.0;
	brdData.up=false;
	creaBotones();
	iniciaSonidos();
	enableInputs();
	procedural(true);
	//mMusic();
	setBreak();
	run();
}//fin de init()

function run(){
	

	var now=Date.now(); 
	var deltaTime=(now-lastUpdate)/1000; 
	if(deltaTime>1)deltaTime=0; 
	lastUpdate=now; 
	act(deltaTime); 

	paint();
	requestAnimationFrame(run);
}

function rPart(q){
	for(j=1;j<=mParts;j+=1){
		//console.log(450*(-j*0.1));
		if(!parts[j].mode){
			parts[j].mode=true;
			
			parts[j].center.x=(dataCol.cx-4);
			parts[j].center.y=dataCol.cy;
			parts[j].alp=1.0;
			if(q==null){
				parts[j].rads = ((120 + (random(-10,10)))*PI)/180;
				parts[j].v=3;
			}
			if(q==1){
				parts[j].rads = ((random(0,359))*PI)/180;
				parts[j].v=random(1,4);
			}
			parts[j].g=0;
			parts[j].b=0;
			//console.log("se lanzo "+parts[j].alp);
			if(q==null)break;
		}
	}
}

function aSpr(){
	dataP.sum-=1;
	if(dataP.sum < 1){

		dataP.sum=5;
		dataP.tx+=1;

	if(dataP.tx > 7){
		tSp+=2;
		dataP.tx=0;	

	}
	}
}

function moveUp(){
	dataCol.cy -=(~~(dataCol.vy *= 0.88));
	
}

function moveUp2(){
	//in jetPack
	dataCol.cy -=(~~(dataCol.vy *= 0.95));
	return;
	dataCol.vy-=(dataCol.vy*0.08);
	//console.log();
	if(dataCol.vy > 1){
		//dataCol.cy -=(~~(dataCol.vy *= 0.90));
		dataCol.cy -=dataCol.vy;
	}
	
	
}

function moveDown(tile){
	//	console.log("nana");

		if(dataCol.yf > terrains[tile].pos.y+5){

			dataCol.yf=terrains[tile].pos.y+5;
			dataCol.cy=(terrains[tile].pos.y+5)-dataCol.ry;
			dataCol.vy=5;
			dataCol.d=false;

			
		}else if(dataCol.yf <= terrains[tile].pos.y+5){
		//gravity add force
			dataCol.cy +=(~~(dataCol.vy *= gravity));
			dataCol.cx+=1;
			//console.log("ad graviti");
			//console.log("yurani "+dataCol.cy);
			dataCol.j=0;
			dataCol.d=true;
		}
}

function gDown(tile){
	//manage fall after jump in max up point
	if(dataCol.yf < terrains[tile].pos.y+5){
		//gravity add force
		//forward move
		dataCol.cy +=(~~(dataCol.vy *= gravity));
		moveFront(tile+1,2);
		//console.log("adel1");
		
	}else if(dataCol.yf >= (terrains[tile].pos.y+5) ){
		//if mi center is more big that the end this tile
		if(dataCol.cx > terrains[tile].fin.x){
			//next tile to landing
			if(dataCol.yf < terrains[tile+1].pos.y+5){
				
				dataCol.cy +=(~~(dataCol.vy *= gravity));
				moveFront(tile+1,2);
				//console.log("adel2");
				
			}else if(dataCol.yf >= terrains[tile+1].pos.y+5){
				//dataCol.cy +=(~~(dataCol.vy *= gravity));
				//no forward. only fall to dead in abism
				dataCol.cx = terrains[tile+1].pos.x - dataCol.rx;
				dataCol.vy=5;
				dataCol.m=0;
				dataCol.j=0;
				dataCol.d=false;
				//console.log("MORIR 2");
			}
		}else{
			//landing in actual tile
			//dataCol.cy = (terrains[tile].pos.y+5)-dataCol.ry;
			dataCol.vy=5;
			dataCol.m=0;
			dataCol.j=0;
			dataCol.d=false;
			//console.log("MORIR 1");
		}
	}
	//console.log("aquii");
}//fin de gdown

function moveFront(tile,h){
	
	if(dataCol.xf > terrains[tile].pos.x){
		//ya tengo la nariz en el siguiente
		//bloque
		
		if(dataCol.yf <= (terrains[tile].pos.y +5)){
			dataCol.cx+=h;
			//console.log("avanzo en nariz");
			aSpr();
		}else if(dataCol.yf > (terrains[tile].pos.y +5)){
			//no avanzar, se choco contra el siguiente bloque
			//console.log(dataCol.yf+" no avanza "+(terrains[tile].pos.y+5));
			dataP.sum+=1;
			dataP.tx=6;
		}
	}else{
		//console.log("avanzo en normal");
		dataCol.cx+=h;
		aSpr();
	}
}

function upB(){
	//update a box collider
	//respect to center of collider
	dataCol.x=dataCol.cx-dataCol.rx;
	dataCol.xf=dataCol.cx+dataCol.rx;
	dataCol.y=dataCol.cy-dataCol.ry;
	dataCol.yf=dataCol.cy+dataCol.ry;
}

function dTl(){
	//detects the tile on which the character is walking
	for(n=0;n<=48;n+=1){
		if(terrains[n].center.x < (dataCol.cx+400) | (dataCol.cx-400) > terrains[n].center.x ){
			//console.log("de");
			if(dataCol.cx >= terrains[n].pos.x & dataCol.cx <= (terrains[n].fin.x)){
				//console.log("caminando sobre "+terrains[n].index);
				//estoy encima ?

				dataCol.tl=terrains[n].index;
				break;
			}
		}
	}
}

function eBug(dir){
	//on finish squeeze time
	//detect its here in a platform
	//to kill a charecter
	//console.log("dir "+dir);
	osGain.gain.value=0.1;

	if(dataCol.xf > terrains[dataCol.tl].pos.x &
	  dataCol.x < terrains[dataCol.tl].fin.x &
	  dataCol.yf > (terrains[dataCol.tl].pos.y+5) &
	  dataCol.y < terrains[dataCol.tl].fin.y){

		/*
		if(dir){
			dataLin.x=0;
			dat
		}else{
			dataCol.m=5;
			console.log("mor atrs");
			reloj.mode=3;
		}
		*/
		rDead=1;
		dataCol.m=5;
		tDead=1;//buried for teletransport in a terrain block
		reloj.mode=3;
		flow(5,1);
	}else{
		//moveFront(dataCol.tl);
		//dataCol.m=0;
		//console.log("no mori ds obs");
		setBreak();
		reloj.mode=0;
	}
}

function playerUp(){
	//update data collider, box
	//if(!os)return;
	switch(dataCol.m){
			
		case 0:
			//corriendo normal
			//caer por la gravedad : vy
			
			dTl();
			
			dataCol.xf=dataCol.x+dataCol.w;
			dataCol.yf=dataCol.y+dataCol.h;

			
			dataP.x=dataP.cx - dataP.r;
			dataP.y=dataP.cy - dataP.r;
			
			//call a manager of movements
			moveDown(dataCol.tl);
			moveFront(dataCol.tl+1,1);
			
			//cortes de la animacion de correr
			//aSpr();
			
		break;
		case 1:
			//saltando/jummping
			dTl();
			upB();
			if(dataCol.u){
				moveUp();
				moveFront(dataCol.tl+1,2);
				
				if(dataCol.vy < 1){
					
					dataCol.u=false;
					dataCol.d=true;
					dataCol.vy=5;
				}
			}
			if(dataCol.d){
				gDown(dataCol.tl);
			}
			
		break;
		case 2:
			//en el aire por jetPack
			dTl();
			upB();
			if(dataCol.u){
				rPart();
				
				if(dataCol.vy < 1){
					/*
					dataCol.u=false;
					dataCol.d=true;
					dataCol.vy=5;
					*/
					//console.log("no ");
					moveFront(dataCol.tl+1,1);
					
				}else{
					moveUp2();
					moveFront(dataCol.tl+1,2);
				}
			}
			if(dataCol.d){
				gDown(dataCol.tl);
				dataCol.m=0;
			}
			//manage jetPack energy
			dataJtPc.v-=2;
			if(dataJtPc.v < 0){
				dataJtPc.v=0;
				
				dataCol.vy=5;
				dataCol.u=false;
				dataCol.d=true;
				
				if(sIn){
					stpJet();
					sIn=false;
				}
				
				
			}
			dataJtPc.w=~~((dataJtPc.v * dataJtPc.rect)/dataJtPc.max);
			//console.log(dataCol.vy);
		break;
		case 3:
			//quieto
			dataP.sum=5;
			dataP.tx=2;	
		break;
		case 4:
			//down for killed, to right
			dataCol.cx+=1;
			dataCol.cy+=2;
			
		break;
		case 5:
			//cayendo por gravedad, ya NO puede saltar
			//down for killed, to left
			dataCol.cx-=1;
			dataCol.cy+=2;

		break;
	}
	
	
}//fin de player up

function pSun(){
	//paint the sun
	if(reloj.mode != 0)return;
	ctx.fillStyle="rgba(255,255,255,1.0)";
	gradiente1=ctx.createRadialGradient(dataSol.x,dataSol.y,0,dataSol.x,dataSol.y,dataSol.rad);
	gradiente1.addColorStop(1,"rgba(255,255,0,0.0)");
	gradiente1.addColorStop(0,"rgba(255,255,0,1.0)");
	ctx.fillStyle=gradiente1;
	//ctx.fillStyle="rgba(255,12,12,1.0)";
	
	ctx.beginPath();
	ctx.moveTo(dataSol.x,dataSol.y);
	ctx.arc(dataSol.x,dataSol.y,dataSol.rad,0,2*Math.PI,true);
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle="rgba(255,255,255,1.0)";
	ctx.beginPath();
	ctx.moveTo(dataSol.x,dataSol.y);
	ctx.arc(dataSol.x,dataSol.y,(dataSol.rad - (dataSol.rad/3)),0,2*Math.PI,true);
	ctx.fill();
	ctx.closePath();
	
}

function pPintar(){
	
	//paint sun
	//console.log(dataSol.x+" , "+dataSol.y);
	if(dataCol.m == 2){
		dataP.tx=2;
		
		ctx.globalAlpha=(random(80,100))/100;
		ctx.drawImage(iTurb,(dataCol.x-10)-cam.x,dataCol.cy);
		ctx.globalAlpha=1.0;
		
	}
	
	if(terminado){
		
		ctx.save();
		ctx.globalAlpha=brdData.alp;
		ctx.translate(dataCol.cx-cam.x,dataCol.cy);
		ctx.rotate((gr2*Math.PI) / 180);
		ctx.drawImage(iCeleb,-128,-128);
		ctx.globalAlpha=1.0;
		ctx.restore();
	}
	
	if(perdido){
		
		if(tDead == 1){
			brdData.outSd=true;
			ctx.globalAlpha=brdData.alp;
			ctx.drawImage(iPlayer,8*dataP.w,0,dataP.w,dataP.h,dataP.x - cam.x,dataP.y,dataP.w,dataP.h);
		}else if(tDead == 0){
			ctx.drawImage(iPlayer,8*dataP.w,0,dataP.w,dataP.h,dataP.x - cam.x,dataP.y,dataP.w,dataP.h);		
		}
		
		ctx.globalAlpha=1.0;
		
	}else{
		ctx.drawImage(iPlayer,dataP.tx*dataP.w,0,dataP.w,dataP.h,dataP.x - cam.x,dataP.y,dataP.w,dataP.h);
	}
	
}

function util_replay(){
	//recreate the tiles, sizw, movement ant times

	frame=0;
	flow();
}

function flow(action,q){
	
	switch(action) {
		case 0:
			//from isMenu to play
			
			isMenu=false;
			jugando=true;
			reloj.actSec=0;
			counter=0;
			reloj.center.x=~~(ancho - (reloj.radio * 1.2));
			reloj.center.y=~~(reloj.radio * 1.2);
			dataCol.cx=150;
			dataCol.cy=alto - (alto/4);
			upB();
			dataCol.m=0;
			break;
		case 1:
			//from play to pause / pause to play
			if(!isMenu)toPlayPause();
			break;
		case 2:
			//from play to ended / win
			jugando=false;
			terminado=true;
			dataCol.vy=3;
			dataCol.m=3;
			bPlay.text = "Play again";
			sCeleb();
			break;
		case 3:
			//from play to loser

			break;
		case 4:
			//from ended to re-play
			jugando=true;
			terminado=false;
			bPlay.text="Play";
			console.log("esto NO debio ser");
			break;
		case 5:
			//from play to game over/lost
			tDead=q;//how dead, 0=burn, 1=buried
			jugando=false;
			terminado=false;
			perdido=true;
			bPlay.text="Re-play";
			dataCol.m=0;
			sDead(sKill,12,1000,1.0);
			break;
	}
}

function runTraChar(){
	for(j=0;j<=50;j++){
		if(!trailChar[j].m){
			trailChar[j].m=true;
			trailChar[j].a=1.0;
			trailChar[j].x=dataP.x;
			trailChar[j].y=dataP.y;
			break;
		}
	}
}


function rStart(){
	//restart  the game without restart the page
	brdData.alp=1.0;
	brdData.up=false;
	procedural(false);
	tSp=0;
	isMenu=false;
	jugando=true;
	terminado=false;
	pausado=false;
	perdido=false;
	cargando=false;
	
	tBreaks=0;
	dataBreaks.r=true;
	setBreak();
	reloj.mode=0;
	reloj.actSec=0;
	counter=0;
	reloj.center.x=~~(ancho - (reloj.radio * 1.2));
	reloj.center.y=~~(reloj.radio * 1.2);
	dataCol.cx=150;
	dataCol.cy=alto - (alto/4);
	upB();
	dTl();
	//
	for(j=0;j<=45;j+=1)terrains[j].update(true);
	dataLin={x:0,fr:false};
	//dataSol={con:1.0,x:0,y:0,x2:-50,y2:-50,x1:ancho,y1:alto,rad:0};
	//dataSol={con:1.0,x:0,y:0,x2:-50,y2:-50,x1:ancho,y1:alto,rad:0};
	dataJtPc.v=250;
	dataJtPc.w=200;
	
	dataCol.cx=terrains[0].center.x +5;
	dataCol.cy=(terrains[0].pos.y +4) -dataCol.ry;
	dataP.cx=dataCol.cx;
	dataP.cy=dataCol.cy;

	dataP.x=dataP.cx - dataP.r;
	dataP.y=dataP.cy - dataP.r;
	
	cam.focus(dataCol.cx,dataCol.cy);
	
	dataCol.m=0;
	//playerUp();
	console.log("me reinicie");
}

function act(delta){
	
	//bacground music
	
	//mCon+=1;
	//console.log(ctxF.currentTime+" , "+mCon);
	if(haySonido & blur){
		if(ctxF.currentTime >= mCon){
		//mMusic(false);
		//console.log("llamo "+mCon);
		//console.log(ctxF.currentTime);
		//ctxF.currentTime(0);
		//mCon=0;
		}
	}
	
	if(cargando){
		//console.log(objetosCargados);
		if(objetosCargados > 7){
			cargando=false;
			isMenu=true;
			
			//procedural();
			i=0;
			j=0;
			k=0;
		}
	}//fin de cargando

	if(isMenu){
	   counter+=delta;

		reloj.actSec=~~counter;

		if(reloj.actSec > 59){
			reloj.actSec=0;
			counter=0;
		}else{
			if(random(1,200)==1){
				reloj.actSec=random(0,48);
				counter=reloj.actSec;
				dataP.tx=random(0,7);
			}
		}
	if(bSoni.touch()){
		touches[0]=null;
		switchAudio();
	}
	if(bPlay.touch()){
		touches[0]=null;
		isMenu=false;
		flow(0);
	}
	reloj.update(false);
	//playerUp(false);
	aSpr();
	for(j=0;j<=45;j+=1)terrains[j].update(true);
		dataCol.cx=terrains[0].center.x +5;
		dataCol.cy=(terrains[0].pos.y +4) -dataCol.ry;
		upB();
		
		dataP.cx=dataCol.cx;
		dataP.cy=dataCol.cy;
		
		dataP.x=dataP.cx - dataP.r;
		dataP.y=dataP.cy - dataP.r;
		
	}//fin de isMenu

	if(jugando){
		frame+=1;
		if(frame > 100)frame=0;
		for(j=0;j<=48;j+=1)terrains[j].update(true);
		
		if(dataCol.cy < 64)dataCol.cy =64;
		if(dataCol.cy > dataWorld.h-50){
			flow(5,0);
			rDead=0;
			brdData.g=280;
			brdData.outSd=false;
			brdData.up=true;
			brdData.do=false;
			dataCol.vy=10;
			rPart(1);
		}
		
		switch(reloj.mode){
			case 0:
				//destino normal

				reloj.actSec=~~((dataCol.cx*60)/4250);
				if(reloj.actSec > 59){
					reloj.actSec=0;
					counter=0;
				}

				reloj.update(true);
				playerUp(true);
				
				
				for(p=1;p<=mParts;p+=1){if(parts[p].mode)parts[p].update();}
				if(dataCol.cx >= dataBreaks.p-5 & dataCol.cx <= dataBreaks.p+5){
					runBreak();
				}
			break;
			case 1:
				//bug: forward time

				//if(anc > 10)anc-=10;
				alt+=1;
				if(alt > 1){
					runTraChar();
					alt=0;
				}

				dataCol.cx+=10;
				

				if(dataCol.cx > pIndex){
					reloj.mode=0;
					//dataCol.cx=pIndex;
					//dataCol.m=0;
					stRuid();
					upB();
					dTl();
					eBug(true);
					for(m=0;m<=50;m++)trailChar[m].m=false;

				}
				
				reloj.actSec=~~((dataCol.cx*60)/4250);
				
				reloj.update(true);
				for(m=0;m<=50;m++){
					if(trailChar[m].m){
						trailChar[m].a-=0.02;
						trailChar[m].x-=1;
						if(trailChar[m].a < 0.05){
							trailChar[m].m=false;
						}
					}
				}
				//playerUp();
				
				//line to glitch
				if(dataLin.x<ancho)dataLin.x+=10;
				
			break;
			case 2:
				//bug: backward time
				dataCol.cx-=10;
				
				
				alt+=1;
				if(alt > 1){
					runTraChar();
					alt=0;
				}
				if(dataCol.cx < pIndex){

					reloj.mode=0;
					//dataCol.cx=pIndex;
					stRuid();
					upB();
					dTl();
					eBug(false);
					for(m=0;m<=50;m++)trailChar[m].m=false;
				}
				
				reloj.actSec=~~((dataCol.cx*60)/4250);
				
				reloj.update(true);

				for(m=0;m<=50;m++){
					if(trailChar[m].m){
						trailChar[m].a-=0.05;
						trailChar[m].x+=1;
						if(trailChar[m].a < 0.05){
							trailChar[m].m=false;
						}
					}
				}
				//playerUp();
				if(dataLin.x>0)dataLin.x-=10;
			break;
			

		}
		
		if(mPira){
			if(dataCol.cx > 400){
				cPira=~~(800-(((dataP.cx-400)*ancho) / 4286));
			}else{
				cPira=800;
			}
		}
		reloj.update();

		
		dataCol.x=dataCol.cx-dataCol.rx;
		dataCol.y=dataCol.cy-dataCol.ry;
		
		dataP.cx=dataCol.cx;
		dataP.cy=dataCol.cy;
		
		//manage sun position
		dataSol.con = ((dataCol.cx * 1000)/4250)/1000;//sun pos in line bezier
		dataSol.rad=(((dataCol.cx * 100)/4250));
		dataSol.x = getQBezierValue(dataSol.con, dataSol.x1, 600, dataSol.x2);
		dataSol.y = getQBezierValue(dataSol.con, dataSol.y1, 50, dataSol.y2);
		
		
		dataP.x=dataP.cx - dataP.r;
		dataP.y=dataP.cy - dataP.r;
		
		if(frame%2 == 0){
			
			if(rSub){
				ran+=1;
				if(ran > 20){rSub=false;}	
			}else{
				ran-=1;
				if(ran < 1){rSub=true;}	
			}
			//console.log(ran);
			
		}
		
		//console.log(cPira);
	}//fin de jugando act

	if(pausado){

		if(bReset.touch()){
			touches[0]=null;
			rStart();
		}
		if(bPlay.touch()){
			touches[0]=null;
			isMenu=false;
			flow(1);
		}
		if(bSoni.touch()){
			touches[0]=null;
			switchAudio();
		}

	}

	if(terminado){
		for(j=0;j<=45;j+=1)terrains[j].update(false);
		
		
		if(dataCol.cy > (terrains[1].pos.y - 270)){
			dataCol.cy-=(dataCol.vy*=0.99);
			//console.log("squi fin ganado "+dataCol.cy);
			gr1+=1;
			siMom=false;
		}else{
			siMom=true;
			gr1+=1;
			
			if(bSoni.touch()){
				touches[0]=null;
				switchAudio();
			}
			if(bPlay.touch()){
				touches[0]=null;
				pIndex=0;
				rStart();
			}
			
		}
		
		if(dataCol.cx < 4350 + 10){
			dataCol.cx+=1;
		}else if(dataCol.cx > 4350 + 10){
			dataCol.cx-=1;
		}
		dataP.cx=dataCol.cx;
		dataP.cy=dataCol.cy;
		
		dataP.x=dataP.cx - dataP.r;
		dataP.y=dataP.cy - dataP.r;
		
		upB();
		playerUp(true);
		//giro de la celebracion
		
		if(gr1 > 5){
			gr1 =0;
			gr2+=random(2,5);
			if(gr2 > 359)gr2=0;

		}
		//transparencia de la celebracion
		
		if(brdData.up){
			brdData.alp+=0.01;
			if(brdData.alp > 0.95)brdData.up=false;
		}else{
			brdData.alp-=0.01;
			if(brdData.alp < 0.4)brdData.up=true;
		}
		
		
	}//fin de terminado en act
	
	if(perdido){
		
		switch(tDead) {
			case 0:
				//burn, quemado
				
				
				if(brdData.up){
					dataCol.vy-=1;
					dataCol.cy-=(dataCol.vy);
					if(dataCol.vy < 1){
						brdData.up=false;
						brdData.do=true;
					}
				}else if(brdData.do){
					
					dataCol.cy+=1;
					
					if(dataCol.cy > (alto+32)){
						brdData.do=false;
						brdData.outSd=true;
						console.log("perdi...");
						//ready to reset
					}
				}
				upB();
				dataP.cx=dataCol.cx;
				dataP.cy=dataCol.cy;

				dataP.x=dataP.cx - dataP.r;
				dataP.y=dataP.cy - dataP.r;
				
				for(p=1;p<=mParts;p+=1){if(parts[p].mode)parts[p].update();}
			break;
			case 1:
				
				//buried, enterrado
				if(brdData.up){
					brdData.alp+=0.03;
					if(brdData.alp > 0.95)brdData.up=false;
				}else{
					brdData.alp-=0.03;
					if(brdData.alp < 0.05)brdData.up=true;
				}
			break;
		}
		
		if(brdData.outSd){
			if(bSoni.touch()){
				touches[0]=null;
				switchAudio();
			}
			if(bPlay.touch()){
				dataCol.cx=0;
				dTl();
				pIndex=0;
				rStart();
				touches[0]=null;
			}
		}
		
	}//fin de perdido
	mPira=true;
	cam.focus(dataCol.cx,dataCol.cy);
   touches[0]=null; 
}//fin de act

function rPintar(hasta){
	
	if(reloj.mode==0 | reloj.mode == 3 | reloj.mode==4){

		gradiente1=ctx.createLinearGradient(0,alto-(alto/10),0,alto);
		gradiente1.addColorStop(0,"rgba(255,212,1,"+ran/30+")");
		gradiente1.addColorStop(0.8,"rgba(255,0,4,0.9)");
		gradiente1.addColorStop(1,"rgba(0,0,0,1.0)");
		ctx.beginPath();
		ctx.fillStyle=gradiente1;
		ctx.fillRect(0,(alto-(alto/10)),ancho,alto/5);
		ctx.fill();
		ctx.closePath();
		for(j=0;j<=hasta;j+=1)terrains[j].pintar();
			
	}else if(reloj.mode ==1 | reloj.mode==2){
		//console.log(dataLin.x);

		ctx.drawImage(iSnap,0,0);
		//for(j=1;j<=hasta;j+=1)terrains[j].pintar2();
			
			for(j=0;j<=44;j+=1){
				//console.log(450*(-j*0.1));
				//frags[j]={x:0,y:(j-1)*20,h:alto/20,cy:j-1,cx:0}//to slice  image to show a glitch
				
				
				if(dataLin.fr){
					
					frags[j].cx=0;
					frags[j].x=random(-20,20);
					frags[j].w=dataLin.x +(random(-20,20));
					
				}else{
					
					frags[j].cx=dataLin.x + (random(-20,20));
					frags[j].x=frags[j].cx + (random(-20,20));
					frags[j].w=ancho -frags[j].cx;
					
				}
				
				
				//
				//ctx.drawImage(iSnap,frags[j].cx,frags[j].cy,frags[j].w,frags[j].h,frags[j].x,frags[j].y,frags[j].w,frags[j].h);
				ctx.drawImage(iSnap,frags[j].cx,frags[j].cy*frags[j].h,frags[j].w,frags[j].h,frags[j].x,frags[j].y,frags[j].w,frags[j].h);
			}
		
		for(j=0;j<=50;j++){
			if(trailChar[j].m){
				ctx.globalAlpha=trailChar[j].a;
				ctx.drawImage(iPlayer,dataP.tx*dataP.w,0,dataP.w,dataP.h,trailChar[j].x-cam.x,dataP.y,dataP.w,dataP.h);

			}
		}
		
		ctx.globalAlpha=1.0;
		
		
	}
	for(p=1;p<=mParts;p+=1){if(parts[p].mode)parts[p].pintar();}
}

function pHelp(r){
	
		ctx.fillStyle="rgba(255,88,0,0.5)";
		ctx.beginPath();
		if(r){
			ctx.fillRect(ancho-160,alto-140,160,140);ctx.drawImage(iHelp,ancho-160,alto-140);
		}else{
			ctx.fillRect(ancho-160,0,160,140);ctx.drawImage(iHelp,ancho-160,0);
		}
		
		ctx.fill();
		ctx.closePath();
		ctx.fillStyle="rgba(0,0,0,1.0)";
		
		
}

function paint(){
	//ctx.fillStyle='#000';
	ctx.clearRect(0,0,ancho,alto);
	
	//sky bue/orange
	ctx.drawImage(iFondo,0,0);
	pSun(); 
	
	//mountain
	
	ctx.drawImage(iMon1,0,0);
	
	//llanura cercana
	gradiente1=ctx.createLinearGradient(0,alto-(alto/5),0,alto);
	gradiente1.addColorStop(0,"rgb(0,32,1)");
	gradiente1.addColorStop(1,"rgb(0,160,4)");
	ctx.fillStyle=gradiente1;
	ctx.beginPath();
	ctx.fillRect(0,alto-(alto/5),ancho,alto/5);
	ctx.fill();
	ctx.closePath();
	
	if(cargando){
		ctx.fillStyle="rgba(255,255,255,1)";
		ctx.font="30Px Arial";
		ctx.textAlign = "center";
		ctx.fillText("loading . . .",ancho/2,alto/2);
	}

	if(isMenu){
		ctx.fillStyle="rgba(0,0,0,1)";
		
		ctx.drawImage(iPiramide,800-64,alto-(alto/3),128,64);

		ctx.font="100Px Arial";
		ctx.textAlign = "origin";
		ctx.fillText("Ah Kin",150,132);
		ctx.fillText("Glitch",630,132);
		//ctx.fillText(dataCol.cy,50,140);
		//ctx.fillText(haySonido,50,90);
		rPintar(20);
		reloj.pintar(true);

		bPlay.pintar();
		bSoni.pintar();
		pPintar();
		
		ctx.strokeStyle="rgba(255,124,56,1)";
		
		pHelp(true);
	}//fin de isMenu en paint

	if(jugando){
		ctx.drawImage(iPiramide,cPira-64,alto-(alto/3),128,64);

		ctx.drawImage(iPiramide,4100-cam.x,terrains[1].pos.y - 256);
	   	ctx.fillStyle="rgba(255,124,255,1)";
		ctx.font="20Px Arial";
		//ctx.fillText("ed "+counter,100,alto/2);

		reloj.pintar(true);

		rPintar(48);

		pPintar();
		/*
		ctx.fillStyle="rgba(255,55,0,0.5)";
		ctx.beginPath();
		//ctx.fillRect(dataCol.x-cam.x,dataCol.y,dataCol.w,dataCol.h);
		ctx.fillText(dataCol.tl,dataCol.x-cam.x,dataCol.y);
		ctx.fill();
		ctx.closePath();
		/*
		ctx.textAlign="start"; 
		ctx.fillStyle="rgba(255,0,0,1.0)";
		ctx.fillText("break p "+dataBreaks.p,50,50);
		ctx.fillText("break w "+dataBreaks.w,50,90);
		ctx.fillText("break M "+dataBreaks.m,50,140);
		ctx.fillText("saltos "+tBreaks,50,180);
		*/
		
	}//finde jugando en el paiint

	if(pausado){


		ctx.drawImage(iPiramide,cPira-64,alto-(alto/3),128,64);

		ctx.drawImage(iPiramide,4100-cam.x,terrains[1].pos.y - 256);
		reloj.pintar(false);

		rPintar(48);
		pPintar();
		ctx.fillStyle="rgba(255,20,0,1.0)";
		ctx.font="40Px Bold";
		ctx.textAlign="center";
		ctx.fillText("Game Paused...",ancho/2,alto/5);

		bPlay.pintar();
		bReset.pintar();
		bSoni.pintar();
		
		pHelp(false);
	}//finde pausado en el paiint

	if(terminado){
		ctx.drawImage(iPiramide,cPira-64,alto-(alto/3),128,64);
	   ctx.drawImage(iPiramide,4100-cam.x,terrains[1].pos.y - 256);
		rPintar(48);
		pPintar();
		
		if(siMom){
			ctx.fillStyle="rgba(255,20,0,1.0)";
			ctx.font="40Px Bold";
			ctx.textAlign="center";
			ctx.fillText("Congrats, you WIN :)",ancho/2,alto/5);
			ctx.fillText("you ran "+tSp+" Steps",ancho/2,(alto/5)+50);
			//ctx.fillText("cx per"+dataCol.cx,50,140);
			bPlay.pintar();
			bSoni.pintar();
		}
	}//finde terminado en el paiint

	if(perdido){
		
		ctx.drawImage(iPiramide,4100-cam.x,terrains[1].pos.y - 256);
		//pPintar();
		ctx.drawImage(iPiramide,cPira-64,alto-(alto/3),128,64);
		rPintar(48);
		
		
		if(brdData.outSd){
			
			ctx.fillStyle="rgba(255,20,0,1.0)";
			ctx.font="40Px Bold";
			ctx.textAlign="center";
			ctx.fillText(cDead[rDead]+" . . .",ancho/2,alto/5);
			bPlay.pintar();
			bSoni.pintar();
			
		}
		for(p=1;p<=mParts;p+=1){if(parts[p].mode)parts[p].pintar();}
		pPintar();
	}//fin de perdido en paint
	
}//fin de paint

function enableInputs(){
	
	document.addEventListener('mousedown',function(evt){
		//evt.preventDefault();
		//console.log("eee");
		x=~~((evt.pageX-canvas.offsetLeft)*scaleX);
		y=~~((evt.pageY-canvas.offsetTop)*scaleY);
		touches[0]=new Vtouch(x,y);


	},false);

	document.addEventListener('mousemove',function(evt){
		if(touches[0]){
			touches[0].x=~~((evt.pageX-canvas.offsetLeft)*scaleX);
			touches[0].y=~~((evt.pageY-canvas.offsetTop)*scaleY);
		}
	},false);

	document.addEventListener('mouseup',function(evt){
		touches[0]=null;

	},false);

	document.addEventListener('keydown',function(evt){
		//evt.preventDefault();
		//console.log(evt.which);
		if(reloj.mode > 0 | !jugando)return;
		if(evt.which == 80)flow(1);
		//jump enevt
		if(evt.which == 32){
			//if(dataCol.cx < 300)return;
			if(dataCol.d)return;
			
			switch(dataCol.j) {
				case 0:
					dataCol.j=1;
					dataCol.u=true;
					dataCol.d=false;
					dataCol.vy=15;
					dataCol.m=1;
					dataP.tx=2;
					sDead(sJump,9,1000,0.25);

				break;
				case 1:
					if(!dataCol.d){
						gg.disconnect();
						sDead(sJump,6,400,0.50);
						dataCol.j=2;
						dataCol.u=true;
						dataCol.d=false;
						dataCol.vy+=10;
						dataCol.m=1;
						dataP.tx=2;

					}
					

				break;


			}
		}
		//init jet pack
		if(evt.which == 87 | evt.which == 38){
			if(dataCol.u | !jugando)return;
			if(dataJtPc.v < 1)return;//if not have energy in jetPAck
			
			dataCol.m=2;
			sJet();
			dataCol.j=1;
			dataCol.u=true;
			dataCol.d=false;
			dataCol.vy=18;
			sIn=true;
			dataP.tx=2;
			
			//console.log("de "+dataCol.m);
		}
	},false);
	
	document.addEventListener('keyup',function(evt){
		if(evt.which == 87 | evt.which == 38){
			dataCol.vy=5;
			dataCol.u=false;
			dataCol.d=true;
			stpJet();
			sIn=false;
		}
		
	});
	
	document.addEventListener("visibilitychange", winBlur, false);
}//fin de control

function Vtouch(x,y){
		this.x=x||0;
		this.y=y||0;
	}

function Button(x,y,width,height,text,size){
	this.x=x;
	this.y=y;
	this.rx=width/2;
	this.ry=height/2;

	this.width=width;
	this.height=height;
	this.text=text;
	this.size=size;
	//console.log("se creo el boton "+this.id+" de tipo "+this.tipo);
}


Button.prototype.touch=function(){

		if(this.tocado & this.id < 10)return false;

			if(touches[0]!=null){
				if(this.x<touches[0].x&&
					this.x+this.width>touches[0].x&&
					this.y<touches[0].y&&
					this.y+this.height>touches[0].y){
					//console.log("me tocaron soy el boton "+this.id);
					//activo=this.id;
					this.tocado=true;
					return true;
				}
			}

		return false;



}//fin del metodo touch

Button.prototype.pintar=function(){

	ctx.strokeStyle="rgba(20,0,0,1.0)";
	ctx.fillStyle="rgba(255,128,0,1.0)";
	ctx.beginPath();
	ctx.strokeRect(this.x,this.y,this.width,this.height);
	ctx.fillRect(this.x,this.y,this.width,this.height);
	ctx.fill();
	ctx.stroke();

	ctx.closePath();
	ctx.fillStyle="rgba(0,0,0,1.0)";
	ctx.font = this.size+'px Calibri';
	ctx.textAlign = 'center';

	ctx.fillText(this.text, this.x+this.rx, this.y+(~~(this.ry*1.5)));


}
