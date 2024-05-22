import { z } from 'zod';
 

// Regular expressions for Ethiopian phone numbers
const ethiopianPhoneNumberRegExp = /^(09|\+2519)\d{8}$/;
 


export const ethiopianPhoneNumberSchema = z.string().regex(
  ethiopianPhoneNumberRegExp,
  {
    message:
      'Invalid Ethiopian phone number format. It should start with "09" or "+2519" followed by 8 digits',
  }
); 
export const userRegistrationSchema = z.object({
  fullName: z.string(),
  phoneNumber: ethiopianPhoneNumberSchema, 
  userName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const userLoginSchema = z.object({
    userName: z.string().min(1, {
      message: "Username or phone number required"
    }),
  password: z.string().min(8),
})



export const cashierLoginSchema = userLoginSchema.extend({
  branchIdentifier: z.string(), 
})