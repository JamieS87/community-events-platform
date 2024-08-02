import { createClient } from "../supabase/client";

export const uploadEventThumbnail = async (
  file: File,
  upsert: boolean = true
) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("event-thumbnails")
    .upload(file.name, file, { upsert });
  if (error) {
    throw error;
  }

  return data;
};
