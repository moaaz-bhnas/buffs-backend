class ErrorResponse extends Error {
  statusCode: number;
  value: any;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
