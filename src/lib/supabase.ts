import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const FABRIC_PHOTOS_BUCKET = "fabric-photos";

export async function uploadFabricPhoto(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const path = `${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from(FABRIC_PHOTOS_BUCKET)
    .upload(path, fileBuffer, { contentType, upsert: false });

  if (error) {
    throw new Error(`Failed to upload fabric photo: ${error.message}`);
  }

  const { data } = supabase.storage.from(FABRIC_PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
