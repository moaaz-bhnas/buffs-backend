class ErrorResponse extends Error {
  statusCode: number;
  value: string;
  keyValue: { [key: string]: string };
  code: number;

  constructor({
    message,
    statusCode,
    code = 0,
    value = "",
    keyValue = {},
  }: {
    message: string;
    statusCode: number;
    code?: number;
    value?: string;
    keyValue?: { [key: string]: string };
  }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.value = value;
    this.keyValue = keyValue;
  }
}

export default ErrorResponse;
