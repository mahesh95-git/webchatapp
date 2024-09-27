"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { FaBell } from "react-icons/fa6";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useToast } from "../use-toast";
import { Button } from "../button";
import { SocketContext } from "@/context/socketContext";
import useUpdateData from "@/customsHook/updateData";
import { useRouter } from "next/navigation";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { Phone, PhoneOff } from "lucide-react";

function Request() {
  const { toast } = useToast();
  const { updateData } = useUpdateData();
  const [remoteId, setRemoteId] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [Notification, setNotification] = useState(null);
  const [call, setCall] = useState(null);
  const router = useRouter();

  const socket = useContext(SocketContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/req", {
          withCredentials: true,
        });

        setRequests(response.data?.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();

    setNotification(new Audio("/relax-message-tone.mp3"));
    setCall(new Audio("/call.mp3"));

    return () => {
      setNotification(null);
      setCall(null);
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (call) {
      call.pause();
      call.currentTime = 0; // Reset audio to the beginning
    }
  }, [call]);

  const handleIncomingCall = useCallback((data) => {
    setIncomingCall(true);
    setRemoteUser(data.username);
    setRemoteId(data.id);
    setType(data.type);

    call?.play();
    setTimeout(() => {
      if (incomingCall) {
        setIncomingCall(false);
        stopAudio();
        handleDecline();
      }
    }, 30000); // Auto decline after 30 seconds if no action
  }, [call, stopAudio, incomingCall]);

  const handleDecline = useCallback(() => {
    setIncomingCall(false);
    stopAudio();
    if (socket) {
      socket.emit("decline:call", { id: remoteId });
    }
  }, [remoteId, socket, stopAudio]);

  const handleAcceptCall = useCallback(() => {
    setIncomingCall(false);
    stopAudio();
    router.push(`/home/video/${remoteId}?user=receiver&type=${type}`);
  }, [remoteId, router, type, stopAudio]);

  useEffect(() => {
    const handleFriendRequest = (data) => {
      setRequests((prev) => [...prev, data]);
      toast({
        description: `${data.username} sent you a friend request`,
      });

      try {
        Notification?.play();
      } catch (error) {
        console.error("Failed to play notification sound:", error);
      }
    };

    const handleFriendAccept = (data) => {
      try {
        Notification?.play();
      } catch (error) {
        console.error("Failed to play notification sound:", error);
      }
      toast({
        description: `${data.username} accepted your friend request`,
      });
    };

    const handleGroupAlert = (data) => {
      toast({
        description: data,
      });
      Notification?.play();
    };

    if (socket) {
      socket.on("call:request", handleIncomingCall);
      socket.on("friend:accept", handleFriendAccept);
      socket.on("friend:request", handleFriendRequest);
      socket.on("group:alert", handleGroupAlert);
    }

    return () => {
      socket?.off("friend:accept", handleFriendAccept);
      socket?.off("friend:request", handleFriendRequest);
      socket?.off("group:alert", handleGroupAlert);
      socket?.off("call:request", handleIncomingCall);
    };
  }, [socket, handleIncomingCall, Notification, toast]);

  const handleAccept = async (id) => {
    setLoading(true);
    const response = await updateData("post", "/api/user/friend", {
      friendId: id,
    });
    if (response?.success) {
      toast({
        title: response?.message,
        description: "You are now friends with this user",
      });
      socket?.emit("friend:accept", {
        receiverId: id,
      });
      setRequests(requests.filter((request) => request._id !== id));
    } else {
      toast({
        title: "Error",
        description: response?.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleReject = async (id) => {
    setLoading(true);
    const response = await updateData("patch", "/api/user/req", {
      friendId: id,
    });
    if (response?.success) {
      toast({
        title: response?.message,
        description: "You have rejected this user's friend request",
      });
      setRequests(requests.filter((request) => request._id !== id));
    } else {
      toast({
        title: "Error",
        description: response?.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="text-[#898788] text-[12px] flex justify-center flex-col items-center cursor-pointer">
            <div className="relative">
              <FaBell className="text text-2xl" />
              {requests.length > 0 && (
                <p className="text-white bg-orange-600 rounded-full w-6 text-center h-6 text-sm absolute -top-5 -right-3 ">
                  {requests.length}
                </p>
              )}
            </div>
            Notification
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Friend Requests</AlertDialogTitle>
            <AlertDialogDescription>
              You have new friend requests. Please review them below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ScrollArea className="max-h-[300px]">
            <div className="flex flex-col gap-4">
              {requests &&
                requests.map((request) => (
                  <div
                    key={request?._id}
                    className="flex items-center gap-4 p-4 border-b border-gray-200"
                  >
                    <Avatar>
                      <AvatarImage src={request?.profilePic} />
                      <AvatarFallback>
                        {request?.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold">{request?.username}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        disabled={loading}
                        className="bg-slate-700 text-white"
                        onClick={() => handleAccept(request?._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        disabled={loading}
                        className="bg-gray-500 text-white"
                        onClick={() => handleReject(request?._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {incomingCall && (
        <AlertDialog open={incomingCall} onOpenChange={setIncomingCall}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Incoming Call </AlertDialogTitle>
              <AlertDialogDescription>
                You have an incoming call from {remoteUser}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild onClick={handleDecline}>
                <Button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-700">
                  <PhoneOff className="mr-2" />
                  Decline
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild onClick={handleAcceptCall}>
                <Button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700">
                  <Phone className="mr-2" />
                  Accept
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default Request;
