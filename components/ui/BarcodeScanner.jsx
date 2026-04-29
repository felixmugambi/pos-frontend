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
      const cameraId = devices?.[devices.length - 1]?.id;

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 120 },
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
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">

      {/* CAMERA VIEW */}
      <div id="reader" className="w-full max-w-md rounded overflow-hidden" />

      {/* ANIMATED SCAN LINE */}
      <div className="absolute w-64 h-1 bg-green-400 animate-bounce top-1/2 opacity-70" />

      {/* STOP BUTTON */}
      <button
        onClick={onClose}
        className="mt-4 bg-red-600 px-4 py-2 rounded"
      >
        Stop Scanning
      </button>

      {/* ANIMATION STYLE */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-40px); }
          50% { transform: translateY(40px); }
          100% { transform: translateY(-40px); }
        }

        .animate-bounce {
          animation: scan 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}