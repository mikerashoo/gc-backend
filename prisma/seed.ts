import bcrypt = require("bcrypt");

import { Branch, Provider, User, UserRole, Cashier, ProviderAdmin, ProviderUserRole } from "@prisma/client";
import db from "../src/lib/db";
const adminEmail = "mkbirhanu@gmail.com";
const adminPassword = "11221122";
const adminFirstName = "Mikiyas";
const adminLastName = "Birhanu";
const adminPhoneNumber = "0923213768";

async function main() {
  const superAdmin = await addSuperAdmin();
  const provider = await addTestProviderAndAdminAdmin(); 
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
          role: ProviderUserRole.SUPER_ADMIN,
          password,
        }
      }
    },
  });
}; 
const addTestProviderBranch = async (providerId: string): Promise<Branch> => {
  return await db.branch.create({
    data: {
      name: "Apollo Branch 1",
      identifier: "apollo-branch-1",
      address: "Bole Sheger Building",
      providerId: providerId,
    },
  });
};

const addTestCashierFOrBranch = async (branchId: string): Promise<Cashier> => {
  const password = await bcrypt.hash("12345678", 10);

  return await db.cashier.create({
    data: {
      firstName: "Bethelihem",
      lastName: "Tekile",
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
