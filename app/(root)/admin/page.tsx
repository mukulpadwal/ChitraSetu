"use client";

import { Button } from "@/components/ui/button";
import { CameraIcon, VerifiedIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

function AdminPage() {
  const { data: session, update, status } = useSession();

  const handleChangeRole = async () => {
    await fetch("/api/auth/change-role", {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          update({ role: data.data.role });
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
  };

  return (
    <>
      {status === "loading" ? (
        <div className="h-screen w-full flex justify-center items-center">
          <CameraIcon className="animate-pulse text-gray-500 w-8 h-8" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-start p-4">
          <h2 className="w-full text-lg font-bold text-center mb-2">
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
