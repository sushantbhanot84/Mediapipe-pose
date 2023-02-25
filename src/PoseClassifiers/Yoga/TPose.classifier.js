import React from 'react'
import * as mposeUtils from '../../utils/MpPose.util.js'

function tPoseClassifier(angles) {
  const redConnections = [];

  if (80 > angles.right_hipToTorsoAngle || 100 < angles.right_hipToTorsoAngle) {
    redConnections.push(mposeUtils.getLeftToRightHipConnectors());
    redConnections.push(mposeUtils.getRightHipToKneeConnectors());
  } else {
    if (175 > angles.left_legAngle || 190 < angles.left_legAngle) {
      redConnections.push(mposeUtils.getLeftHipToKneeConnectors());
      redConnections.push(mposeUtils.getLeftKneeToAnkleConnectors());
    }
  }

  if (80 > angles.left_hipToTorsoAngle || 100 < angles.left_hipToTorsoAngle) {
    redConnections.push(mposeUtils.getLeftToRightHipConnectors());
    redConnections.push(mposeUtils.getLeftHipToKneeConnectors());
  } else {
    if (175 > angles.right_legAngle || 190 < angles.right_legAngle) {
      redConnections.push(mposeUtils.getRightHipToKneeConnectors());
      redConnections.push(mposeUtils.getRightKneeToAnkleConnectors());
    }
  }

  if (85 > angles.left_armToTorsoAngle || 100 < angles.left_armToTorsoAngle) {
    redConnections.push(mposeUtils.getLeftShoulderToHipConnectors());
    redConnections.push(mposeUtils.getLeftShoulderToElbowConnectors());
  } else {
    if (170 > angles.left_armAngle || 200 < angles.left_armAngle) {
      redConnections.push(mposeUtils.getLeftShoulderToElbowConnectors());
      redConnections.push(mposeUtils.getLeftElbowToWristConnectors());
    }
  }

  if (85 > angles.right_armToTorsoAngle || 100 < angles.right_armToTorsoAngle) {
    redConnections.push(mposeUtils.getRightShoulderToHipConnectors());
    redConnections.push(mposeUtils.getRightShoulderToElbowConnectors());
  } else {
    if (170 > angles.right_armAngle || 200 < angles.right_armAngle) {
      redConnections.push(mposeUtils.getRightShoulderToElbowConnectors());
      redConnections.push(mposeUtils.getRightElbowToWristConnectors());
    }
  }

  return redConnections;
}

export default tPoseClassifier;