import { ActiveStatus } from "@prisma/client";
import { IDBBranch, IDBCashier } from "./prisma-models";
import { CashierWithoutPassword, ICashier } from "./userModels";
import { ICashierReport } from "./gameModels";

 

 
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
    cashiers: IDBCashier[],
    report: ICashierReport
   
  }