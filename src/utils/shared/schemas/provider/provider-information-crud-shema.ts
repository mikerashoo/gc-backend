import { z } from "zod";
import { providerUserSchema } from "./provider-users-schema"; 
import { identifierSchema } from "../userSchemas";

// provider schemas
export const providerCreateSchema = providerUserSchema.extend({
    name: z.string(),
    address: z.string(), 
    identifier: identifierSchema,  
  });
  
  export type IProviderCreateSchema = z.infer<typeof providerCreateSchema>; 


