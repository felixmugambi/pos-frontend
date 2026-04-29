"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const containerId = "barcode-reader";

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.log("Stop error:", err);
    }
  };

  const captureImage = () => {
    const video = document.querySelector("video");
    if (!video) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/png");
  };

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      const devices = await Html5Qrcode.getCameras();
      if (!devices.length) {
        alert("No camera found");
        onClose();
        return;
      }

      const backCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
      );

      const cameraId = backCamera ? backCamera.id : devices[0].id;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 280, height: 120 },
        },
        async (text) => {
          if (!mounted) return;

          const image = captureImage();

          await stopScanner();

          onScan({
            barcode: text,
            image,
          });

          onClose();
        }
      );
    };

    start();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* scanner */}
      <div id={containerId} className="w-full h-full" />

      {/* scan box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-40 border-2 border-green-400 rounded-md relative overflow-hidden">
          <div className="scan-line" />
        </div>
      </div>

      {/* STOP BUTTON (IMPORTANT FIX) */}
      <button
        onClick={async () => {
          await stopScanner();
          onClose();
        }}
        className="absolute bottom-10 bg-red-600 text-white px-5 py-2 rounded"
      >
        Stop Scanning
      </button>

      <style jsx>{`
        .scan-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: #00ff66;
          animation: scan 1.5s infinite ease-in-out;
        }

        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
