"use client";

import { useState, useRef } from "react";
import BarcodeScanner from "@/components/ui/BarcodeScanner";

export default function BarcodePage() {
  const [showScanner, setShowScanner] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);

  // 📸 Capture frame from video
  const captureImage = async () => {
    const video = document.querySelector("video");

    if (!video) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/png");
  };

  const handleScan = async (code) => {
    setBarcode(code);

    // capture image at moment of scan
    const img = await captureImage();
    setCapturedImage(img);

    setShowScanner(false);
  };

  const resetScan = () => {
    setBarcode("");
    setCapturedImage(null);
    setShowScanner(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">

      {/* TITLE */}
      <h1 className="text-xl font-bold mb-6">
        Barcode Scanner Test
      </h1>

      {/* START BUTTON */}
      {!showScanner && !barcode && (
        <button
          onClick={() => setShowScanner(true)}
          className="bg-blue-600 px-5 py-2 rounded"
        >
          Start Scan
        </button>
      )}

      {/* SCANNER */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* RESULT */}
      {barcode && (
        <div className="mt-6 w-full max-w-md bg-gray-900 p-4 rounded-lg">

          <p className="text-green-400 font-semibold">
            Barcode: {barcode}
          </p>

          {/* IMAGE PREVIEW */}
          {capturedImage && (
            <img
              src={capturedImage}
              className="mt-3 rounded border w-full"
            />
          )}

          {/* ACTIONS */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={resetScan}
              className="bg-yellow-600 px-4 py-2 rounded"
            >
              Scan Again
            </button>

            <button
              onClick={() => {
                setBarcode("");
                setCapturedImage(null);
              }}
              className="bg-red-600 px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}