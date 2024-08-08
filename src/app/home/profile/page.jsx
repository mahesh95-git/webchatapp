import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

function page() {
  return (
    <div className="w-full min-h-full  flex flex-col  items-center justify-center  ">
      <div className="flex flex-col gap-3 bg-gray-100 p-10 rounded-lg w-1/3 justify-center items-center">
        <div className="bg-[#dcdcff] rounded-full h-28 w-28   flex-col flex items-center justify-center ">
          <div className="relative">
            <Image
              alt="profile pic"
              src={"/pngegg.png"}
              width={100}
              height={100}
            />
            <Pencil className="text-3xl absolute bottom-0 right-0 cursor-pointer" />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="border-t-0 border-x-0 border-b-2 border-solid border-[#b0b2e3]">
            <div className="text-blue-500">Name</div>
            <div className="flex items-center gap-1">
              <Input
                value={"mahesh vinod"}
                className="bg-transparent w-full  outline-none   border-none shadow-none"
                style={{
                  outline: "none !important",
                  boxShadow: "none !important",
                }}
              />

              <Pencil className="text-3xl cursor-pointer" />
            </div>
          </div>
          <div className="border-t-0 border-x-0 border-b-2 border-solid border-[#b0b2e3]">
            <div className="text-blue-500">About</div>
            <div className="flex items-center gap-1 ">
              <Textarea
                value={"mahesh vinod"}
                className="bg-transparent w-full  outline-none    shadow-none resize-none border-none"
                style={{
                  outline: "none !important",
                  boxShadow: "none !important",
                }}
              />

              <Pencil className="text-3xl cursor-pointer" />
            </div>
          </div>
          <div className="border-t-0 border-x-0 border-b-2 border-solid border-[#b0b2e3]">
            <div className="text-blue-500">Email</div>
            <div className="flex items-center gap-1">
              <Input
                value={"mahesh vinod"}
                className="bg-transparent w-full  outline-none   border-none shadow-none "
                style={{
                  outline: "none !important",
                  boxShadow: "none !important",
                }}
              />

              <Pencil className="text-3xl cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
