import Link from "next/link";

export default function ProviderSidebar() {
  return (
    <div className="space-y-3 p-4 bg-white border rounded-md shadow-sm">
      <h2 className="text-xl font-semibold text-black">Provider Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link
            href="/provider/dashboard"
            className="block rounded-md px-3 py-2 hover:bg-gray-100 text-black"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/provider/meals"
            className="block rounded-md px-3 py-2 text-black hover:bg-gray-100"
          >
            Manage Products
          </Link>
        </li>
      </ul>
    </div>
  );
}
