import { ActiveStatus, UserRole } from "@prisma/client";
import {  IDBShop, IDBProvider,  IDBUser } from "./prisma-models";  
import { IShop } from "./providerAndShop";
export interface ICashier  {
    userName: string
}
 

export interface IUser extends Omit<IDBUser, 'password'> { 

  
  provider?: IDBProvider; 
  agentProvider?: IDBProvider; 
  //: cashier; 
  cashierShop?: IDBShop; 
}


export interface IAccount {
  id       : string,
  userId : string,
  shopId : string,
  shop: IShop,
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
  shop: IShop;
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