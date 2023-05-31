export interface IUserMethods {
  getSignedJwtToken(): string;
  matchPassword(password: string): Promise<boolean>;
  getResetPasswordToken(): string;
}
