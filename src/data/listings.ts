import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "./images";
import type { BrowseSearch } from "@/lib/browse-search";

export type AppRole = "user" | "admin";
export type ListingStatus = "approved" | "pending" | "rejected";

export type Listing = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  batteryKwh: number;
  rangeKm: number;
  chargingKw: number;
  fastCharging: boolean;
  location: string;
  country: string;
  sellerType: "Private" | "Dealer";
  sellerName: string;
  sellerEmail?: string;
  sellerPhone?: string | null;
  batteryHealth: number | null;
  batteryCertificateDate: string | null;
  batteryCertificateProvider: string | null;
  batteryCertificatePdfUrl: string | null;
  batteryCertificatePdfPath: string | null;
  warrantyMonths: number | null;
  image: string;
  imageUrl: string | null;
  description: string | null;
  status: ListingStatus;
  sellerUserId: string | null;
};

type Row = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  battery_kwh: number;
  range_km: number;
  charging_kw: number;
  fast_charging: boolean;
  location: string;
  country: string;
  seller_type: "Private" | "Dealer";
  seller_name: string;
  seller_email?: string;
  seller_phone?: string | null;
  battery_health: number | null;
  battery_certificate_date: string | null;
  battery_certificate_provider: string | null;
  battery_certificate_pdf_url: string | null;
  warranty_months: number | null;
  image_url: string | null;
  description: string | null;
  status: ListingStatus;
  seller_user_id: string | null;
};

export type ListingImage = {
  id: string;
  listingId: string;
  storagePath: string;
  sortOrder: number;
  url: string;
};

type ImageRow = {
  id: string;
  listing_id: string;
  storage_path: string;
  sort_order: number;
};

function publicImageUrl(path: string | null) {
  if (!path) return null;
  const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
  return data.publicUrl;
}

function publicDocumentUrl(path: string | null) {
  if (!path) return null;
  const { data } = supabase.storage.from("listing-documents").getPublicUrl(path);
  return data.publicUrl;
}

function toListing(r: Row): Listing {
  const storageImage = publicImageUrl(r.image_url);
  return {
    id: r.id,
    brand: r.brand,
    model: r.model,
    year: r.year,
    price: r.price,
    mileage: r.mileage,
    batteryKwh: Number(r.battery_kwh),
    rangeKm: r.range_km,
    chargingKw: r.charging_kw,
    fastCharging: r.fast_charging,
    location: r.location,
    country: r.country,
    sellerType: r.seller_type,
    sellerName: r.seller_name,
    sellerEmail: r.seller_email,
    sellerPhone: r.seller_phone,
    batteryHealth: r.battery_health,
    batteryCertificateDate: r.battery_certificate_date,
    batteryCertificateProvider: r.battery_certificate_provider,
    batteryCertificatePdfUrl: publicDocumentUrl(r.battery_certificate_pdf_url),
    batteryCertificatePdfPath: r.battery_certificate_pdf_url,
    warrantyMonths: r.warranty_months,
    image: storageImage ?? resolveImage(r.image_url),
    imageUrl: r.image_url,
    description: r.description,
    status: r.status,
    sellerUserId: r.seller_user_id,
  };
}

function toListingImage(r: ImageRow): ListingImage {
  return {
    id: r.id,
    listingId: r.listing_id,
    storagePath: r.storage_path,
    sortOrder: r.sort_order,
    url: publicImageUrl(r.storage_path) ?? "",
  };
}

const SELECT_COLS =
  "id,brand,model,year,price,mileage,battery_kwh,range_km,charging_kw,fast_charging,location,country,seller_type,seller_name,seller_email,seller_phone,battery_health,battery_certificate_date,battery_certificate_provider,battery_certificate_pdf_url,warranty_months,image_url,description,status,seller_user_id";

export async function fetchApprovedListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT_COLS)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(toListing);
}

export const BROWSE_PAGE_SIZE = 12;

export type BrowseListingsResult = {
  listings: Listing[];
  total: number;
  page: number;
  pageCount: number;
};

/** Fetches only the newest cards needed by the statically generated home page. */
export async function fetchFeaturedListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT_COLS)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) throw error;
  return (data as Row[]).map(toListing);
}

export type MarketplaceStats = { vehicleCount: number; locationCount: number };

/** Reads the two live counters without transferring listing rows. */
export async function fetchMarketplaceStats(): Promise<MarketplaceStats> {
  const { data, error } = await supabase.rpc("marketplace_stats");
  if (error) throw error;
  const stats = data?.[0];
  return {
    vehicleCount: Number(stats?.vehicle_count ?? 0),
    locationCount: Number(stats?.location_count ?? 0),
  };
}

/** Applies all browse filters in PostgREST and transfers one fixed-size result page. */
export async function searchApprovedListings(search: BrowseSearch): Promise<BrowseListingsResult> {
  const page = search.page ?? 1;
  let query = supabase
    .from("listings")
    .select(SELECT_COLS, { count: "exact" })
    .eq("status", "approved");

  // Commas and parentheses have structural meaning in PostgREST's `or` syntax.
  const term = search.q?.replace(/[,%()]/g, " ").trim();
  if (term) query = query.or(`brand.ilike.%${term}%,model.ilike.%${term}%,location.ilike.%${term}%`);
  if (search.brand && search.brand !== "Alle") query = query.eq("brand", search.brand);
  if (search.maxPrice !== undefined) query = query.lte("price", search.maxPrice);
  if (search.minRange !== undefined) query = query.gte("range_km", search.minRange);
  if (search.seller && search.seller !== "Alle") query = query.eq("seller_type", search.seller);
  if (search.fastOnly) query = query.eq("fast_charging", true);
  if (search.certificateOnly) query = query.not("battery_certificate_pdf_url", "is", null);

  const from = (page - 1) * BROWSE_PAGE_SIZE;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + BROWSE_PAGE_SIZE - 1);
  if (error) throw error;

  const total = count ?? 0;
  return {
    listings: (data as Row[]).map(toListing),
    total,
    page,
    pageCount: Math.ceil(total / BROWSE_PAGE_SIZE),
  };
}

export type ListingSitemapEntry = {
  id: string;
  updatedAt: string;
};

export async function fetchApprovedListingSitemapEntries(): Promise<ListingSitemapEntry[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("id,updated_at")
    .eq("status", "approved")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as Array<{ id: string; updated_at: string }>).map((row) => ({
    id: row.id,
    updatedAt: row.updated_at,
  }));
}

export async function fetchListing(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT_COLS)
    .eq("status", "approved")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toListing(data as Row) : null;
}

export type NewListingInput = {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  battery_kwh: number;
  range_km: number;
  charging_kw: number;
  fast_charging: boolean;
  battery_health?: number | null;
  battery_certificate_date?: string | null;
  battery_certificate_provider?: string | null;
  battery_certificate_pdf_url?: string | null;
  warranty_months?: number | null;
  seller_type: "Private" | "Dealer";
  seller_name: string;
  seller_email: string;
  seller_phone?: string | null;
  location: string;
  description?: string | null;
};

function requireUserId(userId?: string | null): string {
  if (!userId) throw new Error("Bitte melde dich an, um Inserate zu verwalten.");
  return userId;
}

function listingMutationError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "PGRST205"
  ) {
    return new Error(
      "Die Inserats-Datenbank ist in diesem Supabase-Projekt nicht verfügbar. Bitte Deployment-Umgebung und Migrationen prüfen.",
    );
  }
  return error;
}

export async function submitListing(input: NewListingInput, userId?: string | null) {
  const sellerUserId = requireUserId(userId);
  const { data, error } = await supabase
    .from("listings")
    .insert({
      ...input,
      seller_user_id: sellerUserId,
      fast_charging: input.fast_charging,
      status: "approved",
    })
    .select("id")
    .single();
  if (error) throw listingMutationError(error);
  return data as { id: string };
}

export async function updateListing(id: string, input: NewListingInput, userId?: string | null) {
  const sellerUserId = requireUserId(userId);
  const { error } = await supabase
    .from("listings")
    .update({
      ...input,
      fast_charging: input.fast_charging,
      status: "approved",
    })
    .eq("id", id)
    .eq("seller_user_id", sellerUserId);
  if (error) throw listingMutationError(error);
}

export async function fetchMyListings(userId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT_COLS)
    .eq("seller_user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map(toListing);
}

export async function fetchEditableListing(
  id: string,
  userId?: string | null,
): Promise<Listing | null> {
  const sellerUserId = requireUserId(userId);
  const { data, error } = await supabase
    .from("listings")
    .select(SELECT_COLS)
    .eq("id", id)
    .eq("seller_user_id", sellerUserId)
    .maybeSingle();
  if (error) throw error;
  return data ? toListing(data as Row) : null;
}

export async function deleteListing(id: string, userId?: string | null) {
  const sellerUserId = requireUserId(userId);

  const listing = await fetchEditableListing(id, sellerUserId);
  if (!listing) throw new Error("Inserat nicht gefunden oder du hast keine Berechtigung.");

  const images = await fetchListingImages(id);
  const imagePaths = images.map((image) => image.storagePath);
  if (imagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("listing-images")
      .remove(imagePaths);
    if (storageError) throw storageError;
  }

  if (listing.batteryCertificatePdfPath) {
    const { error: documentStorageError } = await supabase.storage
      .from("listing-documents")
      .remove([listing.batteryCertificatePdfPath]);
    if (documentStorageError) throw documentStorageError;
  }

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("seller_user_id", sellerUserId);
  if (error) throw listingMutationError(error);
}

export async function fetchListingImages(listingId: string): Promise<ListingImage[]> {
  const { data, error } = await supabase
    .from("listing_images")
    .select("id,listing_id,storage_path,sort_order")
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as ImageRow[]).map(toListingImage);
}

export const MAX_LISTING_IMAGES = 4;
export const MAX_LISTING_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_CERTIFICATE_SIZE_BYTES = 15 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);
const ALLOWED_PDF_TYPES = new Set(["", "application/pdf", "application/x-pdf"]);

function fileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

function formatMegabytes(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

/** Returns an informal German error message when the image is not acceptable, otherwise null. */
export function describeListingImageError(file: File): string | null {
  const ext = fileExtension(file);
  if (!ALLOWED_IMAGE_TYPES.has(file.type) || !ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    return "Bitte lade nur JPG-, PNG- oder WebP-Bilder hoch. Vektorformate sind nicht erlaubt.";
  }
  if (file.size > MAX_LISTING_IMAGE_SIZE_BYTES) {
    return `„${file.name}“ ist grösser als ${formatMegabytes(MAX_LISTING_IMAGE_SIZE_BYTES)}. Bitte lade ein kleineres Bild hoch.`;
  }
  return null;
}

/** Returns an informal German error message when the PDF is not acceptable, otherwise null. */
export function describeCertificateError(file: File): string | null {
  if (!ALLOWED_PDF_TYPES.has(file.type) || fileExtension(file) !== "pdf") {
    return "Bitte lade nur PDF-Dateien hoch.";
  }
  if (file.size > MAX_CERTIFICATE_SIZE_BYTES) {
    return `„${file.name}“ ist grösser als ${formatMegabytes(MAX_CERTIFICATE_SIZE_BYTES)}. Bitte lade eine kleinere PDF-Datei hoch.`;
  }
  return null;
}

function assertAllowedImageFile(file: File) {
  const message = describeListingImageError(file);
  if (message) throw new Error(message);
}

export function validateListingImageFiles(files: File[]) {
  if (files.length > MAX_LISTING_IMAGES) {
    throw new Error(`Es sind höchstens ${MAX_LISTING_IMAGES} Bilder pro Inserat erlaubt.`);
  }
  files.forEach(assertAllowedImageFile);
}

function assertAllowedPdfFile(file: File) {
  const message = describeCertificateError(file);
  if (message) throw new Error(message);
}

async function syncListingPrimaryImage(listingId: string) {
  const { data, error } = await supabase
    .from("listing_images")
    .select("storage_path")
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: true })
    .limit(1);
  if (error) throw error;

  const { error: updateError } = await supabase
    .from("listings")
    .update({ image_url: data?.[0]?.storage_path ?? null })
    .eq("id", listingId);
  if (updateError) throw updateError;
}

export async function uploadListingImages(listingId: string, userId: string, files: File[]) {
  validateListingImageFiles(files);
  const uploaded: string[] = [];
  for (const file of files) {
    let path: string | null = null;
    let lastConflict: unknown = null;

    // The policy only accepts these four names. storage.objects' (bucket_id,
    // name) uniqueness is therefore also the concurrency-safe slot lock.
    for (let slot = 1; slot <= MAX_LISTING_IMAGES; slot += 1) {
      const candidate = `${userId}/${listingId}/image-${slot}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(candidate, file, { upsert: false, contentType: file.type });
      if (!uploadError) {
        path = candidate;
        break;
      }
      if (uploadError.status === 409 || uploadError.statusCode === "409") {
        lastConflict = uploadError;
        continue;
      }
      throw uploadError;
    }

    if (!path) {
      throw new Error(
        lastConflict
          ? `Es sind höchstens ${MAX_LISTING_IMAGES} Bilder pro Inserat erlaubt.`
          : "Es konnte kein Bildspeicherplatz reserviert werden.",
      );
    }

    uploaded.push(path);
    const slot = Number(path.slice(path.lastIndexOf("-") + 1));
    const { error: insertError } = await supabase.from("listing_images").insert({
      listing_id: listingId,
      seller_user_id: userId,
      storage_path: path,
      sort_order: slot - 1,
    });
    if (insertError) {
      await supabase.storage.from("listing-images").remove([path]);
      throw insertError;
    }
  }

  if (uploaded[0]) {
    await syncListingPrimaryImage(listingId);
  }
}

export async function removeListingImages(listingId: string, imageIds: string[]) {
  if (imageIds.length === 0) return;

  const { data: images, error: selectError } = await supabase
    .from("listing_images")
    .select("id,storage_path")
    .eq("listing_id", listingId)
    .in("id", imageIds);
  if (selectError) throw selectError;

  const storagePaths = images?.map((image) => image.storage_path) ?? [];
  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("listing-images")
      .remove(storagePaths);
    if (storageError) throw storageError;
  }

  const { error: deleteError } = await supabase
    .from("listing_images")
    .delete()
    .eq("listing_id", listingId)
    .in("id", imageIds);
  if (deleteError) throw deleteError;

  await syncListingPrimaryImage(listingId);
}

export async function uploadBatteryCertificate(
  listingId: string,
  userId: string,
  file: File,
  metadata?: Pick<NewListingInput, "battery_certificate_date" | "battery_certificate_provider">,
  replacedStoragePath?: string | null,
) {
  assertAllowedPdfFile(file);
  // A certificate always occupies the one database-enforced object slot.
  // Upsert replaces that object atomically instead of retaining old versions
  // under random names while the listing row is being updated.
  const path = `${userId}/${listingId}/battery-certificate`;
  if (replacedStoragePath && replacedStoragePath !== path) {
    const { error: removeError } = await supabase.storage
      .from("listing-documents")
      .remove([replacedStoragePath]);
    if (removeError) throw removeError;
  }
  const { error: uploadError } = await supabase.storage
    .from("listing-documents")
    .upload(path, file, { upsert: true, contentType: file.type || "application/pdf" });
  if (uploadError) throw uploadError;

  const { error } = await supabase
    .from("listings")
    .update({ battery_certificate_pdf_url: path, ...metadata })
    .eq("id", listingId)
    .eq("seller_user_id", userId);
  if (error) {
    await supabase.storage.from("listing-documents").remove([path]);
    throw error;
  }
}

export async function removeBatteryCertificate(
  listingId: string,
  userId: string,
  storagePath: string | null,
) {
  const { error } = await supabase
    .from("listings")
    .update({
      battery_certificate_pdf_url: null,
      battery_certificate_date: null,
      battery_certificate_provider: null,
    })
    .eq("id", listingId)
    .eq("seller_user_id", userId);
  if (error) throw error;

  if (storagePath) {
    await supabase.storage.from("listing-documents").remove([storagePath]);
  }
}
