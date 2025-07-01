function checkOrientation() {
    const notice = document.getElementById('rotateNotice');
    const canvasText = document.getElementById('canvasText');
    const canvasFireworks = document.getElementById('c');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = window.innerWidth < 1000;
    
    if (isPortrait) {
        notice.style.display = 'flex';
        canvasText.style.display = 'none';
        canvasFireworks.style.display = 'none';
    } else {
        notice.style.display = 'none';
        canvasText.style.display = 'block';
        canvasFireworks.style.display = 'block';

        if (isMobile) {
            // Trên điện thoại xoay ngang => chỉ hiện nút fullscreen
            startBtn.style.display = 'none';
            fullscreenBtn.style.display = 'block';
        } else {
            // Trên PC hoặc máy tính bảng => dùng nút bắt đầu
            startBtn.style.display = 'block';
            fullscreenBtn.style.display = 'none';
        }
    }
    // cập nhật kích thước canvas text theo orientation mới
    resizeCanvasText();
}

function resizeCanvasText() {
    const canvasText = document.getElementById('canvasText');
    canvasText.width = window.innerWidth;
    canvasText.height = window.innerHeight;
    const canvasFireworks = document.getElementById('c');
    canvasFireworks.width = window.innerWidth;
    canvasFireworks.height = window.innerHeight;
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('load', () => {
    checkOrientation();
    resizeCanvasText();
});

function fullscreenChange() {
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const isFull = document.fullscreenElement;
    if (!isFull && isMobile && isPortrait) {
    // Nếu không còn fullscreen và đang ở màn hình điện thoại nằm ngang
    fullscreenBtn.style.display = "block";
    }
}

document.addEventListener("webkitfullscreenchange", fullscreenChange);
document.addEventListener("mozfullscreenchange", fullscreenChange);
document.addEventListener("msfullscreenchange", fullscreenChange);
document.addEventListener("fullscreenchange", fullscreenChange);

document.getElementById("fullscreenBtn").onclick = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
    el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
    }

    document.getElementById("fullscreenBtn").style.display = "none";
};