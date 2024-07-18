import { z } from "zod";  
import { ActiveStatus } from "../../shared-types/prisma-enums";

export const shopCreateSchema = z.object({
    name: z.string(),
    address: z.string(),  
    agentId: z.string().nullable().optional(),

  });
  export type IShopCreateSchema = z.infer<typeof shopCreateSchema>; 
    
  export const shopUpdateSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),  
    status: z.enum([ActiveStatus.ACTIVE, ActiveStatus.IN_ACTIVE]).nullable().optional(),
    agentId: z.string().nullable().optional(),

  });
    
  export type IShopUpdateSchema = z.infer<typeof shopUpdateSchema>; 

