var socket = io.connect(String(window.location));
document.addEventListener("impress:init", function (event) {
    var api = event.detail.api;

	socket.on('prev', function () {
		api.prev();
	});

	socket.on('next', function () {
		api.next();
	});

	socket.on('playCoin', function () {
		playSound('sounds/smb_coin.wav');
	});

	socket.on('playGameover', function () {
		playSound('sounds/smb_gameover.wav');
	});	

	socket.on('playFlag', function () {
		playSound('sounds/smb_flagpole.wav');
	});

	socket.on('playJump', function () {
		playSound('sounds/smb_jumpsmall.wav');
	});	

	socket.on('playPipe', function () {
		playSound('sounds/smb_pipe.wav');
	});	

	socket.on('playBowser', function () {
		playSound('sounds/smb_bowserfall.wav');
	});	

	socket.on('playDie', function () {
		playSound('sounds/smb_mariodie.wav');
	});	

	socket.on('playTime', function () {
		playSound('sounds/smb_warning.wav');
	});	

});

function playSound(sound){
	document.getElementById('sound_element').innerHTML = '<embed src="' + sound + '" hidden="true" autostart="true" loop="false">';
}