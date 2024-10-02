const rampToWarehouses = {
  14: [100, 26, 64],
  15: [88, 162, 25],
  16: [1, 3, 72, 96, 159],
  17: [68, 6],
  18: [8, 2],
  19: [15, 85],
  20: [28, 80, 37, 44, 9],
  21: [94, 113, 168, 103, 22, 153],
  22: [42, 40, 90, 13, 165],
  23: [4],
  24: [163, 55, 62, 76, 105],
  25: [50, 82, 63, 11, 95],
  26: [21, 71, 34],
  27: [32, 93, 89, 16],
  28: [91, 66, 54, 74, 24, 46, 67],
  29: [65, 45, 84, 17, 117],
  30: [36, 112, 5],
  31: [69, 181, 118, 157, 61, 12, 107, 73, 106],
};

export function getRampNumber(warehouseNumber) {
  for (const [key, value] of Object.entries(rampToWarehouses)) {
    if (value.includes(warehouseNumber)) {
      return key;
    }
  }
  return null;
}
