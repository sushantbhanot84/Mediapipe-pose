import "./App.css";
import { Pose } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils';
import { useRef, useEffect, useState } from "react"
import * as drawUtils from './utils/MpLandmarks.util'


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [camera, setCamera] = useState(null);
  const [mpPose, setMpPose] = useState(null);

  useEffect(() => {
    if (mpPose) return;

    function initPose() {
      const mpPose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });

      mpPose.setOptions({
        selfieMode: true,
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      mpPose.onResults(onResults);
      setMpPose(mpPose);
    }

    initPose();
  }, []);

  useEffect(() => {
    if (!mpPose) return;

    async function sendPose() {
      const camera = new Camera(webcamRef.current, {
        onFrame: async () => {
          const canvasElement = canvasRef.current
          const aspect = window.innerHeight / window.innerWidth;
          let width, height;
          if (window.innerWidth > window.innerHeight) {
            height = window.innerHeight;
            width = height / aspect;
          }
          else {
            width = window.innerWidth;
            height = width * aspect;
          }
          canvasElement.width = width;
          canvasElement.height = height;
          await mpPose.send({ image: webcamRef.current });
        }
      });
      setCamera(camera);

      try {
        const isStatic = window.location.href.includes('/static'); // based on route, choose the camera feed or image for pose detection
        if (isStatic) {
          const img = new Image();
          img.src = './pose-images/pushups.jpg';

          mpPose.send({ image: img });
          mpPose.onResults(onResults);
          return;
        }

        await camera.start();
      } catch (error) {
        console.log(error);
      }
    }

    sendPose();
  }, [mpPose]);

  function onResults(results) {
    const canvasElement = canvasRef.current

    canvasElement.width = results.image.width;
    canvasElement.height = results.image.height;

    const canvasCtx = canvasElement.getContext("2d")
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (!results?.poseLandmarks) return
    drawUtils.drawPoseLandmarks(canvasCtx, results, "TPose")
    // canvasCtx.fillStyle = 'black';
    // canvasCtx.font = "bold 18px Arial";
    // canvasCtx.fillText(angles.left_armAngle, simplifiedPoseLandmarks[13].x, simplifiedPoseLandmarks[13].y, 800);
    canvasCtx.restore();
  }

  return <div className="App">
    <div className="container">
      <video className="input_video" ref={webcamRef} />
      <canvas ref={canvasRef} className='output_canvas' ></canvas>
    </div>

    <div id="pose-lable" style={{ padding: '10px', width: 'fit-content', position: 'sticky', background: 'cadetblue' }}>
      <p id="pose-lable-text">Pose: Unknown</p>
    </div>
  </div>;
}

export default App;