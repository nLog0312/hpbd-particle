const colors = ['#f7b731','#fd79a8','#00b894','#00cec9','#e17055','#0984e3'];
for(let i=0;i<12;i++){
    let balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random()*95+'vw';
    balloon.style.width = balloon.style.height = (Math.random()*30+40)+'px';
    balloon.style.background = colors[Math.floor(Math.random()*colors.length)];
    balloon.style.borderRadius = '50% 50% 48% 52%/54% 50% 50% 46%';
    balloon.style.opacity = 0.8;
    balloon.style.animationDelay = (Math.random()*8)+'s';
    document.body.appendChild(balloon);
}