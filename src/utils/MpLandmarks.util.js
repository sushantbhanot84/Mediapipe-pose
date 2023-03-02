import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils"
import * as mposeUtils from './MpPose.util'

const POSE_LANDMARKS_LEFT = {
  "LEFT_SHOULDER": 11,
  "LEFT_ELBOW": 13,
  "LEFT_WRIST": 15,
  "LEFT_HIP": 23,
  "LEFT_KNEE": 25,
  "LEFT_ANKLE": 27,
}

const POSE_LANDMARKS_RIGHT = {
  "RIGHT_SHOULDER": 12,
  "RIGHT_ELBOW": 14,
  "RIGHT_WRIST": 16,
  "RIGHT_HIP": 24,
  "RIGHT_KNEE": 26,
  "RIGHT_ANKLE": 28,
}

const POSE_LANDMARKS = {
  ...POSE_LANDMARKS_LEFT,
  ...POSE_LANDMARKS_RIGHT
}

const POSE_CONNECTIONS = [
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
  [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
  [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
  [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
  [POSE_LANDMARKS.LEFT_KNEE,POSE_LANDMARKS.LEFT_ANKLE],
  [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE]
]

function drawPoseLandmarks(canvas, results, poseClassifierCallback){
  const { invalidConnections, pose } = poseClassifierCallback(poseAngles(results));
  const poseLable = document.getElementById('pose-lable-text');
  const { poseLandmarks } = results

  drawConnectors(canvas, poseLandmarks, POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'green' });
  drawConnectors(canvas, poseLandmarks, invalidConnections, { visibilityMin: 0.65, color: 'red' });

  drawLandmarks(canvas, Object.values(POSE_LANDMARKS_LEFT)
    .map(index => poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });
  drawLandmarks(canvas, Object.values(POSE_LANDMARKS_RIGHT)
    .map(index => poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });

  poseLable.innerHTML = invalidConnections?.length < 1 ? `${pose} Correct` : `${pose} Incorrect`;
}

function poseAngles(results){
  const simplifiedPoseLandmarks = mposeUtils.simplifyPoseLandmarks(results);
  return mposeUtils.calcFullPoseAngles(simplifiedPoseLandmarks)
}

export {
  drawPoseLandmarks,
  POSE_CONNECTIONS,
  POSE_LANDMARKS_LEFT,
  POSE_LANDMARKS_RIGHT,
  POSE_LANDMARKS
}