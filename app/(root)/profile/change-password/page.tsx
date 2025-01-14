"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const changePasswordFormSchema = z.object({
  currPassword: z
    .string({
      required_error: "Current password is required.",
    })
    .nonempty(),
  newPassword: z
    .string({
      required_error: "Name is required.",
    })
    .min(8, {
      message: "New Password must be atleast 8 characters long...",
    })
    .nonempty(),
});

type ChangePasswordFormSchema = z.infer<typeof changePasswordFormSchema>;

function ChangePasswordPage() {
  const { status } = useSession();
  const form = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currPassword: "",
      newPassword: "",
    },
  });
  const [isPending, setIsPending] = useState<boolean>(false);

  async function onSubmit(value: ChangePasswordFormSchema) {
    setIsPending(true);

    fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currPassword: value.currPassword,
        newPassword: value.newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("Could not update change your password..."))
      .finally(() => setIsPending(false));
  }

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg">
                      Current Password*
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your current password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg">
                      New Password*
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>Enter your new password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <span className="flex flex-row items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
}
export default ChangePasswordPage;
