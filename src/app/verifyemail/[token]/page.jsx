"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

function Page({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const token = params.token;
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/auth/verifyEmail/${token}`
        );
        if (response.data?.success) {
          toast({
            title: response.data?.message,
            description: "Your email has been successfully verified.",
            className: "bg-green-500 text-white", // Assuming you style using className
          });
          router.push("/home/allchats");
        }
      } catch (error) {
        console.log(error);
        setError(true);
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "An unexpected error occurred.",
          className: "bg-red-500 text-white", // Assuming you style using className
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [token, router]);

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center text-4xl font-bold ${
        error ? "text-red-500" : ""
      }`}
    >
      {error
        ? "Something went wrong, please try again."
        : loading
        ? "Verifying..."
        : null}
    </div>
  );
}

export default Page;
