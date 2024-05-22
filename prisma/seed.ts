import bcrypt = require('bcrypt');
 
import { PrismaClient, UserRole } from '@prisma/client' 

const prisma = new PrismaClient()
const adminEmail = "mkbirhanu@gmail.com";
  const adminPassword = "11221122";
  const adminFullName = "Mikiyas Birhanu";
  const adminLastName = "Birhanu";
  const adminPhoneNumber = "0923213768";
   
async function main() {
  console.log(`Start seeding ...`)
  const password = await bcrypt.hash(adminPassword, 10);
  
    const user = await prisma.user.create({
      data: {
        fullName: adminFullName, 
        phoneNumber: adminPhoneNumber,
        email: adminEmail,
        role: UserRole.ADMIN,
        password: password,
        userName: 'mkbirhanu'
      },
    })
    console.log(`Created user with id: ${user.id}`)
   
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 