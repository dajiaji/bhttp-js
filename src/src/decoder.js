import * as consts from "./consts.js";
import * as errors from "./errors.js";
class InformationalResponse {
    constructor(status) {
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.status = status;
        this.headers = new Headers();
    }
}
class DecoderContext {
    constructor(buf) {
        Object.defineProperty(this, "buf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "p", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "framingIndicator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "content", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "trailers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.buf = buf;
        this.headers = new Headers();
        this.content = new Uint8Array(0);
        this.trailers = new Headers();
    }
}
class RequestDecoderContext extends DecoderContext {
    constructor(buf) {
        super(buf);
        Object.defineProperty(this, "method", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "scheme", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "authority", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
    }
    createRequest() {
        const input = this.scheme + "://" + this.authority + this.path;
        let req;
        if (this.method === "GET" || this.method === "HEAD") {
            req = new Request(input, {
                method: this.method,
            });
        }
        else {
            req = new Request(input, {
                method: this.method,
                body: this.content,
            });
        }
        this.headers.forEach((value, key) => {
            req.headers.set(key, value);
        });
        return req;
    }
}
class ResponseDecoderContext extends DecoderContext {
    constructor(buf) {
        super(buf);
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "informationalResponses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.informationalResponses = new Array(0);
    }
    createResponse() {
        return new Response(this.content, {
            status: this.status,
            headers: this.headers,
        });
    }
}
export class BHttpDecoder {
    constructor() {
        Object.defineProperty(this, "_td", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._td = new TextDecoder();
    }
    decodeRequest(src) {
        const ctx = new RequestDecoderContext(src);
        ctx.framingIndicator = this.decodeVli(ctx);
        switch (ctx.framingIndicator) {
            case 0:
                return this.decodeKnownLengthRequest(ctx);
            case 2:
                return this.decodeIndeterminateLengthRequest(ctx);
            default:
                throw new errors.InvalidMessageError("Invalid framing indicator.");
        }
    }
    decodeResponse(src) {
        const ctx = new ResponseDecoderContext(src);
        ctx.framingIndicator = this.decodeVli(ctx);
        switch (ctx.framingIndicator) {
            case 1:
                return this.decodeKnownLengthResponse(ctx);
            case 3:
                return this.decodeIndeterminateLengthResponse(ctx);
            default:
                throw new errors.InvalidMessageError("Invalid framing indicator.");
        }
    }
    decodeKnownLengthRequest(ctx) {
        this.decodeRequestControlData(ctx);
        this.decodeKnownLengthRequestHeaders(ctx);
        this.decodeKnownLengthContent(ctx);
        this.decodeKnownLengthTrailers(ctx);
        this.checkPadding(ctx);
        return ctx.createRequest();
    }
    decodeIndeterminateLengthRequest(ctx) {
        this.decodeRequestControlData(ctx);
        this.decodeIndeterminateLengthRequestHeaders(ctx);
        this.decodeIndeterminateLengthContent(ctx);
        this.decodeIndeterminateLengthTrailers(ctx);
        this.checkPadding(ctx);
        return ctx.createRequest();
    }
    decodeKnownLengthResponse(ctx) {
        this.decodeKnownLengthInformationalResponsesAndHeaders(ctx);
        this.decodeKnownLengthContent(ctx);
        this.decodeKnownLengthTrailers(ctx);
        this.checkPadding(ctx);
        return ctx.createResponse();
    }
    decodeIndeterminateLengthResponse(ctx) {
        this.decodeIndeterminateLengthInformationalResponsesAndHeaders(ctx);
        this.decodeIndeterminateLengthContent(ctx);
        this.decodeIndeterminateLengthTrailers(ctx);
        this.checkPadding(ctx);
        return ctx.createResponse();
    }
    decodeRequestControlData(ctx) {
        ctx.method = this.decodeVliAndValue(ctx);
        ctx.scheme = this.decodeVliAndValue(ctx);
        ctx.authority = this.decodeVliAndValue(ctx);
        ctx.path = this.decodeVliAndValue(ctx);
        return;
    }
    decodeKnownLengthInformationalResponsesAndHeaders(ctx) {
        let status = this.decodeVli(ctx);
        while (status >= 100 && status < 200) {
            this.decodeKnownLengthInformationalResponse(ctx, status);
            status = this.decodeVli(ctx);
        }
        if (status < 100 && status >= 600) {
            throw new errors.InvalidMessageError("Invalid status code.");
        }
        ctx.status = status;
        this.decodeKnownLengthResponseHeaders(ctx);
        return;
    }
    decodeIndeterminateLengthInformationalResponsesAndHeaders(ctx) {
        let status = this.decodeVli(ctx);
        while (status >= 100 && status < 200) {
            this.decodeIndeterminateLengthInformationalResponse(ctx, status);
            status = this.decodeVli(ctx);
        }
        if (status < 100 && status >= 600) {
            throw new errors.InvalidMessageError("Invalid status code.");
        }
        ctx.status = status;
        this.decodeIndeterminateLengthResponseHeaders(ctx);
        return;
    }
    decodeKnownLengthInformationalResponse(ctx, status) {
        const ir = new InformationalResponse(status);
        const len = this.decodeVli(ctx);
        let name = "";
        let value = "";
        const base = ctx.p;
        while (ctx.p < base + len) {
            name = this.decodeVliAndValue(ctx);
            value = this.decodeVliAndValue(ctx);
            ir.headers.set(name, value);
        }
        ctx.informationalResponses.push(ir);
        return;
    }
    decodeIndeterminateLengthInformationalResponse(ctx, status) {
        const ir = new InformationalResponse(status);
        let name = "";
        let value = "";
        let terminator = this.decodeVli(ctx);
        while (terminator !== 0) {
            ctx.p--;
            name = this.decodeVliAndValue(ctx);
            value = this.decodeVliAndValue(ctx);
            ir.headers.set(name, value);
            terminator = this.decodeVli(ctx);
        }
        ctx.informationalResponses.push(ir);
        return;
    }
    decodeKnownLengthRequestHeaders(ctx) {
        let name = "";
        let value = "";
        const len = this.decodeVli(ctx);
        const base = ctx.p;
        while (ctx.p < base + len) {
            name = this.decodeVliAndValue(ctx);
            value = this.decodeVliAndValue(ctx);
            if (name.localeCompare("host", undefined, { sensitivity: "accent" }) ===
                0 && ctx.authority === "") {
                ctx.authority = value;
            }
            ctx.headers.set(name, value);
        }
        return;
    }
    decodeKnownLengthResponseHeaders(ctx) {
        let name = "";
        let value = "";
        const base = ctx.p;
        const len = this.decodeVli(ctx);
        while (ctx.p < base + len) {
            name = this.decodeVliAndValue(ctx);
            value = this.decodeVliAndValue(ctx);
            ctx.headers.set(name, value);
        }
        return;
    }
    decodeIndeterminateLengthRequestHeaders(ctx) {
        let name = "";
        let value = "";
        let terminator = this.decodeVli(ctx);
        while (terminator !== 0) {
            ctx.p--;
            name = this.decodeVliAndValue(ctx);
            value = this.decodeVliAndValue(ctx);
            if (name.localeCompare("host", undefined, { sensitivity: "accent" }) ===
                0 && ctx.authority === "") {
                ctx.authority = value;
            }
            ctx.headers.set(name, value);
            terminator = this.decodeVli(ctx);
        }
        return;
    }
    decodeIndeterminateLengthResponseHeaders(ctx) {
        let name = "";
        let value = "";
        let terminator = this.decodeVli(ctx);
        while (terminator !== 0) {
            ctx.p--;
            name = this.decodeVliAndValue(ctx);
            value = this.decodeVliAndValue(ctx);
            ctx.headers.set(name, value);
            terminator = this.decodeVli(ctx);
        }
        return;
    }
    decodeKnownLengthContent(ctx) {
        const len = this.decodeVli(ctx);
        // ctx.content = new Uint8Array(ctx.buf, ctx.p, len);
        ctx.content = ctx.buf.slice(ctx.p, ctx.p + len);
        ctx.p += len;
        return;
    }
    decodeIndeterminateLengthContent(ctx) {
        let len = 0;
        const p = ctx.p;
        let terminator = this.decodeVli(ctx);
        while (terminator !== 0) {
            len += terminator;
            ctx.p += terminator;
            terminator = this.decodeVli(ctx);
        }
        if (len === 0) {
            return;
        }
        ctx.p = p;
        ctx.content = new Uint8Array(len);
        len = 0;
        terminator = this.decodeVli(ctx);
        while (terminator !== 0) {
            // ctx.content.set(new Uint8Array(ctx.buf, ctx.p, terminator), len);
            ctx.content.set(ctx.buf.slice(ctx.p, ctx.p + terminator), len);
            len += terminator;
            ctx.p += terminator;
            terminator = this.decodeVli(ctx);
        }
        return;
    }
    decodeKnownLengthTrailers(ctx) {
        const len = this.decodeVli(ctx);
        let name = "";
        let value = "";
        const base = ctx.p;
        while (ctx.p < base + len) {
            name = this.decodeVliAndValue(ctx);
            value = this.decodeVliAndValue(ctx);
            ctx.trailers.set(name, value);
        }
        return;
    }
    decodeIndeterminateLengthTrailers(ctx) {
        let name = "";
        let value = "";
        let terminator = this.decodeVli(ctx);
        while (terminator != 0) {
            ctx.p--;
            name = this.decodeVliAndValue(ctx);
            value = this.decodeVliAndValue(ctx);
            ctx.trailers.set(name, value);
            terminator = this.decodeVli(ctx);
        }
        return;
    }
    checkPadding(ctx) {
        while (ctx.p < ctx.buf.byteLength) {
            if (ctx.buf[ctx.p++] !== 0x00) {
                throw new errors.InvalidMessageError("Invalid padding data.");
            }
        }
        return;
    }
    decodeVliAndValue(ctx) {
        const len = this.decodeVli(ctx);
        // const res = this._td.decode(new Uint8Array(ctx.buf, ctx.p, len));
        const res = this._td.decode(ctx.buf.slice(ctx.p, ctx.p + len));
        ctx.p += len;
        return res;
    }
    decodeVli(ctx) {
        let res = 0;
        switch (ctx.buf[ctx.p] & consts.VLI_MASK_VALUE) {
            case consts.VLI_LEN_1:
                return ctx.buf[ctx.p++] & consts.VLI_MASK_HEADER;
            case consts.VLI_LEN_2:
                res = (ctx.buf[ctx.p++] & consts.VLI_MASK_HEADER) << 8;
                res += ctx.buf[ctx.p++];
                return res;
            case consts.VLI_LEN_4:
                res = (ctx.buf[ctx.p++] & consts.VLI_MASK_HEADER) << 24;
                res += (ctx.buf[ctx.p++] & consts.VLI_MASK_HEADER) << 16;
                res += (ctx.buf[ctx.p++] & consts.VLI_MASK_HEADER) << 8;
                res += ctx.buf[ctx.p++];
                return res;
            default:
                // consts.VLI_LEN_8
                throw new errors.NotSupportedError("8-byte length value is not supported.");
        }
    }
}
