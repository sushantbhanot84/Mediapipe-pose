import React from 'react'
import * as mposeUtils from '../../utils/MpPose.util.js'

function pushupClassifier(results) {
  const angles = mposeUtils.getPoseAngles(results)

  validatePushup(results)
}

function validatePushup(results){
}

export default pushupClassifier;