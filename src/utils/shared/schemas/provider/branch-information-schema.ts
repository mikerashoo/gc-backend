import { z } from "zod";  
import { ActiveStatus } from "../../shared-types/prisma-enums";

export const branchCreateSchema = z.object({
    name: z.string(),
    address: z.string(),  
  });
  export type IBranchCreateSchema = z.infer<typeof branchCreateSchema>; 
    
  export const branchUpdateSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),  
    status: z.enum([ActiveStatus.ACTIVE, ActiveStatus.IN_ACTIVE]).nullable().optional()
  });
    
  export type IBranchUpdateSchema = z.infer<typeof branchUpdateSchema>; 

