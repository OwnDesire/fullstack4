class CustomExpressError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'CustomExpressError';
  }
}

class CustomValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomValidationError';
  }
}

export { CustomExpressError, CustomValidationError };