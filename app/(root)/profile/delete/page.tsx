"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteAccountPage() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleDeleteAccount = async () => {
    setIsPending(true);

    fetch("/api/auth/delete", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          signOut({ redirectTo: "/" });
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("Could not delete your account..."))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="px-6 py-3 text-lg shadow-md hover:shadow-lg focus:ring focus:ring-red-300"
          >
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl border border-gray-200 transition-all transform">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">
              Delete Your Account
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete your account? Once deleted, all
              your data will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          {/* Warning Message */}
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            <strong>Warning:</strong> This action is permanent and cannot be
            undone. Please proceed with caution.
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isPending}
              className="w-full sm:w-auto px-4 py-2 shadow-md hover:shadow-lg focus:ring focus:ring-red-300"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" /> Deleting
                </div>
              ) : (
                <>Delete</>
              )}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto px-4 py-2 shadow-md hover:shadow-lg focus:ring focus:ring-gray-300"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
