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


export const identifierSchema = z.string().regex(/^[a-z0-9-]+$/, {
  message: 'Invalid identifier. Value must be all lowercase with no spaces, and can include "-" character.',
});


export const commonUserRegisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: ethiopianPhoneNumberSchema, 
  userName: z.string(), 
  password: z.string().min(8),
});


export const userRegistrationSchema = commonUserRegisterSchema.extend({ 
  email: z.string().email(), 
});



export const cashierREgisterSchema = commonUserRegisterSchema.extend({ 
  branchId: z.string(), 
});
export type ICashierRegisterSchema = z.infer<typeof cashierREgisterSchema>; 

 


 
export const userLoginSchema = z.object({
  userName: z.string().min(1, {
    message: "Username or phone number required"
  }),
  password: z.string().min(8, {
    message: "Password length must be greater or equal to 8"
  }),
})
export type IUserLoginSchema = z.infer<typeof userLoginSchema>; 
