var gameInstance = UnityLoader.instantiate(
            "gameContainer", 
            "Build/HTML.json", {
                onProgress: UnityProgress
            }
        );

        var stream;
        var recorder;
        var video;
        var canvas;
        var capturing = false;

        function finishCapturing(e) {
            capturing = false;
            var videoData = [ e.data ];
            var blob = new Blob(
                videoData, { 
                    'type': 'video/webm' 
                }
            );
            var videoURL = URL.createObjectURL(blob);
            video.src = videoURL;
            console.log(videoURL);
            //video.play();
        }

        function grabar(width, height) {
            Toast();
            video = document.getElementById('video');
            canvas = document.querySelector('canvas');
            capturing = false;

            stream = canvas.captureStream(25);
            recorder = new MediaRecorder(stream);
            
            recorder.addEventListener(
                'dataavailable', 
                finishCapturing
            );

            capturing = true;
            recorder.start();

            document.getElementById('grabar').disabled = true;
            document.getElementById('stopp').disabled = false;
        }

        function stop() {
            document.getElementById('grabar').disabled = false;
            document.getElementById('stopp').disabled = true;
            recorder.stop();
            cambio();
        }

        function Toast() {
            var x = document.getElementById("toast")
            x.className = "show";
            setTimeout(
                function(){ 
                    x.className = x.className.replace("show", ""); 
                }, 
                4000
            );
        }

        function cambio() {
            $('#simu').toggle();
            $('#replay').toggle();  
            $('#video').toggle();     
        }