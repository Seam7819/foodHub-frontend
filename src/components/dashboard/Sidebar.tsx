import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="space-y-3 p-4 bg-white border rounded-md shadow-sm">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/admin" className="block rounded-md px-3 py-2 hover:bg-gray-100">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/users" className="block rounded-md px-3 py-2 hover:bg-gray-100">
            Users
          </Link>
        </li>
        <li>
          <Link href="/admin/categories" className="block rounded-md px-3 py-2 hover:bg-gray-100">
            Categories
          </Link>
        </li>
        <li>
          <Link href="/admin/meals" className="block rounded-md px-3 py-2 hover:bg-gray-100">
            Meals
          </Link>
        </li>
        <li>
          <Link href="/admin/orders" className="block rounded-md px-3 py-2 hover:bg-gray-100">
            Orders
          </Link>
        </li>
      </ul>
    </div>
  );
}
