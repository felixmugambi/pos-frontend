"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const containerId = "barcode-reader";

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
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

            await scanner.stop();
            await scanner.clear();

            onScan(text);
            onClose();
          }
        );
      } catch (err) {
        console.error(err);
        alert("Camera error");
        onClose();
      }
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

      <button
        onClick={onClose}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-600 px-5 py-2 rounded text-white"
      >
        Close
      </button>
    </div>
  );
}