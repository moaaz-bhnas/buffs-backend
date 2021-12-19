class ErrorResponse extends Error {
  statusCode: number;
  value: string;
  keyValue: { [key: string]: string };
  code: number;
  errors: object;

  constructor({
    message,
    statusCode,
    code = 0,
    value = "",
    keyValue = {},
    errors = [],
  }: {
    message: string;
    statusCode: number;
    code?: number;
    value?: string;
    keyValue?: { [key: string]: string };
    errors?: object;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.value = value;
    this.keyValue = keyValue;
    this.errors = errors;
  }
}

export default ErrorResponse;
