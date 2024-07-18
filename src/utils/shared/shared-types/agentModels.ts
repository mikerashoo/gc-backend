import { UserRole } from "@prisma/client";
import { IUser } from "./userModels";

export interface ISuperAgentInfo extends IUser {
    agentCount: number,
    branchCount: number,
  }

  
  export interface IUserBasicInformationForRelation {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    role: UserRole
  }



  export interface IAgentWithSuperAgent extends  IUserBasicInformationForRelation{
    superAgent?: IUserBasicInformationForRelation
  }

