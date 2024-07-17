import { IUser } from "./userModels";

export interface ISuperAgentInfo extends IUser {
    agentCount: number,
    branchCount: number,
  }