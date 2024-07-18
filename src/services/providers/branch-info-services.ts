import { ActiveStatus, UserRole } from "@prisma/client";
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
import { IDBBranch } from "../../utils/shared/shared-types/prisma-models";
import { IBranchWithDetail } from "../../utils/shared/shared-types/providerAndBranch";
import { getTicketReportsForBranches } from "../ticket-report-services";
import ShortUniqueId = require("short-unique-id");

const getProviderBranches = async (
  providerId: string,
  agentId?: string
): Promise<IServiceResponse<IBranchWithDetail[]>> => {
 

  const  agentQuery = agentId ? {
    OR: [
      {
        id: agentId ? agentId : {},
      },
      {
        userName: agentId ? agentId : {},
      },

      {
        superAgent: {
          OR: [
            {
              id: agentId ? agentId : {},
            },
            {
              userName: agentId ? agentId : {},
            },
          ],
        },
      },
    ],
  } : undefined
  const branches = await db.branch.findMany({
    where: { providerId,
      agent: agentQuery
     },
     include: {
      agent: {
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
          role: true,
          superAgent: {
            select: {
              id: true,
              role: true,
              userName: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  return {
    data: branches,
  };
};

const addBranch = async (
  providerId: string,
  branchData: IBranchCreateSchema
): Promise<IServiceResponse<IBranchWithDetail>> => {
  try {
    const { address, name, agentId } = branchData;

    if(agentId){
      const validSuperAgent = await db.user.findFirst({
        where: {
          id: agentId,
          agentProviderId: providerId,
          role: {in: [UserRole.SUPER_AGENT, UserRole.AGENT]}
        },
      });
  
      if (!validSuperAgent) {
        return {
          error: "Invalid Agent id", 
        };
      }
    }

    const nameAlreadyTaken = await checkDBColumnDuplicate("branch", {
      providerId: providerId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    });
    if (nameAlreadyTaken) {
      return {
        error: "Branch With The Same Name Already Exists",
      };
    }

    let branchIdentifier = generateIdentifierFromName(name);
    let branch = null;
    try {
      branchIdentifier = await checkAndAppendRandomNumber(
        "identifier",
        "branch",
        branchIdentifier
      );

      branch = await db.branch.create({
        data: {
          providerId,
          address,
          identifier: branchIdentifier,
          name,
          agentId

        },
        include: {
          agent: {
            select: {
              id: true,
              userName: true,
              firstName: true,
              lastName: true,
              superAgent: {
                select: {
                  id: true,
                  userName: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      const { randomUUID } = new ShortUniqueId({
        length: 2,
        dictionary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      });

      branchIdentifier = `${branchIdentifier}-${randomUUID()}`;

      branch = await db.branch.create({
        data: {
          providerId,
          address,
          identifier: branchIdentifier,
          name,
          agentId
        },
        include: {
      agent: {
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
          role: true,
          superAgent: {
            select: {
              id: true,
              role: true,
              userName: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
      });
    }

    return {
      data: branch,
    };
  } catch (error) {
    console.log("Error while adding branch", typeof error);
    return {
      error: "Something went wrong",
    };
  }
};

const validateBranches = async (
  providerIds: string[],
  branchIds: string[]
): Promise<IServiceResponse<boolean>> => {
  const branches = await db.branch.findMany({
    where: {
      providerId: {
        in: providerIds,
      },
    },
  });

  let providerBranchIds = branches.map((bra) => bra.id);
  const invalidBranches = branchIds.filter(
    (bId) => !providerBranchIds.includes(bId)
  );

  if (invalidBranches.length > 0) {
    return {
      error:
        "Invalid branch ids provided. Invalid are: " +
        invalidBranches.toLocaleString(),
    };
  }
  return {
    data: true,
  };
};

const getBranchDetailById = async (
  id: string
): Promise<IServiceResponse<IBranchWithDetail>> => {
  const branch = await db.branch.findFirst({
    where: {
      OR: [{ id }, { identifier: id }],
    },
    include: {
      agent: {
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
          role: true,
          superAgent: {
            select: {
              id: true,
              role: true,
              userName: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!branch) {
    return {
      error: "Branch With Id Not Found",
    };
  }

  return {
    data: branch,
  };
};

const updateBranch = async (
  branchUpdateData: IBranchUpdateSchema,
  branchId: string,
  providerId: string
): Promise<IServiceResponse<IBranchWithDetail>> => {
  const { address, name, status } = branchUpdateData;

  if (name) {
    console.log("Name exists", name);
    const nameAlreadyTaken = await checkDBColumnDuplicate("branch", {
      providerId: providerId,
      id: { not: branchId },
      name: {
        equals: name,
        mode: "insensitive",
      },
    });
    console.log("Name exists", nameAlreadyTaken);

    if (nameAlreadyTaken) {
      return {
        error: "Branch With The Same Name Already Exists",
      };
    }
  }

  const branch = await db.branch.update({
    where: { id: branchId },
    data: {
      address,
      name,
      status: status,
    },
    include: {
      agent: {
        select: {
          id: true,
          userName: true,
          firstName: true,
          lastName: true,
          role: true,
          superAgent: {
            select: {
              id: true,
              role: true,
              userName: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
  return {
    data: branch,
  };
};

const deleteBranch = async (id: string): Promise<IServiceResponse<boolean>> => {
  const deleted = await db.branch.delete({
    where: { id },
  });
  return {
    data: deleted ? true : false,
  };
};

export const ProviderBranchService = {
  list: getProviderBranches,
  detail: getBranchDetailById,
  validateBranches: validateBranches,
  add: addBranch,
  update: updateBranch,
  delete: deleteBranch,
};
