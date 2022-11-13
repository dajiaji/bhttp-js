import * as consts from "./consts.ts";
import * as errors from "./errors.ts";

class EncoderContext {
  public buf: Uint8Array;
  public p = 0;
  public framingIndicator = 0;
  public headerSize: number;
  public body: Uint8Array;

  constructor() {
    this.buf = new Uint8Array(0);
    this.headerSize = 0;
    this.body = new Uint8Array(0);
  }

  protected calculateVliSize(v: number): number {
    if (v < 64) {
      return 1;
    }
    if (v < 16384) {
      return 2;
    }
    if (v < 1073741824) {
      return 4;
    }
    if (v <= Number.MAX_SAFE_INTEGER) {
      return 8;
    }
    throw new errors.NotSupportedError(
      "Over MAX_SAFE_INTEGER length value is not supported.",
    );
  }
}

class RequestEncoderContext extends EncoderContext {
  public request: Request;
  public url: URL;

  constructor(request: Request) {
    super();
    this.request = request;
    this.url = new URL(request.url);
  }

  public async setup() {
    // Load requestBody.
    this.body = new Uint8Array(await this.request.arrayBuffer());
    // Setup the output buffer.
    this.buf = new Uint8Array(this.calculateEncodedRequestSize());
  }

  private calculateEncodedRequestSize(): number {
    let len = 1; // framing indicator

    // Request Control Data
    len += 1; // this.calculateVliSize(src.method.length);
    len += this.request.method.length;
    len += this.calculateVliSize(this.url.protocol.length - 1);
    len += this.url.protocol.length - 1;
    len += this.calculateVliSize(this.url.host.length);
    len += this.url.host.length;
    len += this.calculateVliSize(this.url.pathname.length);
    len += this.url.pathname.length;

    // Known Length Headers
    this.headerSize = 0;
    this.request.headers.forEach((value, key) => {
      this.headerSize += this.calculateVliSize(key.length);
      this.headerSize += key.length;
      this.headerSize += this.calculateVliSize(value.length);
      this.headerSize += value.length;
    });
    len += this.calculateVliSize(this.headerSize);
    len += this.headerSize;

    // Known Length Content
    len += this.calculateVliSize(this.body.byteLength);
    len += this.body.byteLength;

    // Known Length Trailers
    len += 1; // The trailer size = 0;

    // No padding
    return len;
  }
}

class ResponseEncoderContext extends EncoderContext {
  public response: Response;

  constructor(response: Response) {
    super();
    this.response = response;
  }

  public async setup() {
    // Load responseBody.
    this.body = new Uint8Array(await this.response.arrayBuffer());
    // Setup the output buffer.
    this.buf = new Uint8Array(this.calculateEncodedResponseSize());
  }

  private calculateEncodedResponseSize(): number {
    let len = 1; // framing indicator

    // Response Control Data
    len += 2;

    // Known Length Headers
    this.headerSize = 0;
    this.response.headers.forEach((value, key) => {
      this.headerSize += this.calculateVliSize(key.length);
      this.headerSize += key.length;
      this.headerSize += this.calculateVliSize(value.length);
      this.headerSize += value.length;
    });
    len += this.calculateVliSize(this.headerSize);
    len += this.headerSize;

    // Known Length Content
    len += this.calculateVliSize(this.body.byteLength);
    len += this.body.byteLength;

    // Known Length Trailers
    len += 1; // The trailer size = 0;

    // No padding
    return len;
  }
}

export class BHttpEncoder {
  private _te: TextEncoder;

  constructor() {
    this._te = new TextEncoder();
  }

  public async encodeRequest(src: Request): Promise<Uint8Array> {
    // Setup RequestEncoderContext.
    const ctx = new RequestEncoderContext(src);
    await ctx.setup();

    // Do BHTTP encoding.
    return this.encodeKnownLengthRequest(ctx);
  }

  public async encodeResponse(src: Response): Promise<Uint8Array> {
    // Setup RequestEncoderContext.
    const ctx = new ResponseEncoderContext(src);
    await ctx.setup();

    // Do BHTTP encoding.
    return this.encodeKnownLengthResponse(ctx);
  }

  private encodeKnownLengthRequest(ctx: RequestEncoderContext): Uint8Array {
    this.encodeVli(ctx, 0);

    // Request Control Data
    this.encodeVliAndValue(ctx, ctx.request.method);
    this.encodeVliAndValue(
      ctx,
      ctx.url.protocol.slice(0, ctx.url.protocol.length - 1),
    );
    this.encodeVliAndValue(ctx, ctx.url.host);
    this.encodeVliAndValue(ctx, ctx.url.pathname);

    // Known Length Headers
    this.encodeVli(ctx, ctx.headerSize);
    ctx.request.headers.forEach((value, key) => {
      this.encodeVliAndValue(ctx, key);
      this.encodeVliAndValue(ctx, value);
    });

    // Known Length Content
    this.encodeVli(ctx, ctx.body.byteLength);
    ctx.buf.set(ctx.body, ctx.p);
    ctx.p += ctx.body.byteLength;

    // Known Length Trailers
    this.encodeVli(ctx, 0);

    // No padding
    return ctx.buf;
  }

  private encodeKnownLengthResponse(ctx: ResponseEncoderContext): Uint8Array {
    this.encodeVli(ctx, 1);

    // Response Control Data
    this.encodeVli(ctx, ctx.response.status);

    // Known Length Headers
    this.encodeVli(ctx, ctx.headerSize);
    ctx.response.headers.forEach((value, key) => {
      this.encodeVliAndValue(ctx, key);
      this.encodeVliAndValue(ctx, value);
    });

    // Known Length Content
    this.encodeVli(ctx, ctx.body.byteLength);
    ctx.buf.set(ctx.body, ctx.p);
    ctx.p += ctx.body.byteLength;

    // Known Length Trailers
    this.encodeVli(ctx, 0);

    // No padding
    return ctx.buf;
  }

  private encodeVliAndValue(ctx: EncoderContext, v: string) {
    this.encodeVli(ctx, v.length);
    ctx.buf.set(this._te.encode(v), ctx.p);
    ctx.p += v.length;
    return;
  }

  private encodeVli(ctx: EncoderContext, v: number) {
    if (v < 64) {
      ctx.buf[ctx.p++] = consts.VLI_LEN_1 + v;
      return;
    }
    if (v < 16384) {
      ctx.buf[ctx.p++] = consts.VLI_LEN_2 + (v >> 8);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & v;
      return;
    }
    if (v < 1073741824) {
      ctx.buf[ctx.p++] = consts.VLI_LEN_4 + (v >> 24);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & (v >> 16);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & (v >> 8);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & v;
      return;
    }
    if (v <= Number.MAX_SAFE_INTEGER) {
      // ctx.buf[ctx.p++] = consts.VLI_LEN_8 + (v >> 56);
      ctx.buf[ctx.p++] = consts.VLI_LEN_8;
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & (v >> 48);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & (v >> 40);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & (v >> 32);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & (v >> 24);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & (v >> 16);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & (v >> 8);
      ctx.buf[ctx.p++] = consts.VLI_MASK_LSB & v;
      return;
    }
    throw new errors.NotSupportedError(
      "Over MAX_SAFE_INTEGER-length value is not supported.",
    );
  }
}
