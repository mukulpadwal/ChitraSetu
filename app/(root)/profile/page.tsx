"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/Loader";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const profileFormSchema = z.object({
  role: z.enum(["user", "admin"], {
    invalid_type_error: "Role must be either 'user' or 'admin'",
  }),
});

type ProfileFormSchema = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      role: session?.user?.role,
    },
  });

  const [isPending, setIsPending] = useState<boolean>(false);

  const onSubmit = async (value: ProfileFormSchema) => {
    setIsPending(true);

    fetch("/api/auth/change-role", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: value.role }),
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
        toast.error("Something went wrong while updating your role...")
      )
      .finally(() => setIsPending(false));
  };

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="cursor-not-allowed bg-gray-200"
                        defaultValue={session?.user.email}
                        readOnly
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your email address cannot be changed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg">
                      User Role*
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the role you wish to assign to this account.
                    </FormDescription>
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
};

export default ProfilePage;
