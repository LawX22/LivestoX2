import { supabase } from "../supabase";
import { AnimalListing } from "../types/listing";

const saveListing = async (listing: AnimalListing) => {
  const { data, error } = await supabase.from("livestock").insert([listing]);

  if (error) {
    console.error("Insert failed:", error);
    throw error;
  }

  return data;
};

const getListingsBySeller = async (sellerId: string, limiter?: number) => {
  let query = supabase
    .from("livestock")
    .select("*")
    .eq("seller_id", sellerId)
    .order("listed_date", { ascending: false });

  if (limiter !== undefined) {
    query = query.limit(limiter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching filtered listings:", error);
    throw error;
  }

  return data;
};

const updateListing = async (
  listingId: number,
  updatedData: Partial<AnimalListing>
) => {
  const { data, error } = await supabase
    .from("livestock")
    .update(updatedData)
    .eq("id", listingId);

  if (error) {
    console.error("Update failed:", error);
    throw error;
  }

  return data;
};

const deleteListing = async (listingId: number) => {
  const { data, error } = await supabase
    .from("livestock")
    .delete()
    .eq("id", listingId);
  if (error) {
    console.error("Delete failed:", error);
    throw error;
  }

  return data;
};

export const livestock = {
  saveListing,
  getListingsBySeller,
  updateListing,
  deleteListing,
};
