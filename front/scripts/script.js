import Quagga from "@ericblade/quagga2";
import { getRampNumbers } from "./api.js";

document.getElementById("btn").addEventListener("click", async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const cameraDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    const cameraDevice = cameraDevices.length > 3 ? cameraDevices[3] : null;

    if (!cameraDevice) {
      console.error("No suitable camera device found.");
      return;
    }

    initializeQuagga(cameraDevice.deviceId);
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
});

function initializeQuagga(deviceId) {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#scanner-container"),
        constraints: {
          deviceId: deviceId,
          facingMode: "environment",
        },
      },
      decoder: {
        readers: ["code_128_reader"],
      },
    },
    (err) => {
      if (err) {
        console.error("Quagga initialization failed:", err);
        return;
      }
      Quagga.start();
    }
  );
}

const scannedBarcodes = new Set();
Quagga.onDetected(async (result) => {
  const invoiceNumber = result.codeResult.code;

  if (scannedBarcodes.has(invoiceNumber)) {
    return;
  }
  scannedBarcodes.add(invoiceNumber);

  console.log("Scanned barcode:", invoiceNumber);

  try {
    const rampNumbers = await getRampNumbers(invoiceNumber);

    requestAnimationFrame(() => {
      document.getElementById("barcode-info").innerHTML = `
        <p>Номер накладной: ${invoiceNumber}</p>
        <p>Номер рампы: ${rampNumbers}</p>
      `;
    });
  } catch (error) {
    console.error("Error processing barcode:", error);
  }
});
