"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback } from "react";
import { FiPhone } from "react-icons/fi";
import { GoDeviceCameraVideo } from "react-icons/go";
import Chats from "./chats";
import useFetchData from "@/customsHook/FetchData";
import { useInfiniteScrolling } from "./infiniteScrolling";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socketContext";
import { useRef } from "react";
import Link from "next/link";
import UserOption from "./userOption";
import Message from "./message";
import { UserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
function ChatListing({ id, type }) {
  const [userTyping, setUserTyping] = useState([]);
  const { user } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const router = useRouter();
  const limit = 20;
  const path = `/api/user/chats?limit=${limit}&${
    type == "friend" ? `receiver=${id}` : `group=${id}`
  }`;
  const { data, loader, setData } = useFetchData({ path, limit });

  const chatContainerRef = useRef();
  const { listInnerRef, isLoading } = useInfiniteScrolling({
    path,
    limit,
    totalChats: data?.totalChats,
    setData: setData,
  });
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (value) => {
        setData((prev) => {
          const newData = {
            ...prev,
            data: [value, ...prev.data],
          };
          return newData;
        });
      };
      const handleUserTyping = (value) => {
        setUserTyping((prev) =>
          !prev.includes(value) ? [...prev, value] : prev
        );
      };
      const handleUserStopTyping = (value) => {
        setUserTyping((prev) => prev.filter((item) => item !== value));
      };
      socket.on("new:message", handleReceiveMessage);
      socket.on("user:typing", handleUserTyping);
      socket.on("user:stopTyping", handleUserStopTyping);
      return () => {
        socket.off("new:message", handleReceiveMessage);
        socket.off("user:typing", handleUserTyping);
        socket.off("user:stopTyping", handleUserStopTyping);
      };
    }
  }, [socket]);
  useEffect(() => {
    if (socket && type === "group") {
      socket.emit("joinRoom", id);

      return () => {
        socket.emit("leaveRoom", id);
      };
    }
  }, [socket]);
  useEffect(() => {
    if (listInnerRef.current) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }
  }, [data?.data]);

  const handleVideoCall = useCallback(() => {
    if (socket) {
      socket.emit("call:request", { id, type: "video" });
      router.push(`/home/video/${id}?user=sender&type=video`);
    }
  }, [id, router, socket]);

  const handleAudioCall = useCallback(() => {
    if (socket) {
      socket.emit("call:request", { id, type: "audio" });
      router.push(`/home/video/${id}?user=sender&type=audio`);
    }
  }, [id, router, socket]);
  return loader ? (
    <p className="text-center">Loading...</p>
  ) : (
    <div className="grid grid-rows-[60px_1fr_50px] grid-cols-1 h-[calc(100vh-50px)]">
    <div className="flex justify-between items-center p-2">
      <div className="flex items-center gap-2">
        <Link href={`/home/detail/${id}?type=${type}`}>
          <Avatar className="w-14 h-14">
            <AvatarImage src={data?.profilePic?.url} alt="profilePic" />
            <AvatarFallback>
              {type === "friend" ? data?.username?.[0]?.toUpperCase() : data?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <h1 className="text-2xl font-bold">
          {type === "friend" ? data?.username : data?.name}
        </h1>
      </div>
      {type === "group" && <p>{data?.members?.length} members</p>}
      {userTyping && (
        <div className="flex gap-1 text-[#1cce1c] text-sm max-w-[600px] overflow-hidden">
          {userTyping.map((item) => (
            <p className="whitespace-nowrap w-[170px]" key={item}>
              {item} typing...
            </p>
          ))}
        </div>
      )}
      <div className="flex gap-10">
        {type === "friend" && (
          <>
            <FiPhone className="text-2xl cursor-pointer" onClick={handleAudioCall} />
            <GoDeviceCameraVideo className="text-2xl cursor-pointer" onClick={handleVideoCall} />
          </>
        )}
        <UserOption id={id} type={type} setData={setData} data={data} />
      </div>
    </div>
  
    <div className="bg-[#efebe2] relative overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(/chatbg.png)` }}></div>
      <div ref={listInnerRef} className="flex flex-col-reverse z-10 overflow-y-scroll pb-9 relative h-full">
        {!data ? (
          <p className="text-center text-gray-500 mt-4">No messages found.</p>
        ) : (
          <Chats data={data.data || []} user={user?._id} setData={setData} />
        )}
      </div>
    </div>
    <Message id={id} type={type} setData={setData} data={data} />
  </div>
  
  );
}

export default ChatListing;
