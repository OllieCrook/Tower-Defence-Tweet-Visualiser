$(document).ready(function() {
    var c = $("#mainCanvas");
    var ctx = c.get(0).getContext("2d");

    // Reference: Book name - Foundation HTML Canvas for games and entertainment by Rob Hawkes
    // p84-85
    // Dynamic dimension feature
    $(window).resize(resizeCanvas);
    function resizeCanvas () {
      c.attr("height", $('.canvas-container').height());
      c.attr("width", $('.canvas-container').width());
    }
    resizeCanvas();

    // JSON Objects ------------------------------------------------------------
    var scene = {
        "height": c.height(),
        "originNum": 826,
        "width": c.width(),
        "reset": {
          "hard": false,
          "hardCountdown": {
            "current": 420, // Divide by 60 to get number of seconds
            "original": 420
          },
          "soft": false,
          "softCountdown": {
            "current": 60, // Divide by 60 to get number of seconds
            "original": 60
          }
        }
    };

    scene.scaleFactor = scene.height / scene.originNum; // This is declared outside of the original scene initialisation because it uses keys that aren't acessible before this time
    // Objects making use of this scale factor were decided as having an appropriate height in a window 826px high, hence scene.originNum = 826

    var boulder = {
        // All boulder properties are given here to prevent having to look elsewhere in the code if any changes are required
        // JSON objects found here: https://www.w3schools.com/js/js_json_objects.asp
        "animate": false,
        "currentFrame": 0,
        "frameHeight": 59,
        "frameWidth": 67,
        "image": new Image(),
        "landingPos": scene.height / Math.pow(scene.width, 2), // Refers to the x-coordinate at which the boulder lands
        "landingPosCalculated": false,
        "radius": 10,
        "shift": 0,
        "totalFrames": 6,
        "velocity": 10,
        "xOffset": -200,
        "xOrigin": 100,
        "xPos": 100,
        "yOffset": scene.height * 0.15,
        "yOrigin": 0,
        "yPos": 0
    };

    var horde = {
        // horde properties assigned in a JSON object for ease of access.
        // https://www.w3schools.com/js/js_json_objects.asp
        "currentFrame": 0,
        "frameHeight": 94,
        "frameWidth": 32.3,
        "hordeSize": 50,
        "image": new Image(),
        "shift": 0,
        "speed": 1, // Speed^-1 gives the actual speed. e.g speed: 5 = 1/5 updates per execution of the code
        "startPos": scene.width,
        "moveTimer": 0,
        "totalFrames": 9,
        "xOrigin": scene.width + 5,
        "xPos": scene.width + 5,
        "yPos": scene.height * 0.85
    };

    var explosion = {
        // explosion properties assigned in a JSON object for ease of access.
        // https://www.w3schools.com/js/js_json_objects.asp
        "currentFrame": 0,
        "frameHeight": 96,
        "frameWidth": 156,
        "image": new Image(),
        "refresh": 3,
        "shift": 0,
        "timer": 0,
        "totalFrames": 9
    };

    var tower = {
        "height": scene.height * 0.9,
        "image": new Image(),
        "left": 0,
        "top": scene.height * 0.1,
        "width": scene.width * 0.225
    };

    // Images ------------------------------------------------------------------
    boulder.image.src = 'images/fireballv2.png'; //https://opengameart.org
    horde.image.src = 'images/both.png';
    explosion.image.src = 'images/flames.png'; //https://opengameart.org
    tower.image.src = 'images/tower.png'; // http://gaurav.munjal.us/Universal-LPC-Spritesheet-Character-Generator/


    $('#mainCanvas').click(function() {
        boulder.animate = true;
    });

    function resetBoulder() {
        boulder.animate = false;
        boulder.landingPosCalculated = false;

        boulder.xPos = boulder.xOrigin;
        boulder.yPos = boulder.yOrigin;
    }

    // Draw boulder ------------------------------------------------------------
    function drawCircle() {
        ctx.drawImage(boulder.image, boulder.shift, 0, boulder.frameWidth, boulder.frameHeight, boulder.xPos, boulder.yPos, boulder.frameWidth * scene.scaleFactor, boulder.frameHeight * scene.scaleFactor);
        // Shifts through sprite sheet (animates)
        boulder.shift += boulder.frameWidth + 1;

        // Resets spritesheet. Loops through
        if (boulder.currentFrame == boulder.totalFrames) {
            boulder.currentFrame = 0;
            boulder.shift = 0;
        }
        // Loops through each frame. frame properties stated in boulder Object
        boulder.currentFrame++;
    }

    // Animate the scene -------------------------------------------------------
    horde.moveTimer = horde.speed;
    explosion.timer = explosion.refresh;

    var fileSize = 1;
    var previousFileSize = 1;
    var triggerCountdown = 30;

    var file = 0;

    function animate() {
        ctx.clearRect(0, 0, scene.width, scene.height); // Clears the canvas from the previous frame

        if (scene.reset.hard === false && scene.reset.soft === false) {
          horde.moveTimer --;
          if (horde.moveTimer === 0) { // This controls the speed of the horde by only running every 5th time the animate function runs
              horde.moveTimer = horde.speed;

              horde.xPos--;
              horde.shift += horde.frameWidth + 1; // Shifts through sprite sheet (animates)

              // Resets spritesheet. Loops through
              if (horde.currentFrame == horde.totalFrames) {
                  horde.currentFrame = 0;
                  horde.shift = 0;
              }
              // Loops through each frame. frame properties stated in horde Object
              horde.currentFrame++;
          }

          // Draw Horde ----------------------------------------------------------
          ctx.drawImage(horde.image, horde.shift, 0, horde.frameWidth, horde.frameHeight, horde.xPos, horde.yPos, horde.frameWidth * scene.scaleFactor, horde.frameHeight * scene.scaleFactor);
          ctx.drawImage(horde.image, horde.shift, 0, horde.frameWidth, horde.frameHeight, horde.xPos + scene.width * 0.05, horde.yPos, horde.frameWidth * scene.scaleFactor, horde.frameHeight * scene.scaleFactor);
          ctx.drawImage(horde.image, horde.shift, 0, horde.frameWidth, horde.frameHeight, horde.xPos + scene.width * 0.1, horde.yPos, horde.frameWidth * scene.scaleFactor, horde.frameHeight * scene.scaleFactor);
        }

        // Animate boulder -----------------------------------------------------
        if (boulder.animate) { // If the boulder animation property is true, the boulder will animate
            if (boulder.landingPosCalculated === false) { // Sets the x position for the boulder to land to the x pos of the horde IF it hasn't been calculated
                boulder.landingPosCalculated = true;
                boulder.landingPos = (scene.height - boulder.yOffset) / Math.pow(horde.xPos + boulder.xOffset, 2); // Refers to the x-coordinate at which the boulder lands
            }
            boulder.xPos += boulder.velocity; // This updates the boulders x position
            boulder.yPos = Math.pow(boulder.xPos + boulder.xOffset, 2) * boulder.landingPos + boulder.yOffset; // This updates the boulders y position relative to the x position (y=x^2)
            drawCircle(boulder.xPos, boulder.yPos);
        }

        // Draw Tower ----------------------------------------------------------
        ctx.drawImage(tower.image, tower.left, tower.top, tower.width, tower.height);

        // Soft reset ----------------------------------------------------------
        if (boulder.yPos + boulder.radius >= horde.yPos) {
          scene.reset.soft = true;
        }

        if (scene.reset.soft === true) {
          scene.reset.softCountdown.current--;
          explosion.timer --;
          if (explosion.timer === 0) {
            explosion.timer = explosion.refresh;
            explosion.shift += explosion.frameWidth + 1;

            explosion.currentFrame++;
          }
          ctx.drawImage(explosion.image, explosion.shift, 0, explosion.frameWidth, explosion.frameHeight, boulder.xPos, boulder.yPos, explosion.frameWidth * scene.scaleFactor, explosion.frameHeight * scene.scaleFactor);
          boulder.animate = false;
        }

          if (scene.reset.softCountdown.current === 0) {
            horde.xPos = horde.xOrigin;

            resetBoulder();
            scene.reset.softCountdown.current = scene.reset.softCountdown.original;
            scene.reset.soft = false;

            // Resets spritesheet. Loops through
            if (explosion.currentFrame >= explosion.totalFrames) {
              explosion.currentFrame = 0;
              explosion.shift = 0;
            }
          }

        // Hard reset ----------------------------------------------------------
        if (horde.xPos <= tower.width) { // Resets the horde if they reach the tower
          scene.reset.hard = true;
        }

        if (scene.reset.hard === true) {
          scene.reset.hardCountdown.current--;
          $('.game-over').show();

          if (scene.reset.hardCountdown.current === 0) {
            horde.xPos = horde.xOrigin;

            resetBoulder();
            scene.reset.hard = false;
            scene.reset.hardCountdown.current = scene.reset.hardCountdown.original;
            $('.game-over').hide();
          }
        }

        // Twitter trigger -----------------------------------------------------
        triggerCountdown--;
        if (triggerCountdown === 0) {
            file = $.ajax({
                url: "stream.json",
                type: "HEAD",
                success: function() {
                    fileSize = file.getResponseHeader('Content-Length');
                    // console.log(fileSize + ", " + previousFileSize);
                    if (fileSize !== previousFileSize) {
                        boulder.animate = true;
                    }
                    previousFileSize = fileSize;
                }
            });
            triggerCountdown = 30;
        }
        requestAnimationFrame(animate);
    }
    animate();
});
