"use client";
import axios from "axios";
import { LogOut } from "lucide-react";
import React, { useCallback } from "react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";

function Logout() {
  const { toast } = useToast();
  const router = useRouter();
  const handleLogOut = useCallback(async () => {
    try {
      const response = await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      toast({
        title: response.data.message,
        variant: "success",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  }, []);

  return (
    <div className="cursor-pointer " onClick={handleLogOut}>
      <LogOut className="text-[#898788] text-[12px]" />
      <p className="text-[#898788] text-[12px]">Logout</p>
    </div>
  );
}

export default Logout;
