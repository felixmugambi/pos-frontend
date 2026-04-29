"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const containerId = "barcode-reader";

  useEffect(() => {
    let html5QrCode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
          alert("No camera found on device");
          onClose();
          return;
        }

        // ✅ Prefer back camera
        const cameraId =
          devices.find((d) =>
            d.label?.toLowerCase().includes("back") ||
            d.label?.toLowerCase().includes("rear")
          )?.id || devices[0].id;

        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 280, height: 120 },
          },
          (decodedText) => {
            onScan(decodedText);
            stopScanner();
          },
          (err) => {
            // ignore scan errors (normal)
          }
        );
      } catch (err) {
        console.error("Camera start error:", err);
        alert("Camera failed to start. Check permissions or HTTPS.");
        onClose();
      }
    };

    const stopScanner = async () => {
      try {
        if (scannerRef.current) {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        }
      } catch (e) {
        console.log("Stop error:", e);
      }

      onClose();
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">

      {/* CAMERA CONTAINER */}
      <div
        id={containerId}
        className="w-full h-full"
      />

      {/* SCAN FRAME OVERLAY */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-72 h-40 border-2 border-green-400 rounded-md overflow-hidden">

          {/* dark overlay inside frame */}
          <div className="absolute inset-0 bg-black/30" />

          {/* moving scan line */}
          <div className="scan-line" />
        </div>
      </div>

      {/* STOP BUTTON */}
      <button
        onClick={onClose}
        className="absolute bottom-10 bg-red-600 px-5 py-2 rounded text-white"
      >
        Stop Scanning
      </button>

      {/* ANIMATION */}
      <style jsx>{`
        .scan-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: #00ff66;
          animation: scan 1.6s infinite ease-in-out;
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