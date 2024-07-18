import { ActiveStatus } from "@prisma/client";
import { IDBBranch } from "./prisma-models";
import {  ICashier } from "./userModels";
import { ICashierReport } from "./gameModels";
import { IAgentWithSuperAgent } from "./agentModels";

 

 
// providers
export interface IProvider {
    id       :string;
    name: string;
    identifier : string;
    address: string;
   
    status:        ActiveStatus;
    createdAt     :Date;
    updatedAt     :Date;         
  }
  
  // branch
  export interface IBranch {
    id       :string;
    identifier : string;
    name: string; 
    address: string;
    providerId:      string
  
   
    status:       ActiveStatus;
    createdAt     :Date;
    updatedAt     :Date;         
   
  }


  export interface IBranchWithDetail extends IDBBranch { 
    agent: IAgentWithSuperAgent
   
  }
 