import { Request, Response } from "express";
import {
  findProviderWithIdentifier, 
} from "../../../services/admin/provider-services";
import db from "../../../lib/db";
import { IProviderCreateSchema } from "../../../utils/shared/schemas/provider/provider-information-crud-shema";
import bcrypt = require("bcrypt");

export const getProviders = async (req: any, res: any) => {
  try {
    const providers = await db.provider.findMany({});

    return res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching providers", error);
    return res.status(500).json({ error });
  }
};

export const addProvider = async (req: any, res: any) => {
  try {
    const { name, address, identifier, email, firstName, lastName, userName, password, phoneNumber } =
      req.body as IProviderCreateSchema; 
      const isExists = await findProviderWithIdentifier(identifier);
      if (isExists) {
        return res
          .status(403)
          .json({ error: "Identifier is taken for provider" });
      }

  let _password = await bcrypt.hash("jegna@bg", 10);

     
    const provider = await db.provider.create({
      data: {
        name,
        address,
        identifier,
        admins: {
          create: {
            firstName,
            lastName,
            email,
            phoneNumber,
            userName,
            password: _password
          }
        }
      },
    });

    return res.status(201).json(provider);
  } catch (error) {
    console.error("Error logging", error);
    return res.status(403).json({ error });
  }
};

export const getProviderDetailByIdentifier = async (req: any, res: any) => {
  try {
    const identifier = req.query.identifier.toString();

    const provider = await db.provider.findUnique({
      where: {
        identifier,
      },
      include: {
        admins: true,
      },
    });

    if (!provider) {
      return res
        .status(403)
        .json({ error: "Provider with identifier doesn't exist" });
    }

    return res.status(200).json(provider);
  } catch (error) {
    console.error("Error fetching providers", error);
    return res.status(500).json({ error });
  }
};
