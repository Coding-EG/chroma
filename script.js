let downloadVideo, videoReference, canvas, recordedVideo, imgData;
downloadVideo = document.getElementById("download-video");
videoReference = document.getElementById("canvas-reference");
let backGround = document.querySelector("#background-image");
canvas = document.getElementById("canvas");
canvas.width = 1920;
canvas.height = 1080;
let ranges = [];
// video stream from camera
function videoFromCamera() {
  // access the camera
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => (videoReference.srcObject = stream))
    .catch((error) => console.error(error));
}

// Define thresholds for removing green color (adjust as needed)
let greenThreshold = 0;
videoFromCamera();
document.getElementById("greenValue").addEventListener("change", () => {
  let greenValue = document.getElementById("greenValue").value;
  greenThreshold = greenValue;
  document.getElementById("green").innerText = greenValue;
  // console.log(greenValue)
});

// live video manipulation
function videoManipulation() {
  let ctx = canvas.getContext("2d");
  //for reference

  videoReference.onplay = () => {
    function canvasManipulation() {
      ctx.drawImage(videoReference, 0, 0, 1920, 1080);
      let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let pixelsData = pixels.data;
      // to edit video data use for loop
      for (let i = 0; i < pixelsData.length; i += 4) {
        /* if (pixelsData[i + 0] <= 55 &&
                    pixelsData[i + 1] <= 55 &&
                    pixelsData[i + 2] <= 50) {

                    pixelsData[i + 0] = 255;//- pixelsData[i+0];
                    pixelsData[i + 1] = 2;//-pixelsData[i+1];
                    pixelsData[i + 2] = 2;//- pixelsData[i+2];
                    // pixelsData[i+3] =255;//pixelsData[i+3];

                } */

        //code for to remove green color from background
        const r = pixelsData[i];
        const g = pixelsData[i + 1];
        const b = pixelsData[i + 2];

        const greenDiff = g - Math.max(r, b);

        // If the difference is greater than the threshold, make the pixel transparent
        if (greenDiff > greenThreshold) {
          if (imgData == undefined) {
            pixelsData[i + 3] = 0; // Set alpha channel to 0 (transparent)
          } else {
            pixelsData[i + 0] = imgData[i + 0];
            pixelsData[i + 1] = imgData[i + 1];
            pixelsData[i + 2] = imgData[i + 2];
            pixelsData[i + 3] = imgData[i + 3];
          }
        }
      }
      //ctx.imageSmoothingQuality = "high";

      ctx.putImageData(pixels, 0, 0);
      ctx.filter =
        "blur(" +
        ranges[0] +
        "px)brightness(" +
        ranges[1] +
        ")contrast(" +
        ranges[2] +
        ")saturate(" +
        ranges[3] +
        ")drop-shadow(" +
        ranges[4] +
        "1px 5px black)grayscale(" +
        ranges[5] +
        ")hue-rotate(" +
        ranges[6] +
        "deg)invert(" +
        ranges[7] +
        ")sepia(" +
        ranges[8] +
        ")opacity(" +
        ranges[9] +
        ")";

      //requestAnimationFrame(canvasManipulation);
      setInterval(40,canvasManipulation);
    }
    canvasManipulation();
  };
}
videoManipulation();

function edit() {
  var range_value = document.querySelectorAll(".data");
  var ran = document.querySelectorAll(".dataValue");
  var data = new Array();
  data = [1, 50, 50, 50, 1, 100, 1, 100, 100, 100];

  var unit = new Array();
  unit = ["px", "%", "%", "%", "px", "%", "<sup>o", "%", "%", "%"];

  for (
    i = 0, j = 0, k = 0, l = 0;
    i < range_value.length, j < ran.length, k < data.length, l < unit.length;
    i++, j++, k++, l++
  ) {
    ran[j].innerHTML = Math.floor(range_value[i].value * data[k]) + unit[l];
  }

  /* canvas photo edit work*/

  for (v = 0, x = 0; v < range_value.length, x < range_value.length; v++, x++) {
    ranges[x] = range_value[v].value;
  }
}
edit();

// Record camera edited video

recordedVideo = [];
const link = document.createElement("a");
let eventButton = document.getElementsByClassName("button");
eventButton[1].addEventListener("click", recordVideo);
eventButton[2].addEventListener("click", downloadRecordedVideo);
let streamReference = canvas.captureStream();
const mediaRecord = new MediaRecorder(streamReference);
mediaRecord.ondataavailable = (e) => {
  //console.log("hi");
  if (e.data.size > 0) {
    recordedVideo.push(e.data);
  }
};

/* function recordVideo() {
        
          mediaRecord.ondataavailable = (e)=> {
            if(e.data.size > 0) {
                recordedVideo.push(e.data);
                console.log("hi");
            }
            
        }*/
function recordVideo() {
  //  if (mediaRecord.state == "recording") return
  mediaRecord.start(35);
  // console.log(mediaRecord.stream)
  // console.log("run1");
  // console.log(mediaRecord);
}

// download video
function downloadRecordedVideo() {
  mediaRecord.stop();
  link.href = URL.createObjectURL(
    new Blob(recordedVideo, { type: "video/gif" })
  );
  link.download = "success";
  link.click();
  console.log(mediaRecord);
  setTimeout(() => {
    recordedVideo = [];
    console.log(mediaRecord.length);
  }, 2000);
}

// add background to web Cam Video
function addBackground(event) {
  let backGroundBlob = this.files;
  let imgPre = new Image();
  imgPre.src = URL.createObjectURL(
    new Blob(backGroundBlob, { type: "image/png" })
  );
  let imgCanvas = document.createElement("canvas");
  imgCanvas.height = 1920;
  imgCanvas.width = 1080;
  let imgCtx = imgCanvas.getContext("2d");
  imgPre.onload = () => {
    imgCtx.drawImage(imgPre, 0, 0, 1920, 1080);
    let img = imgCtx.getImageData(0, 0, 1920, 1080);
    imgData = img.data;
  };
}

backGround.addEventListener("change", addBackground);
