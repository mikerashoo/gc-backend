import { UserRole } from "@prisma/client";
import { ICashierLoginData, IProviderSiteLoginData, ITokenData, IUser } from "../../utils/shared/shared-types/userModels";

export const ProviderRoles = [UserRole.PROVIDER_SUPER_ADMIN, UserRole.PROVIDER_ADMIN]
export const AgentRoles = [UserRole.AGENT, UserRole.SUPER_AGENT]

export const isProvider = (role: UserRole): boolean => {
    return role == UserRole.PROVIDER_SUPER_ADMIN || role == UserRole.PROVIDER_ADMIN;
}

export const getLoginDataBasedOnRole  = async (user: IUser, token: ITokenData) => {

 
    if(isProvider(user.role)){
        delete user.agentProvider;
        delete user.cashierBranch;
        
        const providerLoginData: IProviderSiteLoginData = {
            ...user,
            provider: user.provider ?? null,
            ...token
        }
 
        return providerLoginData
    }
    else if(user.role == UserRole.CASHIER){
        delete user.agentProvider;
        delete user.provider;
        
        const cashierLoginData: ICashierLoginData = {
            ...user, 
            branch: user.cashierBranch ?? null,
            ...token
        }
        return cashierLoginData;
 
    }
    return {
        ...user,
        ...token
    } 
}