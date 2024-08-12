"use client";
import React, { useState } from "react";
import { loginFields } from "../../constant";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import loginSchema from "@/zodSchema/login.Schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {  useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import axios from "axios";

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {toast}=useToast()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values) {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/auth/singin",
        values
      );
      console.log(response.data);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "User logged in successfully",
         
        });
        router.push("/home/allchats");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="bg-[#f9fafc] w-full min-h-screen flex items-center justify-center ">
      <div className="w-1/4 bg-gray-800 py-10 px-5 rounded-md">
        <h1 className="text-3xl font-bold tracking-tight text-white my-5 text-center">
          {" "}
          Sign in
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            method="POST"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
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
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>

                  <FormMessage />
                  <p>
                    <Link href="/forgot-password" className="text-blue-100">
                      Forgot Password?
                    </Link>
                  </p>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`w-1/2 bg-[#f9fafc] text-black ${
                isLoading ? "cursor-not-allowed" : "hover:text-white"
              }`}
              disabled={isLoading ? true : false}
            >
              {isLoading ? (
                <span className="flex justify-around items-center w-full">
                  <LoaderCircle className="animate-spin" /> Processing...
                </span>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div>
          <p className="text-center text-white">or</p>
          <p className="text-center text-white">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
