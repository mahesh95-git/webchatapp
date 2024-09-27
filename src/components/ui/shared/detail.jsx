"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../button";
import { Phone, Video } from "lucide-react";

function Detail({ data, type }) {
  return (
    <DropdownMenu open={true}>
      <DropdownMenuTrigger></DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-[400px] min-h-[400px] bg-white shadow-md rounded-md "
        sideOffset={-30}
        align="start"
        alignOffset={-70}
      >
        <DropdownMenuLabel className="font-bold text-center text-[15px] ">
          Profile
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
      <DropdownMenuItem>

      </DropdownMenuItem>
      <DropdownMenuItem>
      <DropdownMenuItem
          align="center"
          className="flex flex-col justify-start "
        >
          <Avatar className="w-24 h-24 ">
            <AvatarImage src="https://github.com/shadcn.png" alt="profilePic" />
            <AvatarFallback>
              {type === "friend"
                ? data?.username?.[0]?.toUpperCase()
                : data?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-[15px] mt-3 font-bold">
            {type === "friend" ? data?.name : data?.username} mahesh
          </p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-center gap-4 ">
          <Button className="bg-[#202022d8]">
            <Video />
            <span className="ml-2">Video</span>
          </Button>
          <Button className="bg-[#202022d8]">
            <Phone />
            <span className="ml-2">Voice</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 flex-col justify-end items-start text-md ">
          <p>Email:</p>
          <p>{data?.email}mahesh@gmial.com</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="items-end justify-end ">
          <Button className="bg-[#b91c1c]">Remove</Button>
        </DropdownMenuItem>
      </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Detail;
