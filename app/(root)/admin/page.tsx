"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { VerifiedIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

function AdminPage() {
  const { data: session, update, status } = useSession();

  const handleChangeRole = async () => {
    await fetch("/api/auth/change-role", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "admin" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          update({ role: data.data.role });
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() =>
        toast.error("Something went wrong while changing your role...")
      )
  };

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="w-full max-w-2xl mx-auto p-6">
          <h2 className="w-full text-lg font-bold text-center mb-2 text-gray-800">
            Welcome, <span>{session?.user.email}</span>
          </h2>

          {session?.user.role === "user" ? (
            <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
              <h3 className="text-xl font-semibold text-gray-700">
                You are still not an admin.
              </h3>
              <p className="text-gray-600">
                Change your role to admin to access admin pages.
              </p>
              <Button
                onClick={handleChangeRole}
                className="flex items-center gap-2"
              >
                Become Admin <VerifiedIcon className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="my-8 flex flex-col items-center gap-4 text-center">
              <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                You are admin <VerifiedIcon className="w-6 h-6" />
              </h3>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AdminPage;
