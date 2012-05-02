var socket = io.connect(String(window.location).replace('8003', '8013'));

function init() {
    var canvas = document.getElementById('output');
    var ctx = canvas.getContext('2d');
    var videoStream = document.getElementById('sourcevid'); 

    var successCallback = function (srm) { 
        videoStream.src = srm; 
    };
    var errorCallback = function (error) {
        console.log('error: ' + error.msg);
    };

    // grab the incoming device data
    navigator.getUserMedia('video', successCallback, errorCallback); 

    // send the video data every 250ms
    setInterval(function () { 
        send(videoStream, canvas, ctx, 170, 120); 
    }, 500); 
} 

function send(stream, canvasElement, ctx, w, h) {
    ctx.drawImage(stream, 0, 0, w, h); 
    var picture = canvasElement.toDataURL('image/png');
    socket.emit('vs-stream', { 
        video: picture,
        height: h,
        widht: w
    }); 
}

window.onload = init;