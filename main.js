const canvas = document.getElementById("myCanvas");

canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2,canvas.width * 0.9);
// const car = new Car(100,100,30,50); // (x,y,width,height)
const car = new Car(road.getLaneCenter(1),100,30,50, "KEYS"); // dynamically getting the x coord of the car according to the laneCenter function, laneIndex is passed
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
]

animate();

function animate() {
    for(let i=0; i < traffic.length;i++){
        traffic[i].update(road.borders,[]); // empty array as traffic because we don't want the traffic to get damaged on collision
    }
    car.update(road.borders,traffic);
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7);
    road.draw(ctx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(ctx,"red"); // traffic cars
    }
    car.draw(ctx,"blue"); // our car

    ctx.restore();
    requestAnimationFrame(animate); // this calls the animate method again and again many times per second giving the illusion of movement
}
