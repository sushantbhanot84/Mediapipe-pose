import React from 'react'
import * as mposeUtils from '../../utils/MpPose.util.js'

function TPose(angles) {
  const invalidConnections = [];

  if (80 > angles.right_hipToTorsoAngle || 100 < angles.right_hipToTorsoAngle) {
    invalidConnections.push(mposeUtils.getLeftToRightHipConnectors());
    invalidConnections.push(mposeUtils.getRightHipToKneeConnectors());
  } else {
    if (175 > angles.left_legAngle || 190 < angles.left_legAngle) {
      invalidConnections.push(mposeUtils.getLeftHipToKneeConnectors());
      invalidConnections.push(mposeUtils.getLeftKneeToAnkleConnectors());
    }
  }

  if (80 > angles.left_hipToTorsoAngle || 100 < angles.left_hipToTorsoAngle) {
    invalidConnections.push(mposeUtils.getLeftToRightHipConnectors());
    invalidConnections.push(mposeUtils.getLeftHipToKneeConnectors());
  } else {
    if (175 > angles.right_legAngle || 190 < angles.right_legAngle) {
      invalidConnections.push(mposeUtils.getRightHipToKneeConnectors());
      invalidConnections.push(mposeUtils.getRightKneeToAnkleConnectors());
    }
  }

  if (85 > angles.left_armToTorsoAngle || 100 < angles.left_armToTorsoAngle) {
    invalidConnections.push(mposeUtils.getLeftShoulderToHipConnectors());
    invalidConnections.push(mposeUtils.getLeftShoulderToElbowConnectors());
  } else {
    if (170 > angles.left_armAngle || 200 < angles.left_armAngle) {
      invalidConnections.push(mposeUtils.getLeftShoulderToElbowConnectors());
      invalidConnections.push(mposeUtils.getLeftElbowToWristConnectors());
    }
  }

  if (85 > angles.right_armToTorsoAngle || 100 < angles.right_armToTorsoAngle) {
    invalidConnections.push(mposeUtils.getRightShoulderToHipConnectors());
    invalidConnections.push(mposeUtils.getRightShoulderToElbowConnectors());
  } else {
    if (170 > angles.right_armAngle || 200 < angles.right_armAngle) {
      invalidConnections.push(mposeUtils.getRightShoulderToElbowConnectors());
      invalidConnections.push(mposeUtils.getRightElbowToWristConnectors());
    }
  }

  return { invalidConnections, pose: 'Tpose' };
}

export default TPose;