"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const start = async () => {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      const devices = await Html5Qrcode.getCameras();
      const cameraId = devices?.[0]?.id;

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 280, height: 120 }, // IMPORTANT: real scanning box
        },
        (decodedText) => {
          onScan(decodedText);
          stop();
        }
      );
    };

    const stop = async () => {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
      onClose();
    };

    start();

    return () => stop();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">

      {/* CAMERA VIEW */}
      <div
        id="reader"
        className="w-full h-full"
      />

      {/* SCANNER OVERLAY */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-72 h-40 border-2 border-green-400 rounded-md overflow-hidden">

          {/* DARK OUTSIDE AREA FEEL */}
          <div className="absolute inset-0 bg-black/30" />

          {/* MOVING SCAN LINE (INSIDE BOX ONLY) */}
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
          animation: scan 1.5s infinite ease-in-out;
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