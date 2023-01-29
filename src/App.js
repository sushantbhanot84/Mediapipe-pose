import "./App.css";
import {Pose} from '@mediapipe/pose'
import smoothLandmarks from 'mediapipe-pose-smooth'; // ES6
import Webcam from 'react-webcam'
import * as cam from "@mediapipe/camera_utils"
import {useRef, useEffect, useState, useDebugValue} from "react"

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const gridRef = useRef(null)
  var camera = null
  const drawingUtils = window;
  const mpPose = window;
  const controls = window;
  const [didLoad, setdidLoad] = useState(false)

  const LandmarkGrid = window.LandmarkGrid;
  var grid = null


  function onResults(results){
    if (!results.poseLandmarks) {
      grid.updateLandmarks([]);
      return;
    }
    document.body.classList.add('loaded');
    const canvasElement = canvasRef.current
    const canvasCtx = canvasElement.getContext("2d")
    canvasCtx.save();
    let activeEffect = 'mask';

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.segmentationMask) {
      canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);
      if (activeEffect === 'mask' || activeEffect === 'both') {
          canvasCtx.globalCompositeOperation = 'source-in';
          canvasCtx.fillStyle = '#00FF007F';
          canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
      }
      else {
          canvasCtx.globalCompositeOperation = 'source-out';
          canvasCtx.fillStyle = '#0000FF7F';
          canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
      }
      canvasCtx.globalCompositeOperation = 'destination-atop';
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.globalCompositeOperation = 'source-over';
    }
    else {
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    }
    if (results.poseLandmarks) {
      drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'white' });
      drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_LEFT)
          .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)' });
      drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_RIGHT)
          .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });
      drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_NEUTRAL)
          .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'white' });
    }
    if (results.poseWorldLandmarks) {
      grid.updateLandmarks(results.poseWorldLandmarks, mpPose.POSE_CONNECTIONS, [
          { list: Object.values(mpPose.POSE_LANDMARKS_LEFT), color: 'LEFT' },
          { list: Object.values(mpPose.POSE_LANDMARKS_RIGHT), color: 'RIGHT' },
      ]);
    }
    else {
      grid.updateLandmarks([]);
    }
  }

  useEffect(() => {
    if(!didLoad){
      const pose = new Pose({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });
      if (!grid){
        grid = new LandmarkGrid(gridRef.current, {
          connectionColor: 0xCCCCCC,
          definedColors: [{ name: 'LEFT', value: 0xffa500 }, { name: 'RIGHT', value: 0x00ffff }],
          range: 2,
          fitToGrid: true,
          labelSuffix: 'm',
          landmarkSize: 1,
          numCellsPerAxis: 4,
          showHidden: false,
          centered: true,
        });
      }
      pose.setOptions({
        selfieMode: true,
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Pass another function to receive the results
      pose.onResults(onResults);

      if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null ){
        camera = new cam.Camera(webcamRef.current.video, {
          onFrame:async() => {
            await pose.send({image: webcamRef.current.video});
          }
        })
      }
      camera.start();
      setdidLoad(true)
    }
  },[didLoad])

  return <div className="App">
    <div className="container">
      <Webcam ref={webcamRef} className="input_video"/>
      <canvas ref={canvasRef} className='output_canvas' style={{
        width: "1200px",
        height: "720px"
      }} ></canvas>
    </div>
    <div className="control-panel"></div>
    <div className="square-box">
      <div className="landmark-grid-container" ref={gridRef}></div>
    </div>
  </div>;
}

export default App;