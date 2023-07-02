export interface IUser {
  username: string;
  displayName: string;
  email: string;
  password: string;
  role: string;
  /**
   * Created by a Mongoose middleware before save
   */
  avatar: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  createdAt?: Date;
}
