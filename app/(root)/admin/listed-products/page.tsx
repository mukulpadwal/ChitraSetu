"use client";

import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/models/products.models";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ListedProductsPage() {
  const [listedProducts, setListedProducts] = useState<IProduct[]>([]);
  const { status } = useSession();

  useEffect(() => {
    fetch("/api/products/user")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          setListedProducts(data.data);
        } else {
          toast.error(data.message);
        }
      });
  }, []);

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <>
          {listedProducts.length > 0 ? (
            <div className="min-h-screen mx-auto p-4 space-y-6">
              <h1 className="text-2xl font-bold text-center">
                Your Listed Products
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listedProducts.map((product) => (
                  <ProductCard
                    key={`${product._id}-${product.name}}`}
                    product={product}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl min-h-screen mx-auto p-4 space-y-6 text-center">
              No Products Listed...
            </div>
          )}
        </>
      )}
    </>
  );
}
export default ListedProductsPage;
