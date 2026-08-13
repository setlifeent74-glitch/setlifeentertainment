import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminProductById } from "@/lib/admin-queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProductById(id);
  if (!product) notFound();
  return <ProductForm product={product} />;
}
