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
    const startScanner = async () => {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      const devices = await Html5Qrcode.getCameras();

      if (!devices.length) {
        alert("No camera found");
        onClose();
        return;
      }

      const backCamera = devices.find(d =>
        d.label.toLowerCase().includes("back") ||
        d.label.toLowerCase().includes("rear") ||
        d.label.toLowerCase().includes("environment")
      );

      const cameraId = backCamera ? backCamera.id : devices[0].id;

      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 120 },
        },
        async (decodedText) => {
          await stopScanner();

          onScan(decodedText); // send barcode
          onClose();
        }
      );
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

      {/* camera */}
      <div id={containerId} className="w-full h-full" />

      {/* close button */}
      <button
        onClick={async () => {
          await stopScanner();
          onClose();
        }}
        className="absolute bottom-10 bg-red-600 text-white px-5 py-2 rounded"
      >
        Close Scanner
      </button>

    </div>
  );
}