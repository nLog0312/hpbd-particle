const canvasText = document.getElementById('canvasText');
const ctxText = canvasText.getContext('2d');
let widthText = canvasText.width = window.innerWidth;
let heightText = canvasText.height = window.innerHeight;

const startBtn = document.getElementById('startBtn');
const countdownElem = document.getElementById('countdown');

const startHour = 0;
const startMinute = 0;

const words = ["3", "2", "1", "03-08-2002", "Chúc mừng sinh nhật", "Linh Đỗ", "Happy 23+", "Best things will come for u!"];
const holdTimes = [500, 500, 500, 2000, 3500, 3500, 2500, 2500];
const fadeTime = 1500;
const particleSize = 2;
const particleColor = "255,255,255";

let particles = [];
let currentWordIndex = 0;
let isForming = false;
let isFadingOut = false;
let isFinished = false;
let opacity = 0;
let sequenceStarted = false;

// Hàm lấy fontSize linh hoạt theo chiều rộng màn hình
const baseFontSize = 120;
const minFontSize = 40;
function getFontSize() {
    const w = window.innerWidth;
    if (w < 400) return minFontSize;
    if (w < 768) return Math.max(minFontSize, baseFontSize * w / 768);
    return baseFontSize;
}

  // Hàm vẽ chữ lên canvas tạm vừa đủ và lấy điểm particle
function getTextPoints(text, fontSize) {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.font = `${fontSize}px 'Roboto Slab', serif`;
    const textMetrics = tempCtx.measureText(text);

    const margin = fontSize;
    const textWidth = Math.ceil(textMetrics.width) + margin * 2;
    const textHeight = fontSize + margin * 2;

    tempCanvas.width = textWidth;
    tempCanvas.height = textHeight;

    tempCtx.font = `${fontSize}px 'Roboto Slab', serif`;
    tempCtx.textBaseline = "middle";
    tempCtx.textAlign = "left";
    tempCtx.fillStyle = "white";

    tempCtx.fillText(text, margin, textHeight / 2);

    const imageData = tempCtx.getImageData(0, 0, textWidth, textHeight);
    const points = [];

    const spacing = window.innerWidth < 768 ? 4 : 6;

    for (let y = 0; y < textHeight; y += spacing) {
        for (let x = 0; x < textWidth; x += spacing) {
        const i = (y * textWidth + x) * 4;
        if (imageData.data[i + 3] > 128) {
            points.push({ x, y });
        }
        }
    }
    return { points, width: textWidth, height: textHeight };
}

function getFontSizeForText(text) {
    const maxWidth = window.innerWidth * 0.9; // 90% chiều rộng màn hình
    let fontSize = baseFontSize;
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    while (fontSize > minFontSize) {
        tempCtx.font = `${fontSize}px 'Roboto Slab', serif`;
        const textWidth = tempCtx.measureText(text).width;
        if (textWidth <= maxWidth) break;
        fontSize -= 2;
    }
    return fontSize;
}

function prepareParticles(text) {
    const fontSize = getFontSizeForText(text);
    const { points, width, height } = getTextPoints(text, fontSize);

    const offsetX = (widthText - width) / 2;
    const offsetY = (heightText - height) / 2;

    particles = points.map((p, i) => {
        let old = particles[i] || {
        x: Math.random() * widthText,
        y: Math.random() * heightText,
        };
        return {
        ...old,
        destX: p.x + offsetX,
        destY: p.y + offsetY,
        opacity: 0,
        };
    });

    isForming = true;
    isFadingOut = false;
    opacity = 0;

    setTimeout(() => {
        isForming = false;
        opacity = 1;
        for (let p of particles) {
        p.x = p.destX;
        p.y = p.destY;
        p.opacity = 1;
        }
    }, 1500);
}

function animate() {
    ctxText.clearRect(0, 0, widthText, heightText);
    ctxText.fillStyle = "rgba(0,0,0,0.25)";
    ctxText.fillRect(0, 0, widthText, heightText);

    if (isForming) {
        opacity += 1 / (fadeTime / 16);
        if (opacity > 1) opacity = 1;
    }
    if (isFadingOut) {
        opacity -= 1 / (fadeTime / 16);
        if (opacity < 0) opacity = 0;
    }

    for (let p of particles) {
        if (isForming) {
            p.x += (p.destX - p.x) * 0.07;
            p.y += (p.destY - p.y) * 0.07;
            p.opacity += 1 / (fadeTime / 16);
            if (p.opacity > 1) p.opacity = 1;
        } else if (isFadingOut) {
            p.x += (Math.random() - 0.5) * 10;
            p.y += (Math.random() - 0.5) * 10;
            p.opacity -= 1 / (fadeTime / 16);
            if (p.opacity < 0) p.opacity = 0;
        } else {
            p.opacity = 1;
            p.x = p.destX;
            p.y = p.destY;
        }

        ctxText.fillStyle = `rgba(${particleColor},${p.opacity.toFixed(2)})`;
        ctxText.fillRect(p.x, p.y, particleSize, particleSize);
    }

    requestAnimationFrame(animate);
}

function startSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    function showNextWord(index) {
        if (index >= words.length) {
            isFinished = true;
            return;
        }

        prepareParticles(words[index]);
        // Đợi fadeTime cho hạt hình thành chữ
        setTimeout(() => {
            // Giữ chữ trong holdTimes[index]
            setTimeout(() => {
            if (index === words.length - 1) {
                // chữ cuối giữ nguyên, không fade out
                isFadingOut = false;
                isFinished = true;
                return;
            }
            isFadingOut = true;
            setTimeout(() => {
                isFadingOut = false;
                showNextWord(index + 1);
            }, fadeTime);
            }, holdTimes[index]);
        }, fadeTime);
    }

    showNextWord(0);
}

function checkTimeAndStart() {
    if (sequenceStarted) return;
    const now = new Date();
    if (now.getHours() === startHour && now.getMinutes() === startMinute) {
        countdownElem.style.display = "none";
        startBtn.style.display = "none";
        startSequence();
    } else {
        const target = new Date();
        target.setHours(startHour, startMinute, 0, 0);
        if (target < now) target.setDate(target.getDate() + 1);

        const diffMs = target - now;
        const diffMin = Math.floor(diffMs / 60000);
        const diffSec = Math.floor((diffMs % 60000) / 1000);
        countdownElem.style.display = "block";
        countdownElem.innerText = `Bắt đầu trong ${diffMin} phút ${diffSec} giây`;
    }
}

// Cập nhật canvas kích thước và làm mới chữ khi resize
window.addEventListener("resize", () => {
    widthText = canvasText.width = window.innerWidth;
    heightText = canvasText.height = window.innerHeight;
    if (!isFinished && sequenceStarted) prepareParticles(words[currentWordIndex]);
});

startBtn.onclick = () => {
    countdownElem.style.display = "none";
    startBtn.style.display = "none";
    startSequence();
    sequenceStarted = true;
};

setInterval(checkTimeAndStart, 1000);
animate();