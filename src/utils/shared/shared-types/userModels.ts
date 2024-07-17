import { ActiveStatus, UserRole } from "@prisma/client";
import {  IDBBranch, IDBProvider,  IDBUser } from "./prisma-models";
import { IBranch } from "./providerAndBranch";

export interface ICashier  {
    userName: string
}
 

export interface IUser extends Omit<IDBUser, 'password'> { 

  
  provider?: IDBProvider; 
  agentProvider?: IDBProvider; 
  //: cashier; 
  cashierBranch?: IDBBranch; 
}


export interface IAccount {
  id       : string,
  userId : string,
  branchId : string,
  branch: IBranch
  profile: IUser
}
 
export interface IProviderAdminLoginData extends IUser { 
  provider: IDBProvider;  
}



export interface ILoginUser extends IUser { 
  accessToken:  string,
  refreshToken:  string,
  accessTokenExpires: number
}

export interface IProviderSiteLoginData extends ILoginUser { 
  provider: IDBProvider;    
}


export interface ICashierLoginData extends ILoginUser {
  branch: IBranch;
}

export interface ITokenData {
  accessToken:  string,
  refreshToken:  string,
  accessTokenExpires: number
}
 
export interface IRefreshToken {
    id          :  string;
    hashedToken :  string;
    userId      :  string;
    revoked     : Boolean;
    createdAt   : Date,
    updatedAt   : Date
  }


export type UserWithoutPassword = Omit<IDBUser, 'password'>; 