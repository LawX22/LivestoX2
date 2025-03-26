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

const updateListing = async (listingId: number, updatedData: Partial<AnimalListing>) => {
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

export const livestock = {
    saveListing,
    getListingsByFarmAndSeller,
    updateListing,
};
