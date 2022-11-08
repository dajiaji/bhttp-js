export function hexStringToBytes(v: string): Uint8Array {
  if (v.length === 0) {
    return new Uint8Array([]);
  }
  const res = v.match(/[\da-f]{2}/gi);
  if (res == null) {
    throw new Error("Not hex string.");
  }
  return new Uint8Array(res.map(function (h) {
    return parseInt(h, 16);
  }));
}
