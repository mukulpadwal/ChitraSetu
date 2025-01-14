"use client";

import Invoice from "@/components/Invoice";
import Loader from "@/components/Loader";
import { IOrder } from "@/models/orders.models";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<IOrder | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.data);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error("Failed to fetch order data.");
        console.error(error);
      });
  }, [id]);

  return (
    <>
      {!order ? (
        <Loader />
      ) : (
        <div className="p-6 bg-gray-50 min-h-screen">
          <Invoice order={order} />
        </div>
      )}
    </>
  );
}

export default OrderSuccessPage;
