import { POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT } from './MpLandmarks.util';

function angleBetweenLines(landmark1, landmark2, landmark3) {
  const { x: x1, y: y1 } = landmark1;
  const { x: x2, y: y2 } = landmark2;
  const { x: x3, y: y3 } = landmark3;

  let angle = (Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2));
  angle = angle * 180 / Math.PI;

  if (angle < 0) angle += 360;
  return angle;
}

function calcFullPoseAngles(landmarks) {
  const right_fullLeftPoseAngles = calcLeftPoseAngles(landmarks);
  const right_fullRightPoseAngles = calcRightPoseAngles(landmarks);
  const hipsToTorsoAngles = calcHipsToTorsoAngles(landmarks);

  return { ...right_fullLeftPoseAngles, ...right_fullRightPoseAngles, ...hipsToTorsoAngles }
}

function calcLeftPoseAngles(landmarks) {
  const left_upperPoseAngles = calcLeftUpperPoseAngles(landmarks);
  const left_lowerPoseAngles = calcLeftLowerPoseAngles(landmarks);

  return { ...left_upperPoseAngles, ...left_lowerPoseAngles }
}

function calcRightPoseAngles(landmarks) {
  const right_upperPoseAngles = calcRightUpperPoseAngles(landmarks);
  const right_lowerPoseAngles = calcRightLowerPoseAngles(landmarks);

  return { ...right_upperPoseAngles, ...right_lowerPoseAngles }
}

function calcRightUpperPoseAngles(landmarks) {
  const right_armAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_ELBOW],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_WRIST]
  );

  const right_armToTorsoAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_ELBOW],
  );

  return { right_armAngle, right_armToTorsoAngle }
}

function calcLeftUpperPoseAngles(landmarks) {
  const left_armAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_LEFT.LEFT_WRIST],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_ELBOW],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER],
  );

  const left_armToTorsoAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_LEFT.LEFT_ELBOW],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
  );

  return { left_armAngle, left_armToTorsoAngle }
}

function calcRightLowerPoseAngles(landmarks) {
  const right_legAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_ANKLE]
  );

  const right_legToHipAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE],
  );

  return { right_legAngle, right_legToHipAngle }
}

function calcLeftLowerPoseAngles(landmarks) {
  const left_legAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_LEFT.LEFT_ANKLE],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
  );

  const left_legToHipAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
  );

  return { left_legAngle, left_legToHipAngle }
}

function calcHipsToTorsoAngles(landmarks) {
  const right_hipToTorsoAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER],
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
  );

  const left_hipToTorsoAngle = angleBetweenLines(
    landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
    landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER],
  );

  return { right_hipToTorsoAngle, left_hipToTorsoAngle }
}

function simplifyPoseLandmarks(results, minVisibility=0.5) {
  return results.poseLandmarks.map(landmark => {
    return {
      x:  Math.min(Math.floor(landmark.x * results.image.width), results.image.width - 1),
      y: Math.min(Math.floor(landmark.y * results.image.height), results.image.height - 1),
      visibility: landmark.visibility
    }
  });
}

function getRightShoulderToElbowConnectors() {
  return [POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER, POSE_LANDMARKS_RIGHT.RIGHT_ELBOW]
}

function getRightElbowToWristConnectors() {
  return [POSE_LANDMARKS_RIGHT.RIGHT_ELBOW, POSE_LANDMARKS_RIGHT.RIGHT_WRIST]
}

function getLeftShoulderToElbowConnectors() {
  return [POSE_LANDMARKS_LEFT.LEFT_SHOULDER, POSE_LANDMARKS_LEFT.LEFT_ELBOW]
}

function getLeftElbowToWristConnectors() {
  return [POSE_LANDMARKS_LEFT.LEFT_ELBOW, POSE_LANDMARKS_LEFT.LEFT_WRIST]
}

function getRightHipToKneeConnectors() {
  return [POSE_LANDMARKS_RIGHT.RIGHT_HIP, POSE_LANDMARKS_RIGHT.RIGHT_KNEE];
}

function getRightKneeToAnkleConnectors() {
  return [POSE_LANDMARKS_RIGHT.RIGHT_KNEE, POSE_LANDMARKS_RIGHT.RIGHT_ANKLE];
}

function getLeftHipToKneeConnectors() {
  return [POSE_LANDMARKS_LEFT.LEFT_HIP, POSE_LANDMARKS_LEFT.LEFT_KNEE];
}

function getLeftKneeToAnkleConnectors() {
  return [POSE_LANDMARKS_LEFT.LEFT_KNEE, POSE_LANDMARKS_LEFT.LEFT_ANKLE];
}

function getTorsoConnectors() {
  return []
}

function getLeftShoulderToHipConnectors() {
  return [POSE_LANDMARKS_LEFT.LEFT_SHOULDER, POSE_LANDMARKS_LEFT.LEFT_HIP]
}

function getRightShoulderToHipConnectors() {
  return [POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER, POSE_LANDMARKS_RIGHT.RIGHT_HIP]
}

function getLeftToRightHipConnectors() {
  return [POSE_LANDMARKS_LEFT.LEFT_HIP, POSE_LANDMARKS_RIGHT.RIGHT_HIP]
}

export {
  calcFullPoseAngles,
  calcLeftPoseAngles,
  calcRightPoseAngles,
  calcRightUpperPoseAngles,
  calcLeftUpperPoseAngles,
  calcRightLowerPoseAngles,
  calcLeftLowerPoseAngles,
  calcHipsToTorsoAngles,
  simplifyPoseLandmarks,
  getRightShoulderToElbowConnectors,
  getRightElbowToWristConnectors,
  getLeftShoulderToElbowConnectors,
  getLeftElbowToWristConnectors,
  getRightHipToKneeConnectors,
  getRightKneeToAnkleConnectors,
  getLeftHipToKneeConnectors,
  getLeftKneeToAnkleConnectors,
  getTorsoConnectors,
  getLeftShoulderToHipConnectors,
  getRightShoulderToHipConnectors,
  getLeftToRightHipConnectors
}