import { supabase } from "../../supabase";

const getFarmerData = async (sellerId: string) => {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .eq("user_id", sellerId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching farms info:", error);
    throw error;
  }

  return data;
};

export const farmers = {
  getFarmerData,
};
