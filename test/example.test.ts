import { assertEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";

import { BHttpEncoder } from "../src/encoder.ts";
import { BHttpDecoder } from "../src/decoder.ts";

import { hexStringToBytes } from "./utils.ts";

describe("BHttpDecoder/Encoder", () => {
  describe("Decode known-length request and encode it to BHTTP again", () => {
    it("should decode an example Request in RFC9292 properly", async () => {
      const exampleData = hexStringToBytes(
        "0003474554056874747073000a2f6865" +
          "6c6c6f2e747874406c0a757365722d61" +
          "67656e74346375726c2f372e31362e33" +
          "206c69626375726c2f372e31362e3320" +
          "4f70656e53534c2f302e392e376c207a" +
          "6c69622f312e322e3304686f73740f77" +
          "77772e6578616d706c652e636f6d0f61" +
          "63636570742d6c616e67756167650665" +
          "6e2c206d690000",
      );
      const decoder = new BHttpDecoder();
      let req = decoder.decodeRequest(exampleData);

      // assert
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://www.example.com/hello.txt");
      assertEquals(
        req.headers.get("user-agent"),
        "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
      );
      // assertEquals(req.headers.get("host"), "www.example.com");
      assertEquals(req.headers.get("accept-language"), "en, mi");

      const encoder = new BHttpEncoder();
      const encodedReq = await encoder.encodeRequest(req);

      // assertEquals(exampleData, encodedReq);

      req = decoder.decodeRequest(encodedReq);

      // assert
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://www.example.com/hello.txt");
      assertEquals(
        req.headers.get("user-agent"),
        "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
      );
      // assertEquals(req.headers.get("host"), "www.example.com");
      assertEquals(req.headers.get("accept-language"), "en, mi");
    });
  });

  describe("Decode indeterminate-length request and encode it to BHTTP again", () => {
    it("should decode an example Request in RFC9292 properly", async () => {
      const exampleData = hexStringToBytes(
        "0203474554056874747073000a2f6865" +
          "6c6c6f2e7478740a757365722d616765" +
          "6e74346375726c2f372e31362e33206c" +
          "69626375726c2f372e31362e33204f70" +
          "656e53534c2f302e392e376c207a6c69" +
          "622f312e322e3304686f73740f777777" +
          "2e6578616d706c652e636f6d0f616363" +
          "6570742d6c616e677561676506656e2c" +
          "206d6900000000000000000000000000",
      );
      const decoder = new BHttpDecoder();
      let req = decoder.decodeRequest(exampleData);

      // assert
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://www.example.com/hello.txt");
      assertEquals(
        req.headers.get("User-Agent"),
        "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
      );
      // assertEquals(req.headers.get("host"), "www.example.com");
      assertEquals(req.headers.get("accept-language"), "en, mi");

      const encoder = new BHttpEncoder();
      const encodedReq = await encoder.encodeRequest(req);

      // assertEquals(exampleData, encodedReq);

      req = decoder.decodeRequest(encodedReq);

      // assert
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://www.example.com/hello.txt");
      assertEquals(
        req.headers.get("User-Agent"),
        "curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3",
      );
      // assertEquals(req.headers.get("host"), "www.example.com");
      assertEquals(req.headers.get("accept-language"), "en, mi");
    });
  });

  describe("Decode indeterminate-length response and encode it to BHTTP again", () => {
    it("should decode an example Response in RFC9292 properly", async () => {
      const exampleData = hexStringToBytes(
        "0340660772756e6e696e670a22736c65" +
          "657020313522004067046c696e6b233c" +
          "2f7374796c652e6373733e3b2072656c" +
          "3d7072656c6f61643b2061733d737479" +
          "6c65046c696e6b243c2f736372697074" +
          "2e6a733e3b2072656c3d7072656c6f61" +
          "643b2061733d7363726970740040c804" +
          "646174651d4d6f6e2c203237204a756c" +
          "20323030392031323a32383a35332047" +
          "4d540673657276657206417061636865" +
          "0d6c6173742d6d6f6469666965641d57" +
          "65642c203232204a756c203230303920" +
          "31393a31353a353620474d5404657461" +
          "671422333461613338372d642d313536" +
          "3865623030220d6163636570742d7261" +
          "6e6765730562797465730e636f6e7465" +
          "6e742d6c656e67746802353104766172" +
          "790f4163636570742d456e636f64696e" +
          "670c636f6e74656e742d747970650a74" +
          "6578742f706c61696e003348656c6c6f" +
          "20576f726c6421204d7920636f6e7465" +
          "6e7420696e636c756465732061207472" +
          "61696c696e672043524c462e0d0a0000",
      );
      const decoder = new BHttpDecoder();
      let res = decoder.decodeResponse(exampleData);
      // ArrayBuffer is also supported.
      res = decoder.decodeResponse(exampleData.buffer);

      // assert
      assertEquals(res.status, 200);
      assertEquals(res.headers.get("date"), "Mon, 27 Jul 2009 12:28:53 GMT");
      assertEquals(res.headers.get("server"), "Apache");
      assertEquals(
        res.headers.get("Last-Modified"),
        "Wed, 22 Jul 2009 19:15:56 GMT",
      );
      assertEquals(res.headers.get("etag"), '"34aa387-d-1568eb00"');
      assertEquals(res.headers.get("accept-ranges"), "bytes");
      assertEquals(res.headers.get("content-length"), "51");
      assertEquals(res.headers.get("vary"), "Accept-Encoding");
      assertEquals(res.headers.get("content-type"), "text/plain");
      // const td = new TextDecoder();
      // const body = await res.arrayBuffer();
      // assertEquals(
      //   td.decode(new Uint8Array(body)),
      //   "Hello World! My content includes a trailing CRLF.\r\n",
      // );

      const encoder = new BHttpEncoder();
      const encodedRes = await encoder.encodeResponse(res);

      // assertEquals(exampleData, encodedReq);
      res = decoder.decodeResponse(encodedRes);

      // assert
      assertEquals(res.status, 200);
      assertEquals(res.headers.get("date"), "Mon, 27 Jul 2009 12:28:53 GMT");
      assertEquals(res.headers.get("server"), "Apache");
      assertEquals(
        res.headers.get("Last-Modified"),
        "Wed, 22 Jul 2009 19:15:56 GMT",
      );
      assertEquals(res.headers.get("etag"), '"34aa387-d-1568eb00"');
      assertEquals(res.headers.get("accept-ranges"), "bytes");
      assertEquals(res.headers.get("content-length"), "51");
      assertEquals(res.headers.get("vary"), "Accept-Encoding");
      assertEquals(res.headers.get("content-type"), "text/plain");
      const td = new TextDecoder();
      const body = await res.arrayBuffer();
      assertEquals(
        td.decode(new Uint8Array(body)),
        "Hello World! My content includes a trailing CRLF.\r\n",
      );
    });
  });

  describe("Decode known-length response and encode it to BHTTP again", () => {
    it("should decode an example Response in RFC9292 properly", async () => {
      const exampleData = hexStringToBytes(
        "0140c8001d5468697320636f6e74656e" +
          "7420636f6e7461696e732043524c462e" +
          "0d0a0d07747261696c65720474657874",
      );
      const decoder = new BHttpDecoder();
      let res = decoder.decodeResponse(exampleData);

      // assert
      assertEquals(res.status, 200);
      // let trailers = await res.trailer;
      // assertEquals(trailers, undefined);
      // const body = await res.text();
      // assertEquals(body, "This content contains CRLF.\r\n");

      const encoder = new BHttpEncoder();
      const encodedRes = await encoder.encodeResponse(res);

      // assertEquals(exampleData, encodedRes);
      res = decoder.decodeResponse(encodedRes);

      // assert
      assertEquals(res.status, 200);
      // trailers = await res.trailer;
      // assertEquals(trailers, undefined);
      const body = await res.text();
      assertEquals(body, "This content contains CRLF.\r\n");
    });
  });
});
