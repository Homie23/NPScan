# NPScan 
# Program for manual sorting of oversized parcels

This program is designed for manual sorting of oversized parcels at the sorting warehouse of Novaya Posta. It allows you to scan parcel barcodes, determine the number of the warehouse to which the parcel is going, and get the number of the ramp where the parcel should be delivered.

### Algorithm of the program

1. **Barcode Scanning**: The user presses a button to activate the camera. The program uses the Quagga library to scan the barcode that contains the bill of lading number.
   
2. **Getting the warehouse number**: 
   - After a successful scan, the program calls an API that requests information about the parcel by waybill number.
   - The warehouse number where the parcel is sent is obtained through a request to the Novaya Pochta API.

3. **Find Ramp Number**: 
   - The warehouse number is used to query a database that stores information about ramp numbers in the warehouse.
   - The program returns the number of the ramp to which the parcel should be delivered.

### Technology used

- **Frontend**:
  - **JavaScript**: The main programming language for the program logic.
  - **Quagga**: Library for barcode scanning.
  - **Fetch API**: For making requests to external APIs.

- **Backend**:
  - **Node.js**: The server platform on which the API is implemented.
  - **Express**: A framework for creating the server and handling HTTP requests.
  - **PostgreSQL**: A database management system used to store ramp information.
  - **Node-Cache**: For caching requests, which reduces the load on the database.

# Changes in the Updated [Version 2](https://github.com/Homie23/NPScan/tree/v2)
### Removed Database Interaction
In order to improve data processing speed and reduce response time, database interaction has been removed. This allows for a significant acceleration in the process of obtaining ramp number information.

### Warehouse Search via Object
Now, the information about the correspondences between warehouses and ramps is stored as an object in the object.js file. This object is an associative array where the keys are ramp numbers and the values are arrays of warehouse numbers to which parcels can be sent.

<img src="/images/screenshot.PNG" alt="Screenshot of the app" width="500" />
