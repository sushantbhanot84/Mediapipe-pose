import "./App.css";
import * as pose from '@mediapipe/pose'
import smoothLandmarks from 'mediapipe-pose-smooth'; // ES6
import * as cam from "@mediapipe/camera_utils"
import * as drawingUtils from "@mediapipe/drawing_utils"
import {useRef, useEffect, useState, useDebugValue} from "react"
import * as mposeUtils from './utils/mpPoseUtils'
import TPose from "./poseClassifier/TPose";

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  var camera = null
  const [didLoad, setdidLoad] = useState(false)

  function onResults(results){
    const canvasElement = canvasRef.current
    const canvasCtx = canvasElement.getContext("2d")

    const angles = mposeUtils.calFullPoseAngles(mposeUtils.simplifyPoseLandmarks(results))
    console.log('full pose angles', angles)

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);


    const result1 = TPose(angles)
    console.log(pose.POSE_CONNECTIONS)
    if (results.poseLandmarks) {
      drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'green' });
      drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, [[11,12],[12,14],[13,11]], { visibilityMin: 0.65, color: 'red' });

      drawingUtils.drawLandmarks(canvasCtx, Object.values(pose.POSE_LANDMARKS_LEFT)
          .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)' });
      drawingUtils.drawLandmarks(canvasCtx, Object.values(pose.POSE_LANDMARKS_RIGHT)
          .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });
      drawingUtils.drawLandmarks(canvasCtx, Object.values(pose.POSE_LANDMARKS_NEUTRAL)
          .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'white' });
    }
    canvasCtx.restore();
  }

  useEffect(() => {
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

      camera = new cam.Camera(webcamRef.current, {
        onFrame:async() => {
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
          await mpPose.send({image: webcamRef.current});
        }
      })
      camera.start();

      mpPose.onResults((results) => smoothLandmarks(results, onResults));
      setdidLoad(true)
    }
  ,[])

  return <div className="App">
    <div className="container">
      <video className="input_video" ref={webcamRef}/>
      <canvas ref={canvasRef} className='output_canvas' ></canvas>
    </div>
  </div>;
}

export default App;