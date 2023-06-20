export interface IUser {
  username: string;
  displayName: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  createdAt?: Date;
}
