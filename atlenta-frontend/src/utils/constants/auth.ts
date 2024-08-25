export const AUTH_SIGN_IN_FORM = [
  { name: "email", label: "Email Address" },
  { name: "password", label: "Password" },
];

export const AUTH_SIGN_UP_FORM = [
  { name: "first_name", label: "First Name" },
  { name: "last_name", label: "Last Name" },
  ...AUTH_SIGN_IN_FORM,
  { name: "confirm_password", label: "Confirm Password" },
];
