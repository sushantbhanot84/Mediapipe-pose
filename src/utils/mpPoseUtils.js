import pose, { POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT } from '@mediapipe/pose';

function angleBetweenLines(landmark1, landmark2, landmark3) {
  const { x: x1, y: y1 } = landmark1;
  const { x: x2, y: y2 } = landmark2;
  const { x: x3, y: y3 } = landmark3;

  let angle = (Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2));
  angle = angle * 180 / Math.PI;

  if (angle < 0) angle += 360;
  return angle;
}

export function calFullPoseAngles(landmarks) {
  const right_fullLeftPoseAngles = calLeftPoseAngles(landmarks);
  const right_fullRightPoseAngles = calRightPoseAngles(landmarks);
  const hipsToTorsoAngles = calHipsToTorsoAngles(landmarks);

  return { ...right_fullLeftPoseAngles, ...right_fullRightPoseAngles, ...hipsToTorsoAngles }
}

export function calLeftPoseAngles(landmarks) {
  const left_upperPoseAngles = calLeftUpperPoseAngles(landmarks);
  const left_lowerPoseAngles = calLeftLowerPoseAngles(landmarks);

  return { ...left_upperPoseAngles, ...left_lowerPoseAngles }
}

export function calRightPoseAngles(landmarks) {
  const right_upperPoseAngles = calRightUpperPoseAngles(landmarks);
  const right_lowerPoseAngles = calRightLowerPoseAngles(landmarks);

  return { ...right_upperPoseAngles, ...right_lowerPoseAngles }
}

export function calRightUpperPoseAngles(landmarks) {
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

export function calLeftUpperPoseAngles(landmarks) {
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

export function calRightLowerPoseAngles(landmarks) {
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

export function calLeftLowerPoseAngles(landmarks) {
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

export function calHipsToTorsoAngles(landmarks) {
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

export function simplifyPoseLandmarks(results){
  return results.poseLandmarks.map(landmark => {
    return {
      x: landmark.x * results.image.width,
      y: landmark.y * results.image.height,
      visibility: landmark.visibility
    }
  });
}