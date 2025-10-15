// TypeScript interfaces for authentication form values
export interface EmailSignupValues {
  fullName: string;
  email: string;
  password: string;
}

export interface PhoneSignupValues {
  fullName: string;
  phone: string;
  password: string;
}

export interface WhatsappSignupValues {
  fullName: string;
  whatsapp: string;
  password: string;
}

export type SignupFormValues = EmailSignupValues | PhoneSignupValues | WhatsappSignupValues;

export interface EmailLoginValues {
  email: string;
  password: string;
}

export interface PhoneLoginValues {
  phone: string;
  password: string;
}

export interface WhatsappLoginValues {
  whatsapp: string;
  password: string;
}

export type LoginFormValues = EmailLoginValues | PhoneLoginValues | WhatsappLoginValues;

export interface OtpFormValues {
  otp: string;
}

export type AuthMode = "email" | "phone" | "whatsapp";
