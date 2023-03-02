import * as mposeUtils from '../../utils/MpPose.util.js'

function squatClassifier(angles) {
    console.log('angles', angles);
    const invalidConnections = [];

    if (angles.left_legToHipAngle < 120 || angles.left_hipToTorsoAngle > 190) {
        console.log('left leg to hip angles is wrong');
        invalidConnections.push(mposeUtils.getLeftHipToKneeConnectors());
        invalidConnections.push(mposeUtils.getLeftKneeToAnkleConnectors());
    } else {
        console.log('left leg to hip angles is right');
    }

    if (angles.right_legToHipAngle < 120 || angles.right_legToHipAngle > 190) {
        console.log('right leg to hip angles is wrong');
        invalidConnections.push(mposeUtils.getRightHipToKneeConnectors());
        invalidConnections.push(mposeUtils.getRightKneeToAnkleConnectors());
    } else {
        console.log('right leg to hip angles is right');
    }

    return { invalidConnections, pose: 'Squat' }
}

export default squatClassifier;