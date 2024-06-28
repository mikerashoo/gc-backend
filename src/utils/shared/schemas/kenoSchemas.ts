import {  z } from "zod";  
 
// provider schemas
export const kenoTicketSchema = z.object({ 
    selectedNumbers: z.array(z.number()),
    betAmount: z.number(), 
    winAmount: z.number(),   
  });

  // provider schemas
export const kenoTicketCreateSchema = z.object({ 
  selections: z.array(kenoTicketSchema)
});
    
export type IKenoTicketCreateData = z.infer<typeof kenoTicketCreateSchema>;

export const ticketByIdSchema = z.object({
  ticketId: z.string(),   
})

export type ITicketByIdSchema = z.infer<typeof ticketByIdSchema>;


  // makePayment
 export const ticketPaymentSchema = ticketByIdSchema.extend({
    paidAmount: z.number().min(0),   
  })

  export type ITicketPaymentSchema = z.infer<typeof ticketPaymentSchema>;
