import React from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

function ListLayout({ data ,path}) {
  return (
    <div className="flex w-1/4  min-h-full    flex-col gap-3 border-solid border-r-2 pr-2 ">
      <div>
        <Input placeholder="Search" className="bg-[#dcdcff] text-[#b0b2e3]" />
      </div>
      <div className="flex flex-col gap-1  overflow-y-scroll scrollbar-custom h-full  ">
        {data ? (
          data.map((value) => (
           <Link href={`${path}/${value.id}`} key={value.id}>
            <div
              className=" h-35 flex p-2 rounded-sm  w-full justify-between   gap-2 bg-[#eeeff184] "
              key={value.id}
            >
              <Image src={value.image} width={60} height={60} />
              <div className="h-full flex-1 ">
                <h2 className="font-bold">{value.name}</h2>
                <p className="text-sm">{value.msg}</p>
              </div>
              <div>
                <p>{value.lastSeen}pm</p>
                <p className="bg-orange-600 text-white text-sm  px-1 w-6 h-6 rounded-full text-center">
                  {value?.notify}
                </p>
              </div>
            </div>
           </Link>
          ))
        ) : (
          <div className="w-full bg-gray-100 justify-center gap-3 items-center flex py-3 ">
            <CirclePlus className="cursor-pointer" />
            <p>Add friends</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListLayout;
