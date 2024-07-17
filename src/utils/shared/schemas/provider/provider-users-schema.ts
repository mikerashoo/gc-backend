import { z } from "zod";
import { commonUserRegisterSchema } from "../userSchemas";
import { ProviderUserRole, UserRole } from "../../shared-types/prisma-enums";
 



  
  export const providerUserSchema = commonUserRegisterSchema.extend({ 
    email: z.string().email(),   
  });
   

  // Create a Zod schema using z.enum
const ProviderUserRoleSchema = z.enum([UserRole.PROVIDER_SUPER_ADMIN, UserRole.PROVIDER_ADMIN]);


  export const providerUserRegistrationSchema = providerUserSchema.extend({ 
    providerId: z.string(),   
    role: ProviderUserRoleSchema,
  });
  

  export type IProviderUserRegistrationSchema = z.infer<typeof providerUserRegistrationSchema>; 
