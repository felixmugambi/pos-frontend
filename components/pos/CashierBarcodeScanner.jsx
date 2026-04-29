'use client';

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function CashierBarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const containerId = "cashier-scanner";

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.log("Scanner stop error:", err);
    }
  };

  useEffect(() => {
    let scanner;
  
    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;
  
        const devices = await Html5Qrcode.getCameras();
  
        if (!devices?.length) {
          toast.error("No camera found");
          onClose();
          return;
        }
  
        const backCamera = devices.find((d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("rear") ||
          d.label.toLowerCase().includes("environment")
        );
  
        const cameraId = backCamera?.id || devices[0].id;
  
        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 280, height: 120 },
          },
          async (text) => {
            await stopScanner();
  
            onScan(text);
            onClose();
          }
        );
      } catch (err) {
        console.error("Scanner error:", err);
        toast.error("Camera failed to start");
        onClose();
      }
    };
  
    startScanner();
  
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
  
      {/* scanner viewport */}
      <div
        id={containerId}
        className="w-full h-full max-w-md max-h-[70vh] rounded-lg overflow-hidden"
      />
  
      {/* scan frame */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <div className="w-72 h-40 border-2 border-green-400 rounded-md relative overflow-hidden">
          <div className="scan-line" />
        </div>
      </div>
  
      {/* controls */}
      <div className="absolute bottom-6 flex gap-3">
        <button
          onClick={async () => {
            await stopScanner();
            onClose();
          }}
          className="bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
  
      {/* animation */}
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