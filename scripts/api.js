import { getRampNumber } from "./object.js";

const warehouseCache = {};

export async function packageInfo(scannedBarcode) {
  try {
    if (warehouseCache[scannedBarcode]) {
      console.log(
        "Warehouse number from cache:",
        warehouseCache[scannedBarcode]
      );
      return warehouseCache[scannedBarcode];
    }

    const params = {
      apiKey: "",
      modelName: "TrackingDocument",
      calledMethod: "getStatusDocuments",
      methodProperties: {
        Documents: [{ DocumentNumber: scannedBarcode }],
        Language: "UA",
      },
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    };

    const response = await fetch(
      "https://api.novaposhta.ua/v2.0/json/",
      requestOptions
    );
    if (!response.ok) throw new Error("Error: " + response.status);

    const data = await response.json();
    const rampNumbers = data.data[0].WarehouseRecipientNumber;

    warehouseCache[scannedBarcode] = rampNumbers;
    return rampNumbers;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getRampNumbers(scannedBarcode) {
  const trimmedInvoiceNumber = trimInvoiceNumber(scannedBarcode);
  const warehouseNumber = await packageInfo(trimmedInvoiceNumber);
  return getRampNumber(warehouseNumber);
}

function trimInvoiceNumber(invoiceNumber) {
  return invoiceNumber.length > 14 ? invoiceNumber.slice(0, -4) : invoiceNumber;
}
