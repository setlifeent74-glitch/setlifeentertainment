import Link from "next/link";
import { getAllProductsAdmin } from "@/lib/admin-queries";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div className="admin-list-page">
      <div className="admin-list-header">
        <h1>Store Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          + New Product
        </Link>
      </div>

      <table className="admin-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Inventory</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <Link href={`/admin/products/${product.id}`}>{product.name}</Link>
              </td>
              <td>${(product.price / 100).toFixed(2)}</td>
              <td>{product.inventory ?? "Unlimited"}</td>
              <td>{product.published ? "Yes" : ""}</td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={4}>No products yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
