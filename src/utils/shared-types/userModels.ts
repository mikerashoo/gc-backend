import { ActiveStatus, UserRole } from "@prisma/client";
import { IDBCashier, IDBUser } from "./prisma-models";
import { IBranch } from "./providerAndBranch";

export interface ICashier  {
    userName: string
}
 

export interface IUser {
  id       : string,
  fullName : string,

  email?    : string,
  userName?   : string,
  phoneNumber    : string,  

  role:        UserRole,
  status:       ActiveStatus,
  createdAt:     Date,
  updatedAt:     Date, 
}


export interface IAccount {
  id       : string,
  userId : string,
  branchId : string,
  branch: IBranch
  profile: IUser
}

export interface ICashierLoginData extends IDBCashier { 
  branch: IBranch; 
  accessToken:  string;
  refreshToken:  string;
  accessTokenExpires: number;
}



export interface ILoginUser extends IAccount { 
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