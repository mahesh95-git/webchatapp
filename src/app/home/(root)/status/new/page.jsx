"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useUpdateData from "@/customsHook/updateData";
import { LoaderCircle, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

function Page({ params, searchParams }) {
  const [color, setColor] = useState("#b29f9f");
  const { updateData, loading } = useUpdateData();
  const fileRef = useRef(null);
  const hasClickedRef = useRef(false);
  const { toast } = useToast();
  const [hidden, setHidden] = useState("flex");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const { type } = searchParams;
  const router = useRouter();
  const [caption, setCaption] = useState("");
const textareaRef=useRef()
  useEffect(() => {
    if (type !== "text" && fileRef.current && !hasClickedRef.current) {
      fileRef.current.click();
      hasClickedRef.current = true;
    }
    if(textareaRef.current){
      textareaRef.current.focus()
    }
  }, [type]);

  const handleAddNewStatus = async () => {
    const form = new FormData();
    if(type=="text"){
      form.append("type", type);
    }
    else if(type=="file"&&file?.type.startsWith("video/")|| file?.type.startsWith("image/") ){
      form.append("type",file.type.startsWith("video/")?"video":'image')
    }else{
      toast({
        description:"unsupported file format"
      })
      handleTextStatus()
    }
    
    form.append("background", color);
    form.append("content", content);
    form.append("file", file);
    form.append("caption", caption);
    
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    const res = await updateData("post", "/api/user/status", form, headers);
    if (res?.success) {
      toast({
        description: res.message,
      });
      handleTextStatus()
    } else {
      toast({
        description: res.message,
      });
    }
  };

  const handleTextStatus = () => {
    router.back();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
    } else {
      handleTextStatus(); // If no file is selected, go back
    }
  };

  const handleFileCancel = () => {
    // // Check if the file input is empty and navigate back
    // if (!file) {
    //   handleTextStatus();
    // }
  };

  return (
    <div
      className={`w-full h-full gap-[6.5rem] absolute top-0 bottom-0 right-0 left-0 z-10 flex justify-center items-center p-10 flex-col`}
      style={{ background: type === "text" ? color : "white", display: hidden }}
    >
      <div className="w-full flex justify-between items-center p-1">
        <X onClick={handleTextStatus} className="cursor-pointer" />
        <div className="flex items-center justify-center gap-10">
          {type === "text" && (
            <Input
              type="color"
              className="w-14 rounded-full h-14"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          )}
          {!loading ? (
            <Send onClick={() => handleAddNewStatus()} />
          ) : (
            <span className="flex justify-around items-center w-full">
              <LoaderCircle className="animate-spin" /> Processing...
            </span>
          )}
        </div>
      </div>
      {type === "text" ? (
        <textarea
          className="h-[90%] text-center text-2xl border-none focus:border-none focus:outline-none resize-none w-full"
          style={{ background: color }}
          value={content}
          ref={textareaRef}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Input
            type="file"
            className="hidden"
            ref={fileRef}
            onChange={handleFileChange}
            onClick={() => {
              setTimeout(handleFileCancel, 500); // Set a timeout to check if file was selected or not
            }}
          />
          {fileUrl && (
            file?.type.startsWith("image/") ? (
              <img src={fileUrl} alt="Selected" className="max-w-full max-h-[26rem]" />
            ) : file?.type.startsWith("video/") ? (
              <video controls className="max-w-full max-h-[26rem]">
                <source src={fileUrl} type={file.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Unsupported file format</p>
            )
          )}
        </div>
      )}
      <Input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
    </div>
  );
}

export default Page;
