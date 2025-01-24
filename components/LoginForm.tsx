"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Input } from "./ui/input";
import { Aperture, Loader2 } from "lucide-react";
import { useState } from "react";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().nonempty("Password is required."),
});

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

function LoginForm() {
  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();

  const onSubmit = (value: LoginFormSchemaType) => {
    setIsPending(true);
    signIn("credentials", {
      email: value.email,
      password: value.password,
      redirect: false,
      redirectTo: "/products",
    })
      .then((response) => {
        if (response?.ok) {
          if (response.code) {
            toast.error(response.code);
          } else {
            toast.success("Successfully Logged In...");
            router.replace(response?.url as string);
          }
        }
      })
      .catch((error) => toast.error(error?.message))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <Aperture size={50} className="text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-800">ChitraSetu</h1>
        <p className="text-sm text-gray-600">
          Welcome back! Please log in to your account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-800">
                  Email*
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-800">
                  Password*
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant={"default"}
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex flex-row justify-center items-center gap-2">
                <Loader2 className="animate-spin" />
                Please wait
              </div>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-gray-800 hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
