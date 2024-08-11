import { BHttpDecoder, BHttpEncoder } from "@dajiaji/bhttp";

const req = new Request("https://www.example.com/hello.txt", {
  method: "GET",
  headers: {
    "User-Agent": "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
    "Accept-Language": "en, mi",
  },
});

// Encode a Request object to a BHTTP binary string.
const encoder = new BHttpEncoder();
const binReq = await encoder.encodeRequest(req);

// Decode the BHTTP binary string to a Request object.
const decoder = new BHttpDecoder();
const decodedReq = decoder.decodeRequest(binReq);

console.log(decodedReq);
