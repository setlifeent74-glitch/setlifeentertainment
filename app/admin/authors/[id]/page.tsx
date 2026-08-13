import { notFound } from "next/navigation";
import AuthorForm from "@/components/admin/AuthorForm";
import { getAdminAuthorById } from "@/lib/admin-queries";

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await getAdminAuthorById(id);
  if (!author) notFound();
  return <AuthorForm author={author} />;
}
