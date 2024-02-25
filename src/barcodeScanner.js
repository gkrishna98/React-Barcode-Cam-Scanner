import React, { useEffect, useRef, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const BarcodeScanner = ({
  onUpdate,
  onError,
  width = "100%",
  height = "100%",
  facingMode = "environment", //under construction
  torch, //under construction
  delay = 100,
  videoConstraints, //under construction
  stopStream,
}) => {
  const videoRef = useRef(null);

  const captureScreenshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;

      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current frame of the video onto the canvas
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas content to a data URL
      const dataUrl = canvas.toDataURL("image/png");
      return dataUrl;
    }
  };
  const capture = useCallback(() => {
    const codeReader = new BrowserMultiFormatReader();
    const imageSrc = captureScreenshot();
    if (imageSrc) {
      codeReader
        .decodeFromImage(undefined, imageSrc)
        .then((result) => {
          onUpdate(null, result);
        })
        .catch((err) => {
          onUpdate(err);
        });
    }
  }, [onUpdate]);

  useEffect(() => {
    if (stopStream) {
      let stream = videoRef?.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => {
          stream.removeTrack(track);
          track.stop();
        });
        stream = null;
      }
    }
  }, [stopStream]);

  useEffect(() => {
    const interval = setInterval(capture, delay);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const startVideoCapture = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Assign the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startVideoCapture();

    // Cleanup: Stop the stream when the component unmounts
    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        width={width ? width : "640"}
        height={height ? height : "480"}
        autoPlay
        playsInline
        muted
        onError={onError}
      ></video>
    </>
  );
};

export default BarcodeScanner;
