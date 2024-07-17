import { equal } from "assert";
import db from "../../lib/db";
import { User } from "@prisma/client";
import ShortUniqueId = require("short-unique-id");

export const generateIdentifierFromName = (name: string): string => {
  return name.trim().toLowerCase().replace(" ", "-");
};

export const checkAndAppendRandomNumber = async (
  columnName: string,
  tableName: string,
  value: string
): Promise<string> => {
  let identifier = value;
  let whereClause = {
    [columnName]: identifier,
  };

  if (await checkDBColumnDuplicate(tableName, whereClause) || value.trim().length <= 5) {
    do {
      const { randomUUID } = new ShortUniqueId({
        length: 4,
        dictionary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      });

      // Concatenate the parts with a hyphen in between
      identifier = `${identifier}-${randomUUID()}`;
      whereClause = {
        [columnName]: identifier,
      };
      console.log("IDentifier generated", identifier);
    } while (await checkDBColumnDuplicate(tableName, whereClause));
  }

  return identifier.trim().toLowerCase().replace(" ", "-");
};

// Define custom function to generate ticket ID with prefix and 10 digits
export async function checkDBColumnDuplicate(
  tableName: string,
  whereClause: any
): Promise<any> {
  // Use Prisma to query the table with the dynamic where clause

   
  const result = await db[tableName].findFirst({
    where: {
      deleted: {},
      ...whereClause},
    
  });

  // If result is not null, the value exists
  return result !== null;
}



// Define custom function to generate ticket ID with prefix and 10 digits
export async function checkUserNameTaken(
  userName: string, 
): Promise<any> {
  // Use Prisma to query the table with the dynamic where clause

   
  const result = await db.user.findFirst({
    where: {
  
      userName: {
        equals: userName.trim(),
        mode: 'insensitive'
      }
    }, 
    
  });

  // If result is not null, the value exists
  return result !== null;
}
