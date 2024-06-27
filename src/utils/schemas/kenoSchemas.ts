import { number, string, z } from "zod"; 
import { kenoGameConstants } from "../constants/kenoGameConstants";

const uniqueNumberArray = (array: number[]) => {
  return array.length === new Set(array).size;
};



 
// provider schemas
export const kenoTicketSchema = z.object({
    selectedNumbers: z.array(z.number().min(kenoGameConstants.startNumber).max(kenoGameConstants.endNumber)).min(kenoGameConstants.minNumbersCountPerSlip).max(kenoGameConstants.maxNumbersCountPerSlip).refine(uniqueNumberArray, {
      message: "Selected numbers must be unique",
    }),
    betAmount: z.number().min(kenoGameConstants.minBetAmount).max(kenoGameConstants.maxBetAmount), 
    winAmount: z.number(),  
  });
    
  export const createKenoTicketSchema = z.object({
    selections: z.array(kenoTicketSchema)
  })

  export type IKenoTicketCreateData = z.infer<typeof createKenoTicketSchema>;


  // makePayment
 export const ticketPaymentSchema = z.object({
    paidAmount: z.number().min(0),  
    ticketId: z.string()
  })

  export type ITicketPaymentSchema = z.infer<typeof ticketPaymentSchema>;

  export const ticketIdSchema = z.object({ 
    ticketId: z.string()
  })

  export type ITicketIdSchema = z.infer<typeof ticketIdSchema>;
