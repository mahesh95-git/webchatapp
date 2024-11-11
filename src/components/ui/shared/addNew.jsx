"use client";
import React, { useContext, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CirclePlus, Cross, Plus, X } from "lucide-react";
import { Input } from "../input";
import DisplayList from "./displayList";
import axios from "axios";
import { useToast } from "../use-toast";
import { Button } from "../button";
import { SocketContext } from "@/context/socketContext";
import useUpdateData from "@/customsHook/updateData";
import { UserContext } from "@/context/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
function AddNew({ type, viewStateHandler }) {
  const [open, setOpen] = useState(false);
  const { updateData, loading } = useUpdateData();
  const socket = useContext(SocketContext);
  const [content, setContent] = useState("");
  const { user } = useContext(UserContext);

  const [color, setColor] = useState("#e7dfdf");
  const [username, setUsername] = useState("");
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [file, setFile] = useState("");
  const [group, setGroup] = useState({
    name: "",
    about: "",
    members: [],
  });
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);

  useEffect(() => {
    if (type === "group") {
      (async () => {
        try {
          setLoader(true);
          const res = await axios.get(`/api/user/friend`, {
            withCredentials: true,
          });
          setData(res?.data.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoader(false);
        }
      })();
    }
  }, [type]);

  useEffect(() => {
    let timeout;
    if (username) {
      timeout = setTimeout(async () => {
        try {
          setLoader(true);
          const res = await axios.get(`/api/user/${username}`, {
            withCredentials: true,
          });

          setData(res.data?.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoader(false);
        }
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [username]);

  const handleSearch = (value) => {
    setUsername(value);
  };

  const handleAddMembersToGroup = (value) => {
    setGroup((prev) => {
      const alreadyExists = prev.members.some(
        (member) => member.id === value.id
      );

      if (alreadyExists) {
        toast({
          description: "User is already added to the group.",
          title: "Warning",
          variant: "warning",
        });
        return prev;
      }

      return {
        ...prev,
        members: [...prev.members, value],
      };
    });
  };
  const handleRemoveMembersFromGroup = (value) => {
    setGroup((prev) => ({
      ...prev,
      members: prev.members.filter((item) => item.id !== value),
    }));
  };
  const handleCreateGroup = async () => {
    setLoader2(true);
    const members = group.members.map((member) => member.id);
    const form = new FormData();
    form.append("name", group.name);
    form.append("about", group.about);
    form.append("members", JSON.stringify(members));
    form.append("file", file);
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    const res = await updateData("post", "/api/user/group", form, headers);
    if (res?.success) {
      toast({
        description: res.message,
      });
      const groupMembers = members.map((member) => {
        return {
          _id: member,
        };
      });
      if (socket) {
        socket.emit("group:alert", {
          members: groupMembers,
          groupName: group.name,
          type: "create",
        });
      }
    } else {
      toast({
        description: res.message,
        variant: "destructive",
      });
    }
    setLoader2(false);
    setOpen(false);
    setGroup({ name: "", about: "", members: [] });
  };
  const handleFriendRequest = async (value) => {
    const { id } = value;
    setLoader2(true);
    const response = await updateData("post", "/api/user/req", {
      friendId: id,
    });
    if (response?.success) {
      toast({
        description: response?.message,
      });
      if (socket) {
        socket.emit("friend:request", {
          receiverId: id,
        });
      }
    } else {
      toast({
        description: response?.message,
      });
    }
    setLoader2(false);
  };

  return type == "friend" || type == "group" ? (
    <AlertDialog open={false} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <div className="w-full bg-gray-100  justify-center gap-3  rounded-md items-center flex py-3">
          <CirclePlus className="cursor-pointer" />
          <p>{type}</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === "friend" ? (
              <Input
                placeholder="Search friend"
                onChange={(e) => handleSearch(e.target.value)}
              />
            ) : (
              <>
                <div className="flex gap-1">
                  <Input
                    placeholder="Group Name"
                    value={group.name}
                    onChange={(e) =>
                      setGroup((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    type="file"
                    placeholder="Group Image"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <Input
                  placeholder="About Group"
                  value={group.about}
                  onChange={(e) =>
                    setGroup((prev) => ({ ...prev, about: e.target.value }))
                  }
                  className="mt-2 h-28 text-center"
                />
                {group.members.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap max-h-28 overflow-y-scroll justify-center">
                    {group.members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-300 p-[5px] text-sm rounded-md cursor-pointer h-10"
                      >
                        <div>{member.username}</div>
                        <div
                          className="ml-2 cursor-pointer"
                          onClick={() =>
                            handleRemoveMembersFromGroup(member.id)
                          }
                        >
                          <X />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {loader ? (
              "Loading..."
            ) : (
              <DisplayList
                handler={
                  type === "friend"
                    ? handleFriendRequest
                    : handleAddMembersToGroup
                }
                data={data}
                loader={loader2}
              />
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {type === "group" && (
            <Button onClick={handleCreateGroup} disabled={loader2}>
              Create
            </Button>
          )}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <div className="relative">
      <div className="flex justify-start  w-full  pl-2 gap-2 bg-gray-100 p-2 rounded-md">
        <Avatar className=" cursor-pointer border-[#7facdf] border-4" onClick={()=>viewStateHandler(user._id)}>
          <AvatarImage
            src={user.length > 0 && user?.profilePic?.url}
            className="border-2 "
          />
          <AvatarFallback className="  ">{"M"}</AvatarFallback>
        </Avatar>
        <p className="font-bold">My status</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute bottom-0 left-8  bg-white rounded-full">
            <Plus className="cursor-pointer" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white"
          align="start"
          alignOffset={30}
        >
          <DropdownMenuItem>
            <Link href={"/home/status/new?type=text"}>Text</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/home/status/new?type=file"}>Photo Or Video</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AddNew;
