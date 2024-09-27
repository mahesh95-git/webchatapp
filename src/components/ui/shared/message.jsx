import React, { useCallback, useContext, useEffect, useState } from "react";
import { LoaderCircle, Paperclip, Send } from "lucide-react";
import EmojiPicker from "@/components/ui/shared/emojiPicker";
import AudioRecording from "./audioRecording";
import { Input } from "../input";
import useUpdateData from "@/customsHook/updateData";
import { SocketContext } from "@/context/socketContext";
import { UserContext } from "@/context/userContext";
import { useToast } from "../use-toast";
function Message({ id, type, setData, data }) {
  const { toast } = useToast();
  const { updateData } = useUpdateData();
  const [showEmoji, setShowEmoji] = useState(false);
  const { user } = useContext(UserContext);
  const [loader, setLoader] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState(null);
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const handleFile = async (e) => {
    const from = new FormData();
    from.append("file", e.target.files[0]);
    from.append("receiver", id);
    from.append("type", type);

    const headers = {
      "Content-Type": "multipart/form-data",
    };
    setLoader(true);
    const res = await updateData("post", "/api/user/media", from, headers);
    if (res?.success) {
      if (socket) {
        socket.emit("new:message", {
          _id: res.data._id,
          media: {
            url: res.data.media.url,
            public_id: res.data.media.public_id,
          },
          type: res.data.type,
          ...(type === "group"
            ? { group: id }
            : {
                receiver: {
                  _id: id,
                  username: data?.username,
                  profilePic: data?.profilePic,
                },
              }),
          isGroup: type === "group",
        });

        setData((prev) => {
          const newData = {
            ...prev,
            data: [
              {
                _id: res.data._id,
                media: {
                  url: res.data.media.url,
                  public_id: res.data.media.public_id,
                },
                type: res.data.type,
                createdAt: new Date(),
                sender: {
                  _id: user?._id,
                  username: user?.username,
                  profilePic: user?.profilePic,
                },
                ...(type === "group"
                  ? { group: id }
                  : {
                      receiver: {
                        _id: id,
                        profilePic: data?.profilePic,
                        username: data?.username,
                        profilePic: user?.profilePic,
                      },
                    }),
                isGroup: type === "group",
              },
              ...prev.data,
            ],
          };
          return newData;
        });
      }
    } else {
      toast({
        description: res?.message,
      });
    }
    setLoader(false);
  };
  const handleSendMessage = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const newMessage = {
          message,
          ...(type === "group"
            ? { group: id }
            : {
                receiver: {
                  _id: id,
                  username: data?.username,
                  profilePic: data?.profilePic,
                },
              }),
          ...(type == "group" && {
            members: data?.members,
          }),
          isGroup: type === "group",
          type: "text",
        };
        setShowEmoji(false);
        if (socket) {
          socket.emit("new:message", { ...newMessage });
        }
        setData((prev) => {
          const newData = {
            ...prev,
            data: [
              {
                message: message,
                createdAt: new Date(),
                sender: {
                  _id: user?._id,
                  username: user?.username,
                  profilePic: user?.profilePic,
                },
                ...(type === "group"
                  ? { group: id }
                  : {
                      receiver: {
                        _id: id,
                        profilePic: data?.profilePic,
                        username: data?.username,
                      },
                    }),
                type: "text",
                isGroup: type === "group",
              },
              ...prev.data,
            ],
          };
          return newData;
        });
        setMessage("");
      }
    },
    [message, id, type, socket]
  );

  const handleUserTypingStatus = useCallback(() => {
    if (socket) {
      socket.emit("user:typing", {
        receiverId: id,
        isGroup: type === "group",
      });
      if (typingTimeOut) {
        clearTimeout(typingTimeOut);
      }
      const newTimeOut = setTimeout(() => {
        socket.emit("user:stopTyping", {
          receiverId: id,
          isGroup: type === "group",
        });
      }, 1000);
      setTypingTimeOut(newTimeOut);
    }
  }, [id, socket, type, typingTimeOut]);

  useEffect(() => {
    return () => {
      if (typingTimeOut) {
        clearTimeout(typingTimeOut);
      }
    };
  }, [typingTimeOut]);

  const handleMessage = (e) => {
    setMessage(e.target.value);
    handleUserTypingStatus();
  };

  return (
    <div className="flex bg-[#dcdcff]  rounded-md gap-4 justify-between items-center px-4 py-1">
      <div className="flex relative  w-10 items-center justify-center ">
        <Paperclip className=" absolute left-0 -top-3 w-10" />
        <input
          type="file"
          className="absolute left-0 -top-3 w-10 opacity-0 "
          onChange={handleFile}
          readOnly={loader}
        />
        {loader && (
          <span className="flex justify-around items-center absolute left-6 -top-3 w-10">
            <LoaderCircle className="animate-spin" />
          </span>
        )}
      </div>

      <EmojiPicker
        setMessage={setMessage}
        disabled={loader}
        setShowEmoji={setShowEmoji}
        showEmoji={showEmoji}
      />

      <div className="flex-1">
        <Input
          className="bg-[#dcdcff] text-black focus:outline-none focus:ring-0 focus:border-none text-[19px]"
          readOnly={loader}
          placeholder="Type a message"
          onChange={handleMessage}
          onKeyDown={handleSendMessage}
          value={message}
          on
        />
      </div>

      <AudioRecording disabled={loader} handleFile={handleFile} />
    </div>
  );
}

export default Message;
