const { Camera } = require("@mediapipe/camera_utils");

export default function useCamera(webcamRef, canvasRef, callback) {
    const camera = new Camera(webcamRef, {
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
            callback();
        }
    });

    return camera;
}