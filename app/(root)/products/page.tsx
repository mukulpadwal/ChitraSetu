"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/models/products.models";
import Link from "next/link";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const { status } = useSession();

  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          setProducts(data.data);
        } else {
          toast.error(data.message);
        }
      });
  }, []);

  return (
    <>
      {status === "loading" ? (
        <div className="w-full h-screen flex justify-center items-center gap-2">
          <Camera className="animate-pulse" size={25} />
          Loading products...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <h1 className="text-3xl font-semibold text-center mb-8">
            Our Products
          </h1>
          <p className="text-center mb-12 text-lg text-gray-600">
            Explore our collection of high-quality products.
          </p>

          {/* Grid Layout for Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product?._id?.toString()}
                href={`/products/${product._id}`}
                passHref
              >
                <div className="cursor-pointer">
                  <ProductCard product={product} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;
