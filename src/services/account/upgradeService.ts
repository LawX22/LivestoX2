import { supabase } from "../../supabase";

export const upgradeUserAccount = async (
  fullName: string | undefined,
  email: string | undefined,
  phoneNumber: string | undefined,
  farmName: string | undefined,
  farmType: string | undefined,
  farmLocation: string | undefined,
  farmDescription: string | undefined,
  livestockTypes: string | undefined,
  farmCertifications: string | undefined,
  farmDocumentations: string | undefined,
): Promise<{ success: boolean; error?: string }> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "User not found or not logged in." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      role: "Farmer",
    },
  });

  if (updateError) {
    return { success: false, error: "Failed to update user profile." };
  }

  const { error: upsertError } = await supabase.from("farms").upsert(
    [
      {
        user_id: user.id,
        owner_name: fullName,
        email,
        phone_number: phoneNumber,
        farm_name: farmName,
        farm_type: farmType,
        location: farmLocation,
        description: farmDescription,
        livestock_types: livestockTypes,
        certifications: farmCertifications,
        documentation: farmDocumentations,
      },
    ],
    { onConflict: "user_id" }
  );

  if (upsertError) {
    return { success: false, error: "Failed to save farm information." };
  }

  return { success: true };
};
