  (function( kinect ) {
    var cursor;
    
    //on dom load
    document.addEventListener('DOMContentLoaded', function() {
      //kinect setup
      kinect.setUp({
          //num of players
          players   : 1,
          //tracking mode
          relative  : true,       
          //tracking mode continued
          meters    : false,      
          //semsitivity
          sensitivity : 1.2,        
          //tracked nodes
          joints    : ['HAND_RIGHT', 'HEAD', 'HAND_LEFT', 'HANDS_DIST'],
          //tracked gestures
          gestures  : ['HANDS_DIST']
        })
        //keep the session between page loads (of the same domain)
        .sessionPersist()
        //kickstarting the modal
        .modal.make('css/knctModal.css')
        //kickstarting the notifications             
        .notif.make();    
        
      //CURSOR
      //constructing the cursor
      cursor = kinect.cursor.make() 
            //use a bit of smoothing  
            .useSmoothing(2)
            //use both hands (if available)
            .useBothHands(true)
            //z-axis percent, when should the kinectTouch events be dispatched
            .action('z-axis', 1)
            //kickstarting the cursor
            .activate();

      //REGISTERING THE FIRE BUTTONS
      var fire1 = document.getElementById('fire1');
      //separate smoothing/gravity for the tiles and binding the action
      cursor.addRegion(fire1, 4);

      // resgister touch start event
      //on kinectTouchStart add hover-class
      fire1.addEventListener('kinectTouchStart', function(e) {
        createFirework(37,78,null,null,5,100,null,null,true,true);
      }, false);
            

      var fire2 = document.getElementById('fire2');
      //separate smoothing/gravity for the tiles and binding the action
      cursor.addRegion(fire2, 4);

      // resgister touch start event
      //on kinectTouchStart add hover-class
      fire2.addEventListener('kinectTouchStart', function(e) {
        createFirework(57,58,null,null,45,100,null,null,true,true);
      }, false);

      var fire3 = document.getElementById('fire3');
      //separate smoothing/gravity for the tiles and binding the action
      cursor.addRegion(fire3, 4);

      // resgister touch start event
      //on kinectTouchStart add hover-class
      fire3.addEventListener('kinectTouchStart', function(e) {
        createFirework(24,38,null,null,85,100,null,null,true,true);
      }, false);      

    }, false);
    
    //adding notifications on connection status
    kinect.addEventListener('openedSocket', function() {
      this.notif.push("CONNECTED");
      console.log('Connected');
      this.scanForHead();
    });
    
    kinect.addEventListener('closedSocket', function() { 
      this.notif.push("DISCONNECTED");
      console.log('Disconnected');
    });
    
    //adding notifications on player detection/loss
    kinect.addEventListener('playerFound', function( count ) {
      console.log('Player found: ' + count[0]);
    });
    
    kinect.addEventListener('playerLost', function( count ) {
      console.log('Player lost: ' + count[0]);
    });
    
  })( kinect );