"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const containerId = "barcode-reader";

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

      const cameraId = devices[0].id;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 280, height: 120 },
        },
        async (text) => {
          if (!mounted) return;

          const image = captureImage(); // 📸 snapshot

          await scanner.stop();
          await scanner.clear();

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
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div id={containerId} className="w-full h-full" />

      {/* scanning UI box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-40 border-2 border-green-400 relative overflow-hidden rounded-md">
          <div className="scan-line" />
        </div>
      </div>

      <style jsx>{`
        .scan-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: #00ff66;
          animation: scan 1.5s infinite;
        }

        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}