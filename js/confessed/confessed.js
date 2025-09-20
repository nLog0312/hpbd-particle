document.addEventListener('DOMContentLoaded', () => {
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 900;

    if (isMobileUA || isSmallScreen) {
        window.location.href = "/confessed/error.html";
    }
});

const ASSETS = {
    head: '../assets/confessed/head.svg',
    waiting: '../assets/confessed/hand.svg',
    stalking: '../assets/confessed/hand-waiting.svg',
    grabbing: '../assets/confessed/hand.svg',
    grabbed: '../assets/confessed/hand-with-cursor.svg',
    shaka: '../assets/confessed/hand-surfs-up.svg'
};

// preload
Object.values(ASSETS).forEach(src => {
    const img = new Image();
    img.src = src;
});

let debug = false;
let cursorGrabbed = false;
let gameOver = false;
let extended = false;
let state = 'waiting';

const trapBtn = document.getElementById('trapButton');
const trapBtnYes = document.getElementById('trapButtonYes');
const gifEmojiItem = document.getElementById('emoji-item');
const outerZone = document.getElementById('outerZone');
const innerZone = document.getElementById('innerZone');
const handImage = document.getElementById('handImage');
const grabber = document.getElementById('grabber');
const armWrapper = document.getElementById('armWrapper');
const app = document.getElementById('app');

let outerHovered = false;
let innerHovered = false;
let mouseX = 0, mouseY = 0;

trapBtn.onclick = () => {
    gameOver = true;
    updateState();
    updateUI();
    setTimeout(() => {
        gameOver = false;
        updateState();
        updateUI();
    }, 4000);
};

trapBtnYes.onclick = () => {
    window.location.href = "/confessed/accept.html";
}

trapBtnYes.addEventListener('mouseover', () => {
    gifEmojiItem.src = '../assets/confessed/Gau GIF.gif'
});

trapBtnYes.addEventListener('mouseleave', () => {
    gifEmojiItem.src = '../assets/confessed/Bear Thank You GIF.gif'
});

handImage.onmouseenter = () => {
    gifEmojiItem.src = '../assets/confessed/nlog.gif'
    cursorGrabbed = true;
    updateState();
    updateUI();
    app.style.cursor = 'none';
    setTimeout(() => {
        cursorGrabbed = false;
        gifEmojiItem.src = '../assets/confessed/Bear Thank You GIF.gif'
        app.style.cursor = 'auto';
        updateState();
        updateUI();
    }, 2000);
};

outerZone.onmouseenter = () => {
    outerHovered = true;
    updateState();
    updateUI();
};
outerZone.onmouseleave = () => {
    outerHovered = false;
    updateState();
    updateUI();
};
innerZone.onmouseenter = () => {
    innerHovered = true;
    updateState();
    updateUI();
};
innerZone.onmouseleave = () => {
    innerHovered = false;
    updateState();
    updateUI();
};

function updateState() {
    if (gameOver) {
        state = 'shaka';
    } else if (cursorGrabbed) {
        state = 'grabbed';
    } else if (innerHovered) {
        state = 'grabbing';
    } else if (outerHovered) {
        state = 'stalking';
    } else {
        state = 'waiting';
    }

    // Handle extended logic
    if (state === 'grabbing') {
        clearTimeout(extendedTimer);
        extendedTimer = setTimeout(() => {
            if (state === 'grabbing') {
                extended = true;
                updateUI();
            }
        }, 2500);
    } else {
        extended = false;
    }
}

function updateUI() {
    handImage.src = ASSETS[state];
    let btnText;
    if (gameOver) {
        btnText = 'Oh no!';
    } else if (cursorGrabbed) {
        btnText = 'Đừng =,))))';
    } else {
        btnText = 'Không!';
    }
    trapBtn.textContent = btnText;
    grabber.className = `grabber grabber--${state} ${extended ? 'grabber--extended' : ''}`;
}

let extendedTimer;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    const rect = armWrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = mouseX - cx;
    let dy = mouseY - cy;
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    angle = Math.max(-79, Math.min(79, angle));
    armWrapper.style.transform = `rotate(${angle}deg)`;

    requestAnimationFrame(animate);
}

updateUI();
animate();