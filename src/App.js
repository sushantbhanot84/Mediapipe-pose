import "./App.css";
import * as pose from '@mediapipe/pose'
import smoothLandmarks from 'mediapipe-pose-smooth'; // ES6
import { Camera } from '@mediapipe/camera_utils';
import * as drawingUtils from "@mediapipe/drawing_utils"
import { useRef, useEffect, useState, useDebugValue } from "react"
import TPose from "./PoseClassifiers/Yoga/TPose";
import * as mposeUtils from './utils/MpPose.util'


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [camera, setCamera] = useState(null);
  const [mpPose, setMpPose] = useState(null);

  useEffect(() => {
    if (mpPose) return;

    function initPose() {
      const mpPose = new pose.Pose({
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

      mpPose.onResults((results) => smoothLandmarks(results, onResults));
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
          img.src = './pose-images/t-pose-2.jpg';

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
    if (!results?.poseLandmarks) {
      return;
    }

    const canvasElement = canvasRef.current

    canvasElement.width = results.image.width;
    canvasElement.height = results.image.height;

    const canvasCtx = canvasElement.getContext("2d")
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    const simplifiedPoseLandmarks = mposeUtils.simplifyPoseLandmarks(results);
    const angles = mposeUtils.calcFullPoseAngles(simplifiedPoseLandmarks)
    console.log('full pose angles', angles)

    const tPoseResult = TPose(angles);
    console.log(pose.POSE_CONNECTIONS);

    const poseLable = document.getElementById('pose-lable-text');
    poseLable.innerHTML = tPoseResult.length < 1 ? 'Pose: T POSE' : 'Pose: UNKNOWN';

    if (results.poseLandmarks) {
      drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'green' });
      drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, tPoseResult, { visibilityMin: 0.65, color: 'red' });

      drawingUtils.drawLandmarks(canvasCtx, Object.values(pose.POSE_LANDMARKS_LEFT)
        .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)' });
      drawingUtils.drawLandmarks(canvasCtx, Object.values(pose.POSE_LANDMARKS_RIGHT)
        .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });
      drawingUtils.drawLandmarks(canvasCtx, Object.values(pose.POSE_LANDMARKS_NEUTRAL)
        .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'white' });
    }

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