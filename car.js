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

    this.sensor = new Sensor(this);
    // console.log(`Car here : `,this);
    // console.log(`sensor here : `,this.sensor)
    // console.log(`sensor here update : `,this.sensor.update)
    this.controls = new Controls(); // for controlling the car
  }
  update() {
    this.#move();
    this.sensor.update();
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
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    // .rect basically tell where the center of the rectangle is ~ at the intersection of width/2 and height/2
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
    this.sensor.draw(ctx);
  }
}
