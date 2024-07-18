import { ActiveStatus, UserRole } from "@prisma/client";
import db from "../../lib/db";
import { IServiceResponse } from "../../utils/api-helpers/serviceResponse";
import {
  checkAndAppendRandomNumber,
  checkDBColumnDuplicate,
  generateIdentifierFromName,
} from "../../utils/api-helpers/unique-identifier-generator";
import {
  IShopCreateSchema,
  IShopUpdateSchema,
} from "../../utils/shared/schemas/provider/shop-information-schema";
import { IDBShop } from "../../utils/shared/shared-types/prisma-models";
import { IShopWithDetail } from "../../utils/shared/shared-types/providerAndShop";
import { getTicketReportsForShops } from "../ticket-report-services";
import ShortUniqueId = require("short-unique-id");

const getProviderShops = async (
  providerId: string,
  agentId?: string
): Promise<IServiceResponse<IShopWithDetail[]>> => {
 

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
  const shops = await db.shop.findMany({
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
    data: shops,
  };
};

const addShop = async (
  providerId: string,
  shopData: IShopCreateSchema
): Promise<IServiceResponse<IShopWithDetail>> => {
  try {
    const { address, name, agentId } = shopData;

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

    const nameAlreadyTaken = await checkDBColumnDuplicate("shop", {
      providerId: providerId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    });
    if (nameAlreadyTaken) {
      return {
        error: "Shop With The Same Name Already Exists",
      };
    }

    let shopIdentifier = generateIdentifierFromName(name);
    let shop = null;
    try {
      shopIdentifier = await checkAndAppendRandomNumber(
        "identifier",
        "shop",
        shopIdentifier
      );

      shop = await db.shop.create({
        data: {
          providerId,
          address,
          identifier: shopIdentifier,
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

      shopIdentifier = `${shopIdentifier}-${randomUUID()}`;

      shop = await db.shop.create({
        data: {
          providerId,
          address,
          identifier: shopIdentifier,
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
      data: shop,
    };
  } catch (error) {
    console.log("Error while adding shop", typeof error);
    return {
      error: "Something went wrong",
    };
  }
};

const validateShops = async (
  providerIds: string[],
  shopIds: string[]
): Promise<IServiceResponse<boolean>> => {
  const shops = await db.shop.findMany({
    where: {
      providerId: {
        in: providerIds,
      },
    },
  });

  let providerShopIds = shops.map((bra) => bra.id);
  const invalidShops = shopIds.filter(
    (bId) => !providerShopIds.includes(bId)
  );

  if (invalidShops.length > 0) {
    return {
      error:
        "Invalid shop ids provided. Invalid are: " +
        invalidShops.toLocaleString(),
    };
  }
  return {
    data: true,
  };
};

const getShopDetailById = async (
  id: string
): Promise<IServiceResponse<IShopWithDetail>> => {
  const shop = await db.shop.findFirst({
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

  if (!shop) {
    return {
      error: "Shop With Id Not Found",
    };
  }

  return {
    data: shop,
  };
};

const updateShop = async (
  shopUpdateData: IShopUpdateSchema,
  shopId: string,
  providerId: string
): Promise<IServiceResponse<IShopWithDetail>> => {
  const { address, name, status } = shopUpdateData;

  if (name) {
    console.log("Name exists", name);
    const nameAlreadyTaken = await checkDBColumnDuplicate("shop", {
      providerId: providerId,
      id: { not: shopId },
      name: {
        equals: name,
        mode: "insensitive",
      },
    });
    console.log("Name exists", nameAlreadyTaken);

    if (nameAlreadyTaken) {
      return {
        error: "Shop With The Same Name Already Exists",
      };
    }
  }

  const shop = await db.shop.update({
    where: { id: shopId },
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
    data: shop,
  };
};

const deleteShop = async (id: string): Promise<IServiceResponse<boolean>> => {
  const deleted = await db.shop.delete({
    where: { id },
  });
  return {
    data: deleted ? true : false,
  };
};

export const ProviderShopService = {
  list: getProviderShops,
  detail: getShopDetailById,
  validateShops: validateShops,
  add: addShop,
  update: updateShop,
  delete: deleteShop,
};
