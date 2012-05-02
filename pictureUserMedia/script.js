var socket = io.connect(String(window.location).replace('8002', '8012'));

function init() {
    var canvas = document.getElementById('output');
    var ctx = canvas.getContext('2d');
    var videoStream = document.getElementById('sourcevid');
    var button = document.getElementById('pictureMe');

    var successCallback = function (srm) { 
        videoStream.src = srm; 
    };
    var errorCallback = function (error) {
        console.log('error: ' + error.msg);
    };

    // grab the incoming device data
    navigator.getUserMedia('video', successCallback, errorCallback); 

    // send the picture data
    var sendPicture = function () {
        send(videoStream, canvas, ctx, $(videoStream).width(), $(videoStream).height()); 
    };

    // send picture on click
    button.addEventListener('click', sendPicture, false);

} 

function send(stream, canvasElement, ctx, w, h) {
    canvasElement.height = h;
    canvasElement.width = w;
    ctx.drawImage(stream, 0, 0);
    setTimeout(function () {
        var picture = canvasElement.toDataURL('image/png');
        socket.emit('picture', { 
            picture: picture,
            height: h,
            widht: w
        });
    }, 500);
}

window.onload = init;