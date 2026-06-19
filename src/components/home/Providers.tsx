"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useProviders } from "@/src/hooks/useProviders";

const Providers = () => {
  const { data, isLoading } = useProviders();

  const providers = (data?.data || []).slice(0, 6);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-8 text-orange-400">
          Top Providers
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading providers...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">No providers available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((provider: any) => (
              <Link key={provider.id} href={`/providers`}>
                <div className="border rounded-lg p-5 hover:shadow-lg hover:border-orange-500 transition bg-white cursor-pointer">
                  {provider.image && (
                    <img
                      src={provider.image}
                      alt={provider.businessName || provider.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-gray-800">
                    {provider.businessName || provider.name || "Restaurant"}
                  </h3>
                  <p className="text-gray-500 mt-2 text-sm">
                    {provider.description || "Premium food provider"}
                  </p>
                  <div className="mt-3 text-orange-500 font-semibold">
                    View Restaurant →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Providers;