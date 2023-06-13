export declare class BHttpEncoder {
    private _te;
    constructor();
    encodeRequest(src: Request): Promise<Uint8Array>;
    encodeResponse(src: Response): Promise<Uint8Array>;
    private encodeKnownLengthRequest;
    private encodeKnownLengthResponse;
    private encodeVliAndValue;
    private encodeVli;
}
