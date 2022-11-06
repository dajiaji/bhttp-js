import * as errors from "./errors.ts";

export class BHttpDecoder {

  private _buf: Uint8Array;
  private _len: number;

  constructor() {
    this._buf = new Uint8Array(0);
    this._cursor = 0;
  }

  public decode(src: Uint8Array): Request | Response {
    this._cursor = 0;
    this._buf = src;

    return new Request("https://example.com");
  }

  private gentLengthOfVariableLengthInteger(v: Uint8Array): number {
    return 0;
  }

  private decodeVariableLengthIntegerAndValue(): string {
    return;
  }
}
