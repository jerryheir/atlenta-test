export interface IAuthFormValues {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  confirm_password?: string;
  [key: string]: string | undefined;
}
