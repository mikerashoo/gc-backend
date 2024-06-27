import { Request, Response } from "express";  
import db from "../../lib/db";


export const getProviderBranches = async (req: any, res: any) => {
  try {
    const providerId = req.params.providerId;

    const branches = await db.branch.findMany({
      where: {
        providerId
      },
       
    });

    return res.status(200).json(branches);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};



export const addBranch = async (req: any, res: any) => {
  try {
    const providerId = req.params.providerId;

    const {name, address, identifier} = req.body;


    const branchExists = await db.branch.findFirst({
      where: {
        name 
      }
    });

    if(branchExists){
      return res.status(403).json({ error: "Branch with the same name already exists" });
    }

    const branch = await db.branch.create({
      data: {
        
        name, 
        identifier,
        address,
        providerId
      }
    })

    return res.status(200).json(branch);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};

export const getBranchDetail = async (req: any, res: any) => {
  try {
    const branchId = req.payload.branchId;

    const branch = await db.branch.findUnique({
      where: {
        id: branchId
      },
       include: {
        cashiers: true
       }
    });

    return res.status(200).json(branch);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};



 