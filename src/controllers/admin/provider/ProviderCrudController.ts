import { Request, Response } from "express"; 
import { findProviderWithNameOrIdentifier } from "../../../services/admin/provider-services";
import db from "../../../lib/db";

export const getProviders = async (req: Request, res: Response) => {
  try {
    const providers = await db.provider.findMany({});

    return res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching providers", error);
    return res.status(500).json({ error });
  }
};

export const addProvider = async (req: Request, res: Response) => {
  try {
    const { name, address, identifier } = req.body;

    const isExists = await findProviderWithNameOrIdentifier(name, identifier);
    if (isExists && isExists.name == name) {
      return res.status(403).json({ error: "Provider with same name exists" });
    }

    if (isExists && isExists.identifier == identifier) {
      return res.status(403).json({ error: "Provider with same name exists" });
    }
    const provider = await db.provider.create({
      data: {
        name,
        identifier,
        address,
      },
    });

    return res.status(201).json(provider);
  } catch (error) {
    console.error("Error logging", error);
    return res.status(403).json({ error });
  }
};

export const getProviderDetailByIdentifier = async (
  req: Request,
  res: Response
) => {
  try {
    const identifier  = req.query.identifier.toString();

    const provider = await db.provider.findUnique({
      where: {
         identifier 
      },
      include: {
        admins: true,
      },
    });

    if(!provider){
      return res.status(403).json({ error: "Provider with identifier doesn't exist" });
    }

    return res.status(200).json(provider);
  } catch (error) {
    console.error("Error fetching providers", error);
    return res.status(500).json({ error });
  }
};
