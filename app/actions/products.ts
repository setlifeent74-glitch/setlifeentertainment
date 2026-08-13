"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export type SaveProductInput = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  priceDollars: number;
  imageUrl: string;
  stripePriceId: string;
  inventory: string;
  digitalFileUrl: string;
  eventDate: string;
  eventLocation: string;
  published: boolean;
};

export async function saveProduct(input: SaveProductInput): Promise<{ id: string; error?: string }> {
  const supabase = await createClient();
  const row: Partial<ProductInsert> = {
    slug: input.slug,
    name: input.name,
    description: input.description || null,
    price: Math.round(input.priceDollars * 100),
    image_url: input.imageUrl || null,
    stripe_price_id: input.stripePriceId || null,
    inventory: input.inventory === "" ? null : Number(input.inventory),
    digital_file_url: input.digitalFileUrl || null,
    event_date: input.eventDate || null,
    event_location: input.eventLocation || null,
    published: input.published,
  };

  if (input.id) {
    const { error } = await supabase.from("products").update(row).eq("id", input.id);
    if (error) return { id: input.id, error: error.message };
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { id: input.id };
  }

  const { data, error } = await supabase.from("products").insert(row as ProductInsert).select("id").single();
  if (error || !data) return { id: "", error: error?.message ?? "Could not create product." };
  revalidatePath("/admin/products");
  return { id: data.id };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
