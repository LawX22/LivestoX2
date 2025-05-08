import { supabase } from "../supabaseClient";

export const upload = async (file: File, filePath: string): Promise<string | null> => {
    try {
        const { error } = await supabase.storage
          .from('assets')
          .upload(filePath, file, { upsert: true });

        if (error) {
            throw new Error(error.message);
        }
        
        const { data, error: urlError } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        if (urlError) {
            throw new Error(urlError.message);
        }

        return data?.publicUrl || null;

    } catch (err: any) {
        console.error("Upload Error:", err.message);
        throw new Error("There was an issue uploading the file.");
    }
};