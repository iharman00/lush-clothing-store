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

export class InvalidOTPError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOTPError";
  }
}
