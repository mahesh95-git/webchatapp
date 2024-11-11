"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Members from "@/components/ui/shared/members";
import { UserContext } from "@/context/userContext";
import useFetchData from "@/customsHook/FetchData";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import useUpdateData from "@/customsHook/updateData";
import DisplayList from "@/components/ui/shared/displayList";
import { LoaderCircle, PenSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { SocketContext } from "@/context/socketContext";
function Page({ params, searchParams }) {
  const { id } = params;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const socket=useContext(SocketContext)
  const { toast } = useToast();
  const { updateData, loading } = useUpdateData();
  const { type } = searchParams;
  const [friends, setFriends] = useState([]);
  const [members, setMembers] = useState([]);
  const [file, setFile] = useState(null);
  const [newMembers, setNewMembers] = useState([]);
  const [info, setInfo] = useState({
    name: "",
    about: "",
    email: "",
    username: "",
    profilePic: "",
  });
  const [readOnly, setReadOnly] = useState(true);
  const path = `/api/user/detail/${id}?type=${type}`;
  const { data, loader, setData } = useFetchData({ path });
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (data) {
      setInfo({
        ...(type === "group"
          ? { name: data?.name }
          : {
              username: data?.username,
            }),
        ...(type === "friend" && { email: data?.email }),
        about: data?.about,
        profilePic: data?.profilePic,
      });
      if (type === "group") {
        setMembers(data?.members);
      }
     
    }
  }, [data,socket]);
  const handleChangeInfo = useCallback(async () => {
    const fromData = new FormData();
    fromData.append("name", info.name);
    fromData.append("about", info.about);
    fromData.append("profilePic", file);
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    setIsLoading(true);
    const response = await updateData(
      "post",
      ` /api/user/group/${id}`,
      fromData,
      headers
    );
    if (response?.success) {
      setInfo({
        ...info,
        name: response.data?.name,
        about: response.data?.about,
        profilePic: response.data?.profilePic,
      });

      setReadOnly(true);
      toast({
        description: response?.message,
      });
      if(socket){
        socket.emit("group:alert",{
          id:id,
          groupName:info.name,
          members:members,
          type:"updateInfo"
        })
      }
    } else {
      toast({
        description: response?.message,
      });
    }
    setIsLoading(false);
  }, [readOnly, info, file,socket,id,members]);
  const handleRemoveMember = useCallback(
    async (user) => {
      const response = await updateData("patch", ` /api/user/group/${id}`, {
        userId: user,
      });
      if (response?.success) {
        setMembers(members.filter((member) => member._id !== user));
        toast({
          description: response?.message,
        });
        if(socket){
          socket.emit("group:alert",{
            id:id,
            members:members,
            groupName:info.name,
            type:"removeMember",
            userId:user
          })
        }
      } else {
        toast({
          description: response?.message,
        });
      }
    },
    [id, members,socket]
  );
  const handleChangeRole = useCallback(
    async (user) => {
      const response = await updateData("put", ` /api/user/group`, {
        userId: user,
        groupId: id,
      });
      if (response?.success) {
        toast({
          description: response?.message,
        });
        setData((prev) => {
          return {
            ...prev,
            admin: [...prev.admin, user],
          };
        });
        if(socket){
          socket.emit("group:alert",{
            id:id,
            members:members,
            groupName:info.name,
            type:"changeRole",
            userId:user

          })
        }
      } else {
        toast({
          description: response?.message,
        });
      }
    },
    [id, data,socket]
  );
  const handleRemoveAdmin = useCallback(
    async (user) => {
      const response = await updateData("delete", ` /api/user/group`, {
        userId: user,
        groupId: id,
      });
      if (response?.success) {
        toast({
          description: response?.message,
        });
        setData((prev) => {
          return {
            ...prev,
            admin: prev.admin.filter((admin) => admin !== user),
          };
        });
      } else {
        toast({
          description: response?.message,
        });
      }
      if(socket){
        socket.emit("group:alert",{
          id:id,
          members:members,
          groupName:info.name,
          type:"removeAdmin",
          userId:user
        })
      }
    },
    
    [id, data,socket,members]
  );
  const handleGetFriends = useCallback(async () => {
    const response = await updateData("get", "/api/user/friend");
    if (response?.success) {
      setFriends(response?.data);
    } else {
      toast({
        description: response?.message,
      });
    }
  }, []);
  const handleAddNewMembers = useCallback(
    (value) => {
      setNewMembers((prev) => {
        const alreadyExists = prev.some((member) => member.id === value.id);
        if (alreadyExists) {
          toast({
            description: "User is already added to the group.",
            title: "Warning",
            variant: "warning",
          });
          return prev;
        }
        return [...prev, value];
      });
    },
    [newMembers, id]
  );

  const handleRemoveNewMembers = useCallback(
    (value) => {
      setNewMembers((prev) => prev.filter((item) => item.id !== value));
    },
    [newMembers, id]
  );
  const handleAddNewMembersToGroup = useCallback(async () => {
    const membersIds = newMembers.map((member) => member.id);
    const response = await updateData("put", `/api/user/group/${id}`, {
      newMembers: membersIds,
    });
    if (response?.success) {
      toast({
        description: response?.message,
      });
      setNewMembers([]);
      if(socket){
        socket.emit("group:alert",{
          id:id,
          members:members,
          groupName:info.name,
          type:"addNewMembers",
          userId:membersIds
        })
      }
    } else {
      toast({
        description: response?.message,
      });
    }
  }, [newMembers, id,socket,id,members]);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };
  const handleDeleteGroup = useCallback(async () => {
    setIsLoading(true);
    const response = await updateData("delete", `/api/user/group/${id}`);
    if (response?.success) {
      toast({
        description: response?.message,
      });
      router.push("/home/allchats");
    } else {
      toast({
        description: response?.message,
      });
    }
    setIsLoading(false);
    setOpen(false);
    if(socket){
      socket.emit("group:alert",{
        id:id,
        members:members,
        groupName:info.name,
        type:"deleteGroup"

      })
    }
  }, [id,socket,id,members]);

  return (
    <div className="flex items-center justify-center h-full w-full gap-2">
      {loader ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-col w-full md:w-[30%] items-center gap-6 text-black">
            <div className="flex justify-center items-center">
              {!readOnly ? (
                <div className="flex flex-col justify-center items-center relative">
                  <Input
                    type="file"
                    onChange={handleFile}
                    className="w-24 h-24 rounded-full z-10 opacity-0 cursor-pointer absolute inset-0"
                  />
                  <p className="bg-[#000000c3] text-white p-1 rounded-full w-24 h-24 flex justify-center items-center">
                    <PenSquare />
                  </p>
                </div>
              ) : (
                <Avatar className="w-32 h-32 ">
                  <AvatarImage src={info?.profilePic?.url} alt="profilePic" />
                  <AvatarFallback>
                    {type === "friend"
                      ? info?.username?.[0]?.toUpperCase()
                      : info?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            <div className="w-full">
              <div className="text-sm text-gray-400 mb-1">Name</div>
              <Input
                value={type === "friend" ? info?.username : info?.name}
                className="bg-transparent border border-gray-500 rounded-md h-12 px-4 "
                readOnly={readOnly}
                onChange={(e) => {
                  setInfo({ ...info, name: e.target.value });
                }}
              />
            </div>

            {type === "friend" && (
              <div className="w-full">
                <div className="text-sm text-gray-400 mb-1">Email</div>
                <Input
                  value={info?.email}
                  className="bg-transparent border border-gray-500 rounded-md h-12 px-4 "
                  readOnly={readOnly}
                />
              </div>
            )}

            <div className="w-full">
              <div className="text-sm text-gray-400 mb-1">About</div>
              <Textarea
                className="h-32 bg-transparent border border-gray-500 rounded-md resize-none px-4 "
                value={info?.about}
                readOnly={readOnly}
                onChange={(e) => {
                  setInfo({ ...info, about: e.target.value });
                }}
              />
            </div>

            {type === "group" && data?.admin?.includes(user._id) && (
              <div className="w-full">
                {readOnly ? (
                  <div>
                    <Button
                      className="w-36 bg-gray-600 mr-2 "
                      onClick={() => setReadOnly(!readOnly)}
                    >
                      Edit
                    </Button>

                    <AlertDialog open={open}>
                      <AlertDialogTrigger>
                        {" "}
                        <Button
                          className="w-36 bg-red-600"
                          onClick={() => setOpen(true)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setOpen(false)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteGroup}
                            className="bg-red-600"
                            disabled={isLoading}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className={`w-1/2   bg-gray-600 ${
                        isLoading && "cursor-not-allowed"
                      }`}
                      disabled={isLoading ? true : false}
                      onClick={handleChangeInfo}
                    >
                      {isLoading ? (
                        <span className="flex justify-around items-center w-full">
                          <LoaderCircle className="animate-spin" />{" "}
                          Processing...
                        </span>
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      className="w-36 bg-gray-600"
                      onClick={() => setReadOnly(!readOnly)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          {type === "group" && (
            <div className="w-full md:w-[40%] md:border-l  p-6">
              <div className="text-lg text-center mb-4">Members</div>
              {data && data.admin?.includes(user._id) && (
                <div classNam="">
                  <Dialog>
                    <DialogTrigger>
                      {" "}
                      <Button
                        className=" bg-gray-600"
                        onClick={handleGetFriends}
                      >
                        Add members
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Members</DialogTitle>
                        <DialogDescription>
                          {newMembers.length > 0 && (
                            <div className="flex gap-2 mt-2 mb-2 flex-wrap max-h-28 overflow-y-scroll justify-center">
                              {newMembers.map((member, index) => (
                                <div
                                  key={index}
                                  className="flex items-center bg-gray-300 p-[5px] text-sm rounded-md cursor-pointer h-10"
                                >
                                  <div>{member.username}</div>
                                  <div
                                    className="ml-2 cursor-pointer"
                                    onClick={() =>
                                      handleRemoveNewMembers(member.id)
                                    }
                                  >
                                    <X />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <DisplayList
                            data={friends}
                            handler={handleAddNewMembers}
                            loader={loading}
                          />
                          <div className="mt-2">
                            <Button onClick={handleAddNewMembersToGroup}>
                              Add
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              <div>
                {data && (
                  <Members
                    data={members}
                    admin={data?.admin}
                    user={user}
                    handleRemoveMember={handleRemoveMember}
                    handleChangeRole={handleChangeRole}
                    handleRemoveAdmin={handleRemoveAdmin}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
