import { supabase } from "../supabase";

const getListingsByFarmAndSeller = async (farmId: number, sellerId: string) => {
  const { data, error } = await supabase
    .from("livestock")
    .select("*")
    .eq("farm_id", farmId)
    .eq("seller_id", sellerId)
    .order("listed_date", { ascending: false });

  if (error) {
    console.error("Error fetching filtered listings:", error);
    throw error;
  }

  return data;
};

export const livestock = {
  getListingsByFarmAndSeller,
};
