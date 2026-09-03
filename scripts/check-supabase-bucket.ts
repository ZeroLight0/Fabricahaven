import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

async function main() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError);
    process.exit(1);
  }

  console.log("Existing buckets:", buckets.map((b) => `${b.name} (public: ${b.public})`));

  const exists = buckets.some((b) => b.name === "fabric-photos");
  if (exists) {
    console.log("fabric-photos bucket already exists.");
    return;
  }

  console.log("fabric-photos bucket does NOT exist. Creating it...");
  const { error: createError } = await supabase.storage.createBucket("fabric-photos", {
    public: true,
    fileSizeLimit: "10MB",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (createError) {
    console.error("Failed to create bucket:", createError);
    process.exit(1);
  }

  console.log("fabric-photos bucket created successfully.");
}

main();
