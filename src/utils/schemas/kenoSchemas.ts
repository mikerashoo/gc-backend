import { number, z } from "zod"; 
import { kenoGameConstants } from "../constants/kenoGameConstants";

const uniqueNumberArray = (array: number[]) => {
  return array.length === new Set(array).size;
};

 
// provider schemas
export const kenoTicketSchema = z.object({
    selectedNumbers: z.array(z.number().min(kenoGameConstants.startNumber).max(kenoGameConstants.endNumber)).min(kenoGameConstants.minNumberOfTicketsToSelect).max(kenoGameConstants.maxNumberOfTicketsToSelect).refine(uniqueNumberArray, {
      message: "Selected numbers must be unique",
    }),
    betAmount: z.number().min(kenoGameConstants.minBetAmount).max(kenoGameConstants.maxBetAmount), 
    winAmount: z.number(),  
  });
    


  export type IKenoTicketCreateData = z.infer<typeof kenoTicketSchema>;