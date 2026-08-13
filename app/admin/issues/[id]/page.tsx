import { notFound } from "next/navigation";
import IssueForm from "@/components/admin/IssueForm";
import { getAdminIssueById } from "@/lib/admin-queries";

export default async function EditIssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = await getAdminIssueById(id);
  if (!issue) notFound();
  return <IssueForm issue={issue} />;
}
