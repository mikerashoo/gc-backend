import { z } from "zod";
import { identifierSchema } from "../userSchemas";

export const branchCreateSchema = z.object({
    name: z.string(),
    identifier: identifierSchema,  
    address: z.string(),  
  });
    

  export type IBranchCreateSchema = z.infer<typeof branchCreateSchema>; 
