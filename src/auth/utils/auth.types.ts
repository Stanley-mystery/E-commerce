export class SignUpUserParams {
  name: string;
  email: string;
  password: string;
}

export class SiginUserParams {
  email: string;
  password: string;
}

export class ChangePasswordParams {
  oldPassword: string;
  email: string;
  newPassword: string;
  otp: string;
}

export class PasswordResetParams {
  email: string;
  newPassword: string;
}
