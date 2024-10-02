// server.mjs
import express from "express";
import { searchRampByWarehouse } from "./dbqueries.mjs";
import NodeCache from "node-cache";

const app = express();
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/searchRampByWarehouse", async (req, res) => {
  const warehouseNumber = req.query.warehouseNumber;

  if (!warehouseNumber) {
    return res
      .status(400)
      .json({ success: false, error: "Warehouse number is required" });
  }

  const cachedRampNumber = cache.get(warehouseNumber);
  if (cachedRampNumber) {
    return res.json({ success: true, rampNumber: cachedRampNumber });
  }

  try {
    const rampNumber = await searchRampByWarehouse(warehouseNumber);
    if (rampNumber) {
      cache.set(warehouseNumber, rampNumber);
    }
    res.json({ success: true, rampNumber });
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
