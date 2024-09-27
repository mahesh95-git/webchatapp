"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Smile } from "lucide-react";
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
function EmojiPicker({setMessage,showEmoji,setShowEmoji}) {

  const handleEmoji = () => {
    setShowEmoji(!showEmoji);
  };

  const handleGetEmoji = (emojiObject) => {
    setMessage((prev)=>prev+emojiObject.emoji)
  };
  return (
    <div className="cursor-pointer relative">
      <Smile onClick={handleEmoji} />

      {showEmoji && (
        <div className="absolute z-50 top-[-460px]">
          {" "}
          <Picker  onEmojiClick={handleGetEmoji} />
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
