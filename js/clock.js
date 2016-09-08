function Clock(){
	this.center={x:ancho/2,y:100};
	this.pos={x:ancho/2,y:100};

	this.aGrads=270;
	this.aRads=0;
	this.radio=ancho/10;
	this.radios=ancho/12;

	this.ancho=this.radio*2;

	this.brokens=0;//bugs, maximun 4, minimun 3
	this.destSec=0;
	this.actSec=0;
	this.mode=0;//0:normal, 1 : forward, 2: back
	this.frame=0;//maximun:3600	
	//console.log("des suf");
}
Clock.prototype.update = function(playing) {
	// body...
	//if playing=true : 
	//create glitches that afeted 	 the world


	this.aGrads=(this.actSec*6);

	//if(this.aGrads > 359){this.aGrads=0;}

	this.aRads=((this.aGrads-90) * Math.PI)/180;

	this.pos.x = (this.center.x)+(Math.cos(this.aRads) * this.radios);
	this.pos.y = (this.center.y)+(Math.sin(this.aRads) * this.radios);
	
};

Clock.prototype.pintar = function(show) {
	// body...
	ctx2.clearRect(0,0,ancho,alto);
	if(!show)return;
	ctx2.fillStyle="rgba(98,110,150,1.0)";
	ctx2.strokeStyle="rgba(0,0,0,1.0)";
	ctx2.lineWidth=5;
	
	//background of clock
	//
	//ctx2.arc(this.center.x,this.center.y,this.radio,0,2*PI,true);
	//
	/*
	ctx2.beginPath();
	ctx2.arc(this.center.x,this.center.y,this.radio,0,2*Math.PI,true);
	ctx2.stroke();
	ctx2.fill();
	ctx2.stroke();
	ctx2.closePath();
	ctx2.lineWidth=1;
	ctx2.globalAlpha=0.5;
	*/
	ctx2.drawImage(iReloj,this.center.x-this.radio,this.center.y-this.radio,this.radio*2,this.radio*2);
	ctx2.globalAlpha=1.0;
	//segundero linea
	ctx2.strokeStyle="rgba(255,128,0,1.0)";
	ctx2.fillStyle="rgba(255,128,0,1.0)";
	ctx2.lineWidth=5;
	ctx2.beginPath();
	ctx2.moveTo(this.center.x,this.center.y);
	ctx2.lineTo(this.pos.x,this.pos.y);
	ctx2.stroke();
	ctx2.closePath();


	//base del segundero
	ctx2.beginPath();
	
	ctx2.arc(this.center.x,this.center.y,10,0,2*Math.PI,true);
	ctx2.fill();
	ctx2.closePath();
	
	ctx2.fillStyle="rgba(0,0,0,1.0)";
	ctx2.strokeStyle="rgba(0,0,0,1.0)";
	/*
	//12
	ctx2.beginPath();
	ctx2.fillRect((this.center.x-6),(this.center.y-this.radio),6,6);
	ctx2.fill();
	ctx2.closePath();

	//06
	ctx2.beginPath();
	ctx2.fillRect((this.center.x-3),(this.center.y+this.radio)-6,6,6);
	ctx2.fill();
	ctx2.closePath();

	//03
	ctx2.beginPath();
	ctx2.fillRect((this.center.x+this.radio)-6,(this.center.y),6,6);
	ctx2.fill();
	ctx2.closePath();

	//09
	ctx2.beginPath();
	ctx2.fillRect((this.center.x-this.radio),(this.center.y),6,6);
	ctx2.fill();
	ctx2.closePath();*/
	
	if(jugando & !perdido & !terminado){
		ctx2.fillStyle="rgba(0,46,179,1.0)";
		ctx2.strokeStyle="rgba(0,0,0,1.0)";
		ctx2.lineWidth=1;
		
		ctx2.beginPath();
		ctx2.fillRect(36,21,dataJtPc.w,10);
		ctx2.strokeRect(34,19,dataJtPc.rect+4,14);
		ctx2.fill();
		ctx2.stroke();
		
		ctx2.closePath();
		ctx2.fillStyle="rgba(255,46,0,1.0)";
		ctx2.font="10px Bold";
		ctx2.textAlign="center";
		ctx2.fillText("j e t  p a c k  e n e r g y ",36+100,29);
	}
};