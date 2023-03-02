import { Camera } from '@mediapipe/camera_utils';
import { useEffect, useRef } from 'react';
import useMediaPipe from '../../Core/useMediaPipe';
import * as drawUtils from '../../utils/MpLandmarks.util'
import squatClassifier from '../../PoseClassifiers/Movement/Squat.Classifier'
import { calcFullPoseAngles, simplifyPoseLandmarks } from '../../utils/MpPose.util';

function Squats() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const pose = useMediaPipe();

    useEffect(() => {
        if (!pose) return;
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
                    await pose.send({ image: webcamRef.current });
                }
            });

            try {
                const isStatic = window.location.href.includes('#'); // based on route, choose the camera feed or image for pose detection
                if (isStatic) {
                    const vid = document.createElement('video');
                    vid.src = '../../pose-images/production ID_4265287.mp4'
                    document.body.append(vid);
                    // vid.play()
                    // const img = new Image();
                    // img.src = '../../pose-images/squat-front-view-1.jpg';
                    // vid.srcObject = '../../pose-images/squats-2.gif'

                    vid.requestVideoFrameCallback(() => {
                        console.log('video frame callback');
                        pose.send({ image: vid });
                    });

                    setInterval(() => {
                        vid.requestVideoFrameCallback(() => {
                            console.log('video frame callback');
                            pose.send({ image: vid });
                        });
                    }, 1000);

                    pose.onResults(onResults);
                    return;
                }
                await camera.start();
            } catch (error) {
                console.log(error);
            }
        }
        pose.onResults(onResults);
        sendPose();
    }, [pose]);

    function onResults(results) {
        const canvasElement = canvasRef.current

        canvasElement.height = results.image.height;
        canvasElement.width = results.image.width;

        const canvasCtx = canvasElement.getContext("2d")
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (!results?.poseLandmarks) return

        function squats() {
            const landmarks = simplifyPoseLandmarks(results);
            const angles = calcFullPoseAngles(landmarks);

            console.log('angles', angles);

            if (angles.left_legToHipAngle < 120 || angles.left_hipToTorsoAngle > 190) {
                console.log('left leg to hip angles is wrong');
            } else {
                console.log('left leg to hip angles is right');
            }

            if (angles.right_legToHipAngle < 120 || angles.right_legToHipAngle > 190) {
                console.log('right leg to hip angles is wrong');
            } else {
                console.log('right leg to hip angles is right');
            }
        }

        // squats()

        drawUtils.drawPoseLandmarks(canvasCtx, results, squatClassifier)
        // canvasCtx.fillStyle = 'black';
        // canvasCtx.font = "bold 18px Arial";
        // canvasCtx.fillText(angles.left_armAngle, simplifiedPoseLandmarks[13].x, simplifiedPoseLandmarks[13].y, 800);
        canvasCtx.restore();
    }

    return (
        <div className="App">
            <div className="container">
                <video className="input_video" ref={webcamRef} />
                <canvas ref={canvasRef} className='output_canvas' ></canvas>
            </div>

            <div id="pose-lable" style={{ padding: '10px', width: 'fit-content', position: 'sticky', background: 'cadetblue' }}>
                <p id="pose-lable-text">Pose: Unknown</p>
            </div>
        </div>
    )
}

export default Squats;