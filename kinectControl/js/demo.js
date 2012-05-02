			kinect
				.sessionPersist()
				.modal.make( 'css/knctModal.css' )
				.notif.make();
			
			var rgb_img = document.getElementById('RGBstream'),
				depth_img = document.getElementById('DEPTHstream');
				
			var rgb_status = document.getElementById('rgbstatus'),
				depth_status = document.getElementById('depthtatus');
			
			var rgbSocket,
				depthSocket;
				
			kinect.addEventListener('openedSocket', function() {
				rgbSocket = kinect.makeRGB( null, true );	//use webworker for the RGB stream (just for this demonstration)
				
				rgbSocket.onerror = function( e ) {
					rgb_status.innerHTML = "OFF";
				};
			
				rgbSocket.onmessage = function( e ) {
					if( e.data === 'OPEN' )
					{
						rgb_status.innerHTML = "ON";
						return false;
					}
					
					rgb_img.src = null;
					rgb_img.src = e.data;
					return false;
				};
			}, false);
			
			document.getElementById('activateRGB').addEventListener('click', function( e ) {
				e.preventDefault();
				if( rgbSocket )
				{
					rgbSocket.postMessage("KILL");
					setTimeout(function(){
						rgbSocket = null;
						rgb_status.innerHTML = "OFF";
					},300);
					return false;
				}

				rgbSocket = kinect.makeRGB();	//using webworker
				
				rgbSocket.onerror = function() {
					rgb_status.innerHTML = "OFF";
					rgbSocket.onerror = null;
					return false;
				};

				rgbSocket.onmessage = function( e ) {
					if( e.data == 'OPEN' )
					{
						rgb_status.innerHTML = "ON";
						return false;
					}
						
					rgb_img.src = null;
					rgb_img.src = e.data;
					return false;
				};

			}, false);
			
			
			document.getElementById('activateDEPTH').addEventListener('click', function( e ) {
				e.preventDefault();
				if( depthSocket )
				{
					depthSocket.send( "KILL" );
					setTimeout(function() {
						depthSocket.close();
						depthSocket.onopen = depthSocket.onmessage = depthSocket = null;
					}, 300 );
					return false;
				}
				depthSocket = kinect.makeDepth();	//websocket
			
				depthSocket.onopen = function() {
					depth_status.innerHTML = "ON";
				};
				
				depthSocket.onclose = depthSocket.onerror = function() {
					depth_status.innerHTML = "OFF";
					depthSocket.onclose = depthSocket.onerror = null;
					return false;
				};
			
				depthSocket.onmessage = function( e ) {
					depth_img.src = null;
					depth_img.src = e.data;
					return false;
				};
			}, false);
			
			
			
			//motor commands
			kinect.addEventListener( 'motorAngleUpdated', function( deg ) {
				alert( "Angle is : " + deg[ 0 ] );
			});
			
			document.getElementById('getAngle').addEventListener('click', function( e ) {
				e.preventDefault();
				
				kinect.motor.getCurrentAngle();
			}, false);
			
			document.getElementById('setAngle').addEventListener('click', function( e ) {
				e.preventDefault();
				
				kinect.motor.setCurrentAngle( document.getElementById('deg').value );
			}, false);
			
			document.getElementById('resetAngle').addEventListener('click', function( e ) {
				e.preventDefault();
				
				kinect.motor.defaultAngle();
			}, false);
			