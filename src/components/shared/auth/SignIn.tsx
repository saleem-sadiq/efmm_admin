"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Eye, EyeOff, Loader } from "lucide-react";
import { applestore, auth, playstore } from "../../../../public/assets/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MyImage from "../MyImage";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  rememberMe: z.boolean().default(false)
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    },
  });

  async function onSubmit(values: SignInForm) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      // Handle the response based on the status in the data
      if (response.status >= 400 || data.error) {
        toast.error(data.error || "Sign in failed");
        return;
      }
      // If it's a success, show the success toast
      toast.success("Login successful", { description: data.message });
      // Redirect to dashboard
      window.location.href = "/dashboard";

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Redirect user after successful login
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <div className="flex flex-col p-0 m-0 lg:flex-row min-h-screen bg-default text-white">
      <div className="lg:w-1/2 bg-default p-8 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <MyImage
            src={auth.src}
            alt="efmm login signin"
            width={1000}
            height={1000}
            className="object-contain"
          />
        </div>
      </div>
      <div className="lg:w-1/2 bg-blackfade p-8 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-xl xl:text-3xl font-bold mb-2">Welcome Admin!</h1>
          <p className="text-xs xl:text-sm text-gray-400 mb-8">
            Please enter your details.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs xl:text-sm">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="carla@gmail.com"
                        {...field}
                        className="bg-blackfade2 text-white border-none focus:ring-2 focus:ring-default"
                      />
                    </FormControl>
                    <FormMessage className="text-default text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs xl:text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                          className="bg-blackfade2 text-white border-none focus:ring-2 focus:ring-default"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-grayfade" />
                          ) : (
                            <Eye className="h-5 w-5 text-grayfade" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-default text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="text-default focus:ring-default border-gray-300"
                        />
                      </FormControl>
                      <FormLabel className="text-xs xl:text-sm text-gray-400">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {/* <div className="text-sm">
                  <Link
                    href="/forget-password"
                    className="text-default text-xs xl:text-sm hover:text-default"
                  >
                    Forget Password?
                  </Link>
                </div> */}
              </div>
              <Button
                variant={"ghost"}
                type="submit"
                className="text-xs xl:text-lg w-full cursor-pointer m-6 mx-auto group jellyEffect overflow-hidden flex justify-center items-center gap-4 font-semibold text-whitefade xl:p-6 bg-default hover:bg-default ease-in rounded-lg relative"
              >
                <div className="absolute -left-[100%] w-full h-full rounded opacity-35 bg-red-300 group-hover:translate-x-[100%]  transition-transform group-hover:duration-1000 duration-500"></div>
                <div className="absolute -left-[100%] w-full h-full rounded opacity-25 bg-red-400 group-hover:translate-x-[100%]  transition-transform group-hover:duration-700 duration-700"></div>
                <div className="absolute -left-[100%] w-full h-full rounded opacity-15 bg-red-500 group-hover:translate-x-[100%]  transition-transform group-hover:duration-500 duration-1000"></div>
                <div className="relative z-10 flex items-center justify-center gap-4">
                  {isLoading ? <Loader /> : "Login"}
                </div>
              </Button>
            </form>
          </Form>
          <div className="mt-2 flex justify-center space-x-4">
            <Link
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MyImage
                src={applestore.src}
                alt="Download on the App Store"
                width={1000}
                height={1000}
                className="w-32 h-20"
              />
            </Link>
            <Link
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MyImage
                src={playstore.src}
                alt="Get it on Google Play"
                width={1000}
                height={1000}
                className="w-32 h-20"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
