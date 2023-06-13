/**
 * The base error class of hpke-js.
 */
declare class BHttpError extends Error {
}
/**
 * Invalid message.
 */
export declare class InvalidMessageError extends BHttpError {
}
/**
 * Not supported data.
 */
export declare class NotSupportedError extends BHttpError {
}
export {};
