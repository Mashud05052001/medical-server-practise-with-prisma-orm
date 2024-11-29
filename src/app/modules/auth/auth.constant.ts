export type TLoginPayload = {
  email: string;
  password: string;
};

export type TChangePassPayload = {
  oldPassword: string;
  newPassword: string;
};

export type TForgotPassword = {
  email: string;
};
export type TResetPassword = TForgotPassword & {
  token: string;
  password: string;
};
