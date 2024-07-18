import { ProviderShopService } from "../../services/providers/shop-info-services";
import { ProviderTicketReportService } from "../../services/providers/provider-ticket-report-service";


export const getProviderShops = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;
    const agentId = req.payload.queryAgentId;
    console.log("Agent id", agentId)
    

    const shopList = await ProviderShopService.list(providerId, agentId);
    if(shopList.error){
      return res.status(403).json({ error:shopList.error });

    }

    return res.status(200).json(shopList.data);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
  }
};



export const addShop = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;

    const addShopService = await ProviderShopService.add(providerId, req.body);
    if(addShopService.error){
      return res.status(403).json({ error:addShopService.error });

    } 

    return res.status(200).json(addShopService.data);
  } catch (error) {
    console.error("Error fetching 1", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
  }
};

export const getShopDetail = async (req: any, res: any) => {
  try {
    const shopId = req.params.shopId; 
    const shop = await ProviderShopService.detail(shopId);
    if (shop.error) {
      return res.status(403).json({ error: shop.error});
    } 

    
    return res.status(200).json(shop.data);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
  }
};

export const getShopReports = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId; 
     
    const shop = await ProviderTicketReportService.cashReport(providerId, req.query);
    if (shop.error) {
      return res.status(403).json({ error: shop.error});
    } 

    
    return res.status(200).json(shop.data);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
  }
};


export const updateShop = async (req: any, res: any) => {
  try {
    const providerId = req.payload.providerId;
    const shopId = req.params.shopId;
    const shop = await ProviderShopService.update(req.body, shopId, providerId);
    if (shop.error) {
      return res.status(403).json({ error: shop.error});
    } 
    return res.status(200).json(shop.data);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to fetch shops" });
  }
};


export const deleteShop = async (req: any, res: any) => {
  try { 
    const shopId = req.params.shopId;
    const shop = await ProviderShopService.delete( shopId);
    if (shop.error) {
      return res.status(403).json({ error: shop.error});
    } 
    return res.status(200).json(shop);
  } catch (error) {
    console.error("Error fetching shops", error);
    return res.status(500).json({ error: "Failed to dele shops" });
  }
};



 