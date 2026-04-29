"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const containerId = "barcode-reader";

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.log("Stop error:", err);
      }
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
          alert("No camera found");
          onClose();
          return;
        }

        // Prefer back camera
        const cameraId =
          devices.find((d) =>
            d.label?.toLowerCase().includes("back") ||
            d.label?.toLowerCase().includes("rear")
          )?.id || devices[0].id;

        await html5QrCode.start(
          cameraId,
          {
            fps: 5, // 🔥 lower = more accurate
            qrbox: { width: 300, height: 120 },
            aspectRatio: 1.777,
          },
          async (decodedText) => {
            if (!isMounted) return;

            await stopScanner(); // 🔥 stop BEFORE returning result
            onScan(decodedText);
          },
          () => {} // ignore errors
        );
      } catch (err) {
        console.error("Camera error:", err);
        alert("Camera failed. Check permissions or HTTPS.");
        onClose();
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      stopScanner(); // 🔥 CLEANUP
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">

      {/* CAMERA */}
      <div id={containerId} className="w-full h-full" />

      {/* OVERLAY */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-72 h-40 border-2 border-green-400 rounded-md overflow-hidden">
          <div className="absolute inset-0 bg-black/30" />
          <div className="scan-line" />
        </div>
      </div>

      {/* STOP */}
      <button
        onClick={async () => {
          await stopScanner();
          onClose();
        }}
        className="absolute bottom-10 bg-red-600 px-5 py-2 rounded text-white"
      >
        Stop Scanning
      </button>

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