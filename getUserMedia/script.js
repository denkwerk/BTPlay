
var isNegative = false;

function init() {
    var canvas = document.getElementById('output');
    var ctx = canvas.getContext('2d');
    var videoStream = document.getElementById('sourcevid'); 

    // video stream callbacks
    var successCallback = function (srm) { 
        videoStream.src = srm; 
    };
    var errorCallback = function (error) {
        console.log('error: ' + error.msg);
    };

    // button event handler
    document.getElementById('toggleMe').addEventListener('click', turnAround, false); 

    // set the canvas dimensions
    canvas.width = 620;
    canvas.height = 480;

    // grab the incoming device data
    navigator.getUserMedia('video', successCallback, errorCallback); 

    // call draw
    draw(videoStream, ctx, canvas.width, canvas.height);
} 

// (re)draw the canvas picture every 20 ms
function draw(v,c,w,h) {
    c.drawImage(v,0,0,w,h);

    if (isNegative === true) {
        makeNegative(c,w,h);
    }
    setTimeout(draw,20,v,c,w,h);
}

// turn the colours upside down
function makeNegative (c,w,h) {
    var imageData = c.getImageData(0, 0, w, h);
    var data = imageData.data;
 
    for (var i = 0, n = data.length; i < n; i += 4) {
        data[i] = 255 - data[i]; 
        data[i + 1] = 255 - data[i + 1]; 
        data[i + 2] = 255 - data[i + 2]; 
    }

    c.putImageData(imageData, 0, 0);
}

// bizarro world background image
function changeBackgroundImage (negative) {
    if (negative === true) {
        var bgcanvas = document.getElementById('bg-canvas')
        var bgctx = bgcanvas.getContext('2d');  
        var img = new Image();  
        img.src = 'img/cologne-back.png';
        img.onload = function(){  
            bgctx.drawImage(img, 0, 0, 1100, 900);
            makeNegative(bgctx, 900, 900); 
            document.getElementsByTagName('body')[0].setAttribute('style', 'background-image: url(' + bgcanvas.toDataURL('image/png') + ');');
        };
    } else {
        document.getElementsByTagName('body')[0].setAttribute('style', '');
    }
}

// toggle the button and set the bizarro flag
function turnAround (event) {
    var button = event.currentTarget;
    isNegative = !isNegative;
    if (isNegative === true) {
        button.innerHTML = 'Ehm! Back to normal please';
    } else {
        button.innerHTML = 'On the road to Bizarro World';
    }

    changeBackgroundImage(isNegative);    
    return false;
} 

// kickoff shit
document.addEventListener("DOMContentLoaded", init, false);