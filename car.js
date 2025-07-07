class Car {
  // for car to know where it is (x,y) and how big it is (width,height)
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged=false;

    this.sensor = new Sensor(this);

    this.controls = new Controls(); // for controlling the car
  }
  update(roadBorders) {
    // move car only if not damaged
    if(!this.damaged){
      this.#move();
      this.polygon=this.#createPolygon();
      this.damaged=this.#assessDamage(roadBorders);
    }

    this.sensor.update(roadBorders); // sensor work even after damage
  }

  #assessDamage(roadBorders){
    for(let i=0; i < roadBorders.length;i++){
      if(polysIntersect(this.polygon,roadBorders[i])){
          return true;
      }
    }
    return false;
  }



  #createPolygon(){
    const points = [];
    const rad = Math.hypot(this.width,this.height)/2;
    const alpha = Math.atan2(this.width,this.height);
    points.push({
      x:this.x-Math.sin(this.angle-alpha)*rad,
      y:this.y-Math.cos(this.angle-alpha)*rad
    });
    points.push({
      x:this.x-Math.sin(this.angle+alpha)*rad,
      y:this.y-Math.cos(this.angle+alpha)*rad
    });
    points.push({
      x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
      y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
    });
    points.push({
      x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
      y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
    });

    return points;
  }


  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      // for forward
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      // for reverse
      this.speed = -this.maxSpeed / 2; // run half of the forward maxSpeed in reverse
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction; // todo : why?
    } // this makes the car move by very small margin even if the key is not being pressed this this if block below is written to solve this:
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(ctx) {
    if(this.damaged){
      ctx.fillStyle="gray";
    }else{
      ctx.fillStyle="black";
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for(let i = 0; i < this.polygon.length;i++){
      ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
    }
    ctx.fill();
    this.sensor.draw(ctx);
  }
}
