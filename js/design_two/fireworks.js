// Simple fireworks animation
const canvas = document.querySelector('.fireworks');
const ctx = canvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;
window.addEventListener('resize', ()=>{
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
});
function randomColor() {
    const colors = ['#fdcb6e','#00b894','#fd79a8','#e17055','#0984e3','#fab1a0'];
    return colors[Math.floor(Math.random()*colors.length)];
}
function Firework() {
    this.x = Math.random()*W;
    this.y = H;
    this.radius = Math.random()*2+1;
    this.color = randomColor();
    this.speed = Math.random()*3+3;
    this.angle = Math.PI/2 + (Math.random()-0.5)*0.5;
    this.alpha = 1;
    this.exploded = false;
    this.particles = [];
}
Firework.prototype.update = function() {
    if(!this.exploded){
    this.x += Math.cos(this.angle)*this.speed;
    this.y -= Math.sin(this.angle)*this.speed;
    if(this.y < Math.random()*H/2+H/8){
        this.exploded = true;
        for(let i=0;i<40;i++){
        this.particles.push({
            x: this.x, y: this.y,
            angle: Math.random()*2*Math.PI,
            speed: Math.random()*3+1,
            radius: Math.random()*2+1,
            color: this.color,
            alpha: 1
        });
        }
    }
    }else{
    this.particles.forEach(p=>{
        p.x += Math.cos(p.angle)*p.speed;
        p.y += Math.sin(p.angle)*p.speed;
        p.alpha -= 0.018;
    });
    this.particles = this.particles.filter(p=>p.alpha>0);
    }
}
Firework.prototype.draw = function(ctx){
    if(!this.exploded){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
    }else{
    this.particles.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.radius,0,2*Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    });
    }
}
let fireworks = [];
function animate(){
    ctx.clearRect(0,0,W,H);
    if(Math.random()<0.04) fireworks.push(new Firework());
    fireworks.forEach(fw=>{fw.update();fw.draw(ctx);});
    fireworks = fireworks.filter(fw=>!fw.exploded || fw.particles.length>0);
    requestAnimationFrame(animate);
}
animate();