"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema } from "@/zodSchema/forgotEmail";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import axios from "axios";

function Page({params}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const {token}=params;
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(value) {
    try {
      setIsLoading(true);
      const response=await axios.post(`/api/auth/forgotpassword/${token}`,value)
     
      toast({
        title: "Password reset successfully",
        variant: "success",
      })
      router.push("/signin");

    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      })
      
      
    }finally{
      setIsLoading(false);


    }
  }
  return (
    <div className="bg-[#f9fafc] w-full min-h-screen flex items-center justify-center ">
      <div className="w-1/4 bg-gray-800 py-10 px-5 rounded-md">
        <h1 className="text-3xl font-bold tracking-tight text-white my-5 text-center">
          {" "}
          New Password
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            method="POST"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="new password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="new password" {...field} />
                  </FormControl>

                  <FormMessage />
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
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
