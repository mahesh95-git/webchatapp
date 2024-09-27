"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React, { useCallback, useContext, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import useUpdateData from "@/customsHook/updateData";
import { useToast } from "../use-toast";
import { SocketContext } from "@/context/socketContext";
function UserOption({ id, type, setData, data }) {
  const socket = useContext(SocketContext);
  const { updateData } = useUpdateData();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const url = new URL(window?.location?.href);
  const path = url.pathname.split("/")[2];
  const router = useRouter();
  const handleRemove = useCallback(async () => {
    setLoading(true);
    const response = await updateData("patch", `/api/user/${type}`, {
      ...(type === "group" ? { groupId: id } : { friendId: id }),
    });
    setLoading(false);
    if (response?.success) {
      toast({
        description: response?.message,
      });
      router.push(`/home/${path}`);

      if (socket) {
        socket.emit("refresh:chat", {
          receiverId: id,
        });
        if (type === "group") {
          const groupMembers =  data?.members.map((member) => {
            return {
              _id: member,
            };
          });
          socket.emit("group:alert", {
            members:groupMembers,
            id: id,
            type:"leaveGroup",
            groupName: data?.name,
          });
        }
      }
    } else {
      toast({
        description: response?.message,
      });
    }
  }, [id, path, updateData, router,socket]);
  const handleClearChat = useCallback(async () => {
    setLoading(true);
    const response = await updateData("delete", "/api/user/chats", {
     ...(type === "group" ? { groupId: id } : { receiver: id }),
    });
    if (response?.success) {
      setData((prev) => {
        const newData = {
          ...prev,
          data: [],
        };
        return newData;
      });
      toast({
        description: response?.message,
      });
    } else {
      toast({
        description: response?.message,
      });
    }
  }, [id, setData, updateData, toast]);
  const handleCloseChat = useCallback(() => {
    router.push(`/home/${path}`);
  }, []);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsThreeDotsVertical className="text-2xl" cursor={"pointer"} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="bg-[#f9fafc]"
          sideOffset={15}
          align="end"
        >
          <DropdownMenuItem onClick={handleRemove} disabled={loading}>
            {type === "friend" ? "Remove" : "Leave Group"}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading} onClick={handleClearChat}>
            Clear Message
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading}>
            <Link href={`/home/detail/${id}?type=${type}`}>
              {type === "friend" ? "View Profile" : "View Details"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading} onClick={handleCloseChat}>
            Close Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserOption;
