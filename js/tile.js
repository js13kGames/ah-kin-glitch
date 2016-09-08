
function terrain(tipe,cx,cy,index){

	this.tipe=tipe;//1: have 3 tiles, 2: have 4 tiles, 3: have 5 tiles;
	
	this.center={x:0,y:0};
	this.origin={x:0,y:0};
	
	this.pos={x:0,y:0};
	this.fin={x:0,y:0};
	
	this.w=0;
	this.h=256;
	this.rx=0;
	this.ry=128;
	
	this.index=index;
	
	this.i=0;
	this.j=0;
	this.k=0;

	this.tipeDamage=0;//0:normal, 1: up movement, 2: down movement, 3: disappear quicly;
	this.tDam=0;//frame to start damage movement
	this.maxDam=random(50,120);//how much up the platform
	this.isDam=false;//set is damage/action is shower
	this.upMove=0;
	this.cPir=dataWorld.w+1;
	//this.image=new Image();
	//this.image.src=iBase.src;
}

terrain.prototype.reset=function(){
	
	this.w=(this.tipe + 2)*24;
	
	this.rx=this.w/2;
	this.ry=128;
	pIndex=pIndex + this.w;
	this.center.x=pIndex-this.rx;
	this.center.y=alto+64;
	
	this.origin.x=pIndex-this.rx;
	this.origin.y=alto+64;
	//console.log(" soy "+this.index+" mido x "+this.w+" xpos "+(pIndex-this.w));
	this.tDam=this.center.x;
	
	if(this.index < 21){
		if(random(1,10)==1){
			this.tipeDamage=2;
		}else{
			this.tipeDamage=random(0,1);
		}
	}else if(this.index > 20 & this.index < 31){
		if(random(1,10) < 3){
			this.tipeDamage=2;
		}else{
			this.tipeDamage=random(0,1);
		}
	}else if(this.index > 30){
		
		if(random(1,4) == 1){
			this.tipeDamage=3;
		}else{
			this.tipeDamage=random(1,2);

		}
		
	}
}

terrain.prototype.update = function(os) {
	// body...
	//
	if(os){
		//this.center.x=this.origin.x - frame;
		
		
			if(dataCol.cx+300 >= this.tDam){
				switch(this.tipeDamage) {
					case 1:
						if(dataCol.cx+300 >= this.tDam & dataCol.cx+300 < this.tDam+(this.maxDam)){
							this.center.y = this.origin.y - ((dataCol.cx+300)-this.tDam );
						
						}
						if(dataCol.cx+300 >= this.tDam+(this.maxDam)){
							this.center.y = this.origin.y - this.maxDam;
						}
					break;
					case 2:
						
						if(dataCol.cx+300 >= this.tDam & dataCol.cx+300 < this.tDam+(100)){
							this.center.y = this.origin.y + ((dataCol.cx+300)-this.tDam );
						
						}
						
					break;
					case 3:
						
						if(dataCol.cx+100 >= this.tDam & dataCol.cx+100 < this.tDam+(100)){
							this.center.y = this.origin.y + ((dataCol.cx+100)+this.tDam );
						
						}
						
					break;
				}
				//start damage
				this.isDam=true;

				


			}else{
				
				this.isDam=false;
				this.center.y=this.origin.y;
				
			}
		
		if(this.index == 46){
			if(this.center.x < dataCol.cx){
				console.log("termino");
				dataBreaks.p=0;
				dataBreaks.r=false;
				flow(2);
			}
		}
	
		if(this.index == 42){
			if(this.center.x < dataCol.cx){
				this.cPir-=1;
			}else{
				this.cPir=dataWorld.w+1;
			}
		}
		
	}
	
	
	this.pos.x=this.center.x - this.rx;
	this.pos.y=this.center.y - this.ry;
	
	this.fin.x=this.pos.x+this.w;
	this.fin.y=this.pos.y+this.h;
};

terrain.prototype.pintar = function() {
	/*
	ctx.fillStyle="rgb(135,41,0)";
	ctx.beginPath();
	ctx.fillRect(this.pos.x-cam.x,this.pos.y,this.w,this.h);
	ctx.fill();
	ctx.closePath();
	ctx.fillStyle="rgb(8,174,0)";
	ctx.beginPath();
	ctx.fillRect(this.pos.x-cam.x,this.pos.y,this.w,16);
	ctx.fill();
	ctx.closePath();
	*/
	ctx.drawImage(iBase,0,0,this.w,this.h,this.pos.x-cam.x,this.pos.y,this.w,this.h);
	
	//ctx.fillStyle="rgb(255,40,12)";
	//ctx.fillText(this.index+", td "+this.tipeDamage,this.pos.x-cam.x,this.pos.y);
	//ctx.fillText(this.tipeDamage,this.center.x-cam.x,this.center.y);
};

terrain.prototype.pintar2 = function() {
	//ground
	//ctx.drawImage(iBase,0,0,this.w,this.h,this.pos.x,this.pos.y,this.w,this.h);
	
	ctx.fillStyle="rgba("+random(1,10)+","+random(1,10)+","+random(1,10)+",1.0)";
	ctx.beginPath();
	ctx.fillRect(this.pos.x-cam.x,this.pos.y,this.w,this.h);
	ctx.fill();
	ctx.closePath();
	//ctx.textAlign = "center";
	/*
	ctx.fillStyle="rgb(255,40,12)";
	ctx.fillText(this.index,this.pos.x-cam.x,this.pos.y);*/
	//ctx.fillText(frame-this.tDam,this.pos.x,this.pos.y+20);
	//ctx.fillText(dataP.cx,50,140);
	//grass
};

