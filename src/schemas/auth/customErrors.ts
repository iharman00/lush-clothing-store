export class PasswordMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordMismatchError";
  }
}

export class InvalidUserSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserSessionError";
  }
}

export class InvalidDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDataError";
  }
}

export class OTPVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OTPVerificationError";
  }
}

export class InvalidOTPRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOTPRequestError";
  }
}
