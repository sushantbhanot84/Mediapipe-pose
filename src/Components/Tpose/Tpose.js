import { Camera } from '@mediapipe/camera_utils';
import { Pose } from '@mediapipe/pose';
import { useEffect, useRef, useState } from 'react';
import useMediaPipe from '../../Core/useMediaPipe';
import * as drawUtils from '../../utils/MpLandmarks.util'
import './Tpose.css'

function Tpose() {
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

                    const img = new Image();
                    img.src = '../../pose-images/t-pose.jpg';

                    pose.send({ image: img });
                    pose.onResults(onResults);
                    return;
                }

                await camera.start();
            } catch (error) {
                console.log(error);
            }
        }

        sendPose();
    }, []);

    function onResults(results) {
        const canvasElement = canvasRef.current

        canvasElement.width = results.image.width;
        canvasElement.height = results.image.height;

        const canvasCtx = canvasElement.getContext("2d")
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (!results?.poseLandmarks) return
        drawUtils.drawPoseLandmarks(canvasCtx, results, "TPose")
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

export default Tpose;