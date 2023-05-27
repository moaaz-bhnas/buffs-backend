export interface IUser {
  username: string;
  displayName: string;
  email: string;
  password: string;
  role: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  createdAt?: Date;
}
