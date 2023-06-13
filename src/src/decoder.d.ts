export declare class BHttpDecoder {
    private _td;
    constructor();
    decodeRequest(src: ArrayBuffer | Uint8Array): Request;
    decodeResponse(src: ArrayBuffer | Uint8Array): Response;
    private decodeKnownLengthRequest;
    private decodeIndeterminateLengthRequest;
    private decodeKnownLengthResponse;
    private decodeIndeterminateLengthResponse;
    private decodeRequestControlData;
    private decodeKnownLengthInformationalResponsesAndHeaders;
    private decodeIndeterminateLengthInformationalResponsesAndHeaders;
    private decodeKnownLengthInformationalResponse;
    private decodeIndeterminateLengthInformationalResponse;
    private decodeKnownLengthRequestHeaders;
    private decodeKnownLengthResponseHeaders;
    private decodeIndeterminateLengthRequestHeaders;
    private decodeIndeterminateLengthResponseHeaders;
    private decodeKnownLengthContent;
    private decodeIndeterminateLengthContent;
    private decodeKnownLengthTrailers;
    private decodeIndeterminateLengthTrailers;
    private checkPadding;
    private decodeVliAndValue;
    private decodeVli;
}
