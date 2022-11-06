import * as errors from "./errors.ts";

export class BHttpEncoder {

  private _buf: Uint8Array;
  private _len: number;

  constructor() {
    this._buf = new Uint8Array(0);
    this._len = 0;
  }

  public encode(src: Request | Response, isKnownLength: boolean = true): Uint8Array {

    // Calculate the output length.
    this.prepare(src);

    // Do BHTTP encoding.
    return this._buf;
  }

  private prepare(src: Request | Response) {
    this._len = 0;
    this._buf = new Uint8Array(this._len)
    return;
  }

  private gentLengthOfVariableLengthInteger(v: string): number {
    return 0;
  }

  private encodeVariableLengthIntegerAndValue(v: string) {
    return;
  }
}
