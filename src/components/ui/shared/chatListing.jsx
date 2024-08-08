"use client";
import React from "react";
import { FiPhone } from "react-icons/fi";




import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDeviceCameraVideo } from "react-icons/go";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import Chats from "./chats";
import EmojiPicker from "@/components/ui/shared/emojiPicker"
import AudioRecording from "./audioRecording";

function ChatListing() {
const data=[{
  id:"jkdklfk",
  name:'mahesh',
  pic:'/pngegg.png',
  isGroup:false,
  member:100,
 
  lastSeen:'10'
}]

  return (
    <div className="w-full flex h-full flex-col">
      <div className="flex justify-between  w-full border-b-2 items-center p-2">
        <div>
          <h1 className="text-2xl font-bold">Hello</h1>
          <p>23 members 10 online</p>
        </div>
        <div className="flex gap-10">
          <FiPhone className="text-2xl" />
          <GoDeviceCameraVideo className="text-2xl" />
          <BsThreeDotsVertical className="text-2xl" />
        </div>
      </div>
      <div></div>
      <div className="flex-1">
        <Chats />
      </div>
      <div className="flex bg-[#dcdcff] mx-5 rounded-md gap-4 justify-between items-center px-4 py-1">
        <div>
          <Paperclip />
        </div>
        <div >
         <EmojiPicker/>
        </div>
        <div className="flex-1">
          <Input
            placeholder="message"
            className="bg-[#dcdcff] text-black focus:outline-none focus:ring-0 focus:border-none focus:shadow-none"
            style={{
              outline: "none !important",
              boxShadow: "none !important",
              border: "none !important",
            }}
          />
        </div>
        <div>
          <Send />
        </div>
        <div>
          <AudioRecording/>
        </div>
      </div>
    </div>
  );
}

export default ChatListing;
