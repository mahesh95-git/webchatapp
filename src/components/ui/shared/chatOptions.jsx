"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "../use-toast";
import React from "react";
import useUpdateData from "@/customsHook/updateData";
function ChatOptions({ children, ...props }) {
  const { toast } = useToast();
  const {updateData}=useUpdateData()
  const handleDelete = async() => {
   const response=await updateData("delete",`/api/user/chats/${props.chat._id}`)


   if(response?.success){
    toast({
      description: "chat deleted successfully",
      title: "success",
    });
    props. setData((prev) => {
        const newData = {
          ...prev,
          data: prev.data.filter((item) => item._id !== props.chat._id),
        };
        return newData;
      });

   }else{
    toast({
      description: response?.message,
      title: "error",
    });
   }



  };
  const handleSaveAs = async () => {
    if (props.chat?.type !== "text") {
      if (props.chat?.media?.url) {
        try {
          const response = await fetch(props.chat.media.url, { mode: "cors" });
          if (!response.ok) {
            throw new Error("Failed to fetch the file.");
          }
          const blob = await response.blob();

          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.href = url;
          const fileName = props.chat.media.url.split("/").pop() || "download";
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading the file:", error.message);
        }
      } else {
        console.error("Media URL is not available.");
      }
    }
  };

  const handleCopy = () => {
    if (props.chat?.type === "text") {
      navigator.clipboard.writeText(props.chat.message);
    } else {
      navigator.clipboard.writeText(props.chat.media.url);
    }

    toast({
      title: "Copied",
    });
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleDelete}>Delete for me</ContextMenuItem>
        {props.chat?.type!=="text" && <ContextMenuItem onClick={handleSaveAs}>Save as</ContextMenuItem>}
        <ContextMenuItem onClick={handleCopy}>{props.chat?.type === "text" ? "Copy" : "Copy link"}</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default ChatOptions;
