const warehouseCache = new Map();

async function packageInfo(scannedBarcode) {
  try {
    if (warehouseCache.has(scannedBarcode)) {
      console.log(
        "Warehouse number from cache:",
        warehouseCache.get(scannedBarcode)
      );
      return warehouseCache.get(scannedBarcode);
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

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    const rampNumbers = data.data[0].WarehouseRecipientNumber;

    warehouseCache.set(scannedBarcode, rampNumbers);
    console.log("Warehouse number:", rampNumbers);
    return rampNumbers;
  } catch (error) {
    console.error("Error fetching package info:", error);
    throw error;
  }
}

export async function getRampNumbers(scannedBarcode) {
  try {
    const trimmedInvoiceNumber = trimInvoiceNumber(scannedBarcode);
    const warehouseNumber = await packageInfo(trimmedInvoiceNumber);
    console.log("Warehouse number:", warehouseNumber);

    const response = await fetch(
      `https://npbarc-backend.vercel.app/searchRampByWarehouse?warehouseNumber=${warehouseNumber}`
    );
    const data = await response.json();

    if (data.success) {
      console.log("Ramp number:", data.rampNumber);
      return data.rampNumber;
    } else {
      throw new Error(`Server error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error fetching ramp numbers:", error);
    throw error;
  }
}

function trimInvoiceNumber(invoiceNumber) {
  return invoiceNumber.length > 14 ? invoiceNumber.slice(0, -4) : invoiceNumber;
}
