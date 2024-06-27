import bcrypt = require("bcrypt");

import { Branch, Provider, User, UserRole, Cashier } from "@prisma/client";
import db from "../src/lib/db";
const adminEmail = "mkbirhanu@gmail.com";
const adminPassword = "11221122";
const adminFullName = "Mikiyas Birhanu";
const adminLastName = "Birhanu";
const adminPhoneNumber = "0923213768";

async function main() {
  const superAdmin = await addSuperAdmin();
  const provider = await addTestProvider();
  const providerAdmin = await addTestProviderAdmin(provider.id);
  const branch = await addTestProviderBranch(provider.id);
 await addTestCashierFOrBranch(branch.id);

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
      fullName: adminFullName,
      phoneNumber: adminPhoneNumber,
      email: adminEmail,
      role: UserRole.ADMIN,
      password: password,
      userName: "mkbirhanu",
    },
  });
  return user;
};

const addTestProvider = async (): Promise<Provider> => {
  return await db.provider.create({
    data: {
      name: "Apollo Bet",
      address: "Addiss Ababa Bole",
      identifier: "apollo-bet",
    },
  });
};

const addTestProviderAdmin = async (providerId: string): Promise<User> => {
  const password = await bcrypt.hash("jegna@bg", 10);

  return await db.user.create({
    data: {
      fullName: "Jegnaw Bg",
      email: "jegna@bg.com",
      userName: "jegna@bg",
      phoneNumber: "011221122",
      role: UserRole.PROVIDER_ADMIN,
      password,
      providers: {
        connect: {
          id: providerId,
        },
      },
    },
  });
};

const addTestProviderBranch = async (providerId: string): Promise<Branch> => {
  return await db.branch.create({
    data: {
      name: "Apollo Branch 1",
      identifier: "apollo-branch-1",
      address: "Bole Sheger Building",
      providerId,
    },
  });
};

const addTestCashierFOrBranch = async (branchId: string): Promise<Cashier> => {
  const password = await bcrypt.hash("12345678", 10);

  return await db.cashier.create({
    data: {
      fullName: "Cashier Tester",
      phoneNumber: "0909091133",
      branchId,
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
