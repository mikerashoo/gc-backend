import bcrypt = require("bcrypt");

import { Shop, Provider, User, UserRole} from "@prisma/client";
import db from "../src/lib/db";
const adminEmail = "mkbirhanu@gmail.com";
const adminPassword = "11221122";
const adminFirstName = "Mikiyas";
const adminLastName = "Birhanu";
const adminPhoneNumber = "0923213768";

async function main() {
  const superAdmin = await addSuperAdmin();
  const provider = await addTestProviderAndAdminAdmin(); 
  const shop = await addTestProviderShop(provider.id);
 await addTestCashierFOrShop(shop.id);

}

const addSuperAdmin = async (): Promise<User> => {
  const password = await bcrypt.hash(adminPassword, 10);

  let user = await db.user.findFirst({
    where: {
      role: UserRole.ADMIN,
    },
  });
  if (user) return user;

  user = await db.user.create({
    data: {
      firstName: adminFirstName,
      lastName: adminLastName,
      phoneNumber: adminPhoneNumber,
      email: adminEmail,
      role: UserRole.ADMIN,
      password: password,
      userName: "mkbirhanu",
    },
  });
  return user;
};

const addTestProviderAndAdminAdmin = async (): Promise<Provider> => {
  const password = await bcrypt.hash("jegna@bg", 10);

  let provider = await db.provider.findFirst({
    where: {
      identifier: "apollo-bet",
    }
  })

  if(provider) return provider

  return await db.provider.create({
    data: {
      name: "Apollo Bet",
      address: "Addiss Ababa Bole",
      identifier: "apollo-bet",
      admins: {
        create: {
          firstName: "Jegnaw",
          lastName: "Birhanu",
          email: "jegna@bg.com",
          userName: "jegna@bg",
          phoneNumber: "011221122",
          role: UserRole.PROVIDER_SUPER_ADMIN,
          password,
        }
      }
    },
  });
}; 
const addTestProviderShop = async (providerId: string): Promise<Shop> => {

  let shop = await db.shop.findFirst({
    where: {
      identifier: "apollo-shop-1",
    }
  })

  if(shop) return shop
  return await db.shop.create({
    data: {
      name: "Apollo Shop 1",
      identifier: "apollo-shop-1",
      address: "Bole Sheger Building",
      providerId: providerId,
    },
  });
};

const addTestCashierFOrShop = async (shopId: string): Promise<User> => {

  let user = await db.user.findFirst({
    where: {
      userName: "cashier@apollo",
    }
  })

  if(user) return user
  const password = await bcrypt.hash("12345678", 10);

  return await db.user.create({
    data: {
      firstName: "Bethelihem",
      lastName: "Tekile",
      phoneNumber: "0909091133", 
       cashierShopId: shopId,
       role: UserRole.CASHIER,
      password,
      userName: "cashier@apollo",
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
