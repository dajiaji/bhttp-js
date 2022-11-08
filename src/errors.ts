/**
 * The base error class of hpke-js.
 */
class BHttpError extends Error {}

/**
 * Invalid message.
 */
export class InvalidMessageError extends BHttpError {}

/**
 * Not supported data.
 */
export class NotSupportedError extends BHttpError {}
