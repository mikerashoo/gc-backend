import { ActiveStatus } from "@prisma/client";
import db from "../../lib/db";
import { IServiceResponse } from "../../utils/api-helpers/serviceResponse";
import {
  checkAndAppendRandomNumber,
  checkDBColumnDuplicate,
  generateIdentifierFromName,
} from "../../utils/api-helpers/unique-identifier-generator";
import {
  IBranchCreateSchema,
  IBranchUpdateSchema,
} from "../../utils/shared/schemas/provider/branch-information-schema";
import {
  IDBBranch,
  IDBCashier,
} from "../../utils/shared/shared-types/prisma-models";
import { IBranchWithDetail } from "../../utils/shared/shared-types/providerAndBranch";
import { getTicketReportsForBranches } from "../ticket-report-services";
import ShortUniqueId = require("short-unique-id");
import { ICashierRegisterSchema, ICashierUpdateSchema } from "../../utils/shared/schemas/userSchemas";
import bcrypt = require("bcrypt");

const getBranchCashier = async (
  branchId: string
): Promise<IServiceResponse<IDBCashier[]>> => {
  const cashiers = await db.cashier.findMany({
    where: {
      branchId,
    },
  });

  return {
    data: cashiers,
  };
};

const validateCashiers = async (
  providerIds: string[],
  cashierIds: string[]
): Promise<IServiceResponse<boolean>> => {
  const validCashiers = await db.cashier.findMany({
    where: {
      branch: {  
        providerId: {
          in: providerIds
        },
      },
    },
    select: {
      id: true,
    },
  });

  // Extract valid cashier IDs from the result
  const validCashierIds = new Set(validCashiers.map((cashier) => cashier.id));

  // Step 2: Filter out invalid cashier IDs
  const invalidCashierIds = cashierIds.filter(
    (cashierId) => !validCashierIds.has(cashierId)
  );

  if (invalidCashierIds.length > 0) {
    return {
      error:
        "Invalid cashier ids provided. Invalid cashiers are: " +
        invalidCashierIds.toLocaleString(),
    };
  }

  return {
    data: true,
  };
};

const addCashier = async (
  branchId: string,
  cashierInfo: ICashierRegisterSchema
): Promise<IServiceResponse<IDBCashier>> => {
  try {
    const { firstName, lastName, password, phoneNumber, userName } =
      cashierInfo;

    const userNameTaken = await checkDBColumnDuplicate("cashier", {
      userName: {
        equals: userName.trim(),
        mode: "insensitive",
      },
    });
    if (userNameTaken) {
      return {
        error: "User Name is already Taken Please Use another and try again",
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const cashier = await db.cashier.create({
      data: {
        branchId,
        firstName,
        lastName,
        password: hashedPassword,
        userName,
        phoneNumber,
      },
    });

    return {
      data: cashier,
    };
  } catch (error) {
    console.log("Error while adding branch",  error);
    return {
      error: "Something went wrong",
    };
  }
};

const getBranchDetailById = async (
  id: string,
  start?: any,
  end?: any
): Promise<IServiceResponse<IBranchWithDetail>> => {
  const branch = await db.branch.findFirst({
    where: {
      OR: [{ id }, { identifier: id }],
    },
  });

  if (!branch) {
    return {
      error: "Branch With Id Not Found",
    };
  }
  let cashiers = await db.cashier.findMany({
    where: {
      branchId: id,
    },
  });
  cashiers.forEach((cashier) => {
    delete cashier.password;
  });

  const report = await getTicketReportsForBranches([id], { start, end });

  const data = {
    ...branch,
    cashiers,
    report,
  };

  return {
    data,
  };
};

const updateCashier = async (
  cashierId: string,
  cashierUpdateData: ICashierUpdateSchema, 

): Promise<IServiceResponse<IDBCashier>> => {
  const {firstName, lastName, phoneNumber, userName } = cashierUpdateData;
  
 
  const userNameTaken = await checkDBColumnDuplicate("cashier", {
    
    id: { not: cashierId },

    userName: {
      equals: userName.trim(),
      mode: "insensitive",
    },
    
  });
  if (userNameTaken) {
    return {
      error: "User Name is already Taken Please Use another and try again",
    };
  }
  const cashier = await db.cashier.update({
    where: { 
      
      id: cashierId
     },
    data: {
       firstName,
       lastName,
       phoneNumber,
       userName
    },
  });
  delete cashier.password;
  return {
    data: cashier,
  };
};

const deleteCashier = async (
  id: string,
  branchId
): Promise<IServiceResponse<boolean>> => {
  const deleted = await db.cashier.delete({
    where: {
      id,

      branchId,
    },
  });
  return {
    data: deleted ? true : false,
  };
};

export const ProviderBranchCashierService = {
  list: getBranchCashier,
  detail: getBranchDetailById,
  add: addCashier,
  validate: validateCashiers,
  update: updateCashier,
  delete: deleteCashier,
};
