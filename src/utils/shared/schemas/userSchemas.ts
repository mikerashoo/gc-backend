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
 
const baseNameSchema = z.string()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name must not exceed 50 characters");

// First name schema
const firstNameSchema = baseNameSchema.regex(/^[A-Za-z]+$/, "First name must contain only letters and no spaces");

// Last name schema (allows hyphens for compound last names)
const lastNameSchema = baseNameSchema.regex(/^[A-Za-z]+(-[A-Za-z]+)*$/, "Last name must contain only letters, and optionally one hyphen");

// Username schema (allows letters, numbers, underscores, and hyphens)
const userNameSchema = z.string()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username must not exceed 30 characters")
  .regex(/^[A-Za-z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens");
 

export const commonUserRegisterSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phoneNumber: ethiopianPhoneNumberSchema, 
  userName: userNameSchema, 
  password: z.string().min(8),
  email: z.string().email().optional().nullable(),
});

export const superAgentRegistrationSchema = commonUserRegisterSchema.extend({})


export type ISuperAgentRegisterSchema = z.infer<typeof superAgentRegistrationSchema>; 


export const userUpdateSchema = z.object({ 
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phoneNumber: ethiopianPhoneNumberSchema, 
  userName: userNameSchema, 
});

export type IUserUpdateSchema = z.infer<typeof userUpdateSchema>; 


export const userRegistrationSchema = commonUserRegisterSchema.extend({ 
  email: z.string().email(), 
});


export const changePasswordSchema = z.object({  
  password: z.string().min(8),
});

export type IChangePasswordSchema = z.infer<typeof changePasswordSchema>; 

export const cashierUpdateSchema = z.object({ 
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phoneNumber: ethiopianPhoneNumberSchema, 
  userName: userNameSchema, 
});

export type ICashierUpdateSchema = z.infer<typeof cashierUpdateSchema>; 



export const cashierREgisterSchema = commonUserRegisterSchema.extend({ 
  // branchId: z.string(), 
});
export type ICashierRegisterSchema = z.infer<typeof cashierREgisterSchema>; 

 


 
export const userLoginSchema = z.object({
  userName: z.string().min(1, {
    message: "Username is required"
  }),
  password: z.string().min(8, {
    message: "Password length must be greater or equal to 8"
  }),
})
export type IUserLoginSchema = z.infer<typeof userLoginSchema>; 
