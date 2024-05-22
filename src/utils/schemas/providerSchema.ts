import { z } from 'zod';
import { userRegistrationSchema } from './userSchemas';
 

export const identifierSchema = z.string().regex(/^[a-z0-9-]+$/, {
  message: 'Invalid identifier. Value must be all lowercase with no spaces, and can include "-" character.',
});

 

 
// provider schemas
export const providerCreateSchema = z.object({
  name: z.string(),
  address: z.string(), 
  identifier: identifierSchema,  
});
 
export const providerByIdentifierSchema = z.object({
  identifier: z.string(), 
});
 

export const providerAdminSchema = userRegistrationSchema.extend({
  providerId: z.string(),
})


 
// branch schemas
export const branchCreateSchema = z.object({
  name: z.string(),
  identifier: identifierSchema,  
  address: z.string(),  
});
  