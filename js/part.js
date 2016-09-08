function part(){
	this.center={x:0,y:0};
	
	this.r=255;
	this.g=255;
	this.b=255;
	this.alp=1.0;
	
	this.rads=1.0;
	this.rd=0.04;
	this.v=3;
	this.mode=false;
	//console.log("soy");
}
part.prototype.update=function(){
	//Nuevo metodo
	this.center.x+=(Math.cos(this.rads)*this.v);
	this.center.y+=(Math.sin(this.rads)*this.v);
	//return;
	if(this.alp > this.rd){
		this.alp-=this.rd;
		
		if(this.r < 255)this.r+=1;
		if(this.g < 230)this.g+=20;
		//if(this.b < 255)this.b+=1;
	}else{
		//console.log("mori");
		this.mode=false;
	}
	
}
part.prototype.pintar=function(){
	//Nuevo metodo
	//console.log("es");
	ctx.fillStyle="rgba("+this.r+","+this.g+","+this.b+","+this.alp+")";
	ctx.beginPath();
	ctx.fillRect(this.center.x-cam.x,this.center.y,2,2);
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle="rgba(255,255,255,1.0)";
	
}