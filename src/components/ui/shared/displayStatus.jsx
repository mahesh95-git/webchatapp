"use client";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import useUpdateData from "@/customsHook/updateData";
import { GoMute, GoUnmute } from "react-icons/go";
import { UserContext } from "@/context/userContext";
import { useToast } from "../use-toast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ScrollArea } from "../scroll-area";
function DisplayStatus({
  openStatusView,
  viewStateHandler,
  formatDate,
  statusId,
  setOpenStatusView,
  chat = [],
  setChat,
}) {
  const [statusProgress, setStatusProgress] = useState("");
  const [statusData, setStatusData] = useState([]);
  const { toast } = useToast();
  const [openViews, setOpenViews] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const { updateData } = useUpdateData();
  const { user } = useContext(UserContext);
  const [previousIndex, setPreviousIndex] = useState(0);
  const timeoutRef = useRef(null);
  const timeInterval = useRef(null);
  const [mute, setMute] = useState(false);
  const [progressBarDaley, setProgressBarDaley] = useState(0);
  const [isPause, setIsPause] = useState(false);
  useEffect(() => {
    if (statusId && chat.length) {
      const match = chat.filter((value) => statusId === value.owner);
      const notMatch = chat.filter((value) => statusId !== value.owner);

      setStatusData([...match, ...notMatch]);
      setStatusProgress(match[0]);
      setCurrentIndex(0);
      setNextIndex(0);
      setProgressBarDaley(0);
      setPreviousIndex(0);
    }
  }, [statusId, chat]);

  const updateProgressBar = (delay) => {
    clearInterval(timeInterval.current);
    const increment = 100 / (delay / 100); // Update progress every 100ms
    timeInterval.current = setInterval(() => {
      if (!isPause) {
        setProgressBarDaley((prev) => {
          if (prev >= 100) {
            clearInterval(timeInterval.current);
            return 100;
          }
          return prev + increment;
        });
      }
    }, 100);
  };
  useEffect(() => {
    if (statusProgress) {
      const currentStatus = statusProgress.status[currentIndex];
      let delay = 10000;

      if (currentStatus.type === "video") {
        const videoElement = document.getElementById(
          `video-${currentStatus._id}`
        );
        if (videoElement) {
          videoElement.onloadedmetadata = () => {
            delay = videoElement.duration * 1000 || 30000;
            setAutoSlide(delay);
          };
        }
      } else {
        setAutoSlide(delay);
      }

      updateProgressBar(delay);
      return () => {
        setProgressBarDaley(0);
        clearTimeout(timeoutRef.current);
        clearInterval(timeInterval.current);
      };
    }
  }, [statusProgress, currentIndex, isPause]);
  const handleAddView = async (id) => {
    try {
      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const res = await updateData(
        "patch",
        `/api/user/status/${id}`,
        {},
        headers
      );

      if (res?.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const setAutoSlide = (delay) => {
    clearTimeout(timeoutRef?.current);
    handleAddView(statusProgress.status[currentIndex]._id);
    timeoutRef.current = setTimeout(() => {
      if (!isPause) handleNext();
    }, delay);
  };

  const handleDeleteStatus = async () => {
    try {
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      const id = statusProgress.status[currentIndex]._id;
      const res = await updateData(
        "delete",
        `/api/user/status/${id}`,
        {},
        headers
      );

      if (res?.success) {
        const updatedStatusArray = statusProgress.status.filter(
          (value) => value._id !== id
        );

        if (updatedStatusArray.length > 0) {
          setStatusProgress((prev) => ({
            ...prev,
            status: updatedStatusArray,
          }));
        } else {
          setOpenStatusView(false);
        }
        setStatusData((prevData) =>
          prevData.map((item) =>
            item._id === statusProgress._id
              ? { ...item, status: updatedStatusArray }
              : item
          )
        );
        setChat((prevData) =>
          prevData.map((item) =>
            item._id === statusProgress._id
              ? {
                  ...item,
                  status: updatedStatusArray,
                }
              : item
          )
        );

        setCurrentIndex(0);
        setProgressBarDaley(0);
        toast({
          description: res?.message,
        });
        return true;
      } else {
        toast({
          description: res?.message,
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleNext = async () => {
    if (statusProgress && currentIndex < statusProgress.status.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (nextIndex < statusData.length - 1) {
      const newIndex = nextIndex + 1;
      setStatusProgress(statusData[newIndex]);
      setNextIndex(newIndex);
      setPreviousIndex(newIndex);
      setCurrentIndex(0);
    } else {
      setOpenStatusView(false);
      setIsPause(false)
      setNextIndex(0)
      setPreviousIndex(0)
    }
  };

  const handlePrevious = () => {
    if (statusProgress && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (previousIndex > 0) {
      const newIndex = previousIndex - 1;
      setStatusProgress(statusData[newIndex]);
      setPreviousIndex(newIndex);
      setNextIndex(newIndex);
      setCurrentIndex(statusData[newIndex].status.length - 1);
    }
  };
  const handleMute = () => {
    setMute(!mute);
  };

  const handleViews = () => {
    setOpenViews(!openViews);
  };
  const handlePause = () => {
    setIsPause(!isPause);
  };

  return (
    statusProgress && (
      <Dialog
        open={openStatusView}
        onOpenChange={viewStateHandler}
        className="p-1"
      >
        <DialogContent
          className={`min-h-full w-full p-0 outline-none border-none `}
        >
          <DialogDescription>
            <div
              className="flex flex-col w-full h-full justify-center items-center  text-white pt-1"
              style={{
                background:
                  statusProgress.status[currentIndex].type === "text"
                    ? statusProgress.status[currentIndex].content.background
                    : "black",
              }}
            >
              <div className="flex gap-1  relative w-full">
                <div className="absolute top-0 left-0 right-0 flex items-center gap-2 p-4 bg-gradient-to-b from-black text-white z-50 justify-between">
                  <div className="flex items-center  justify-center gap-2">
                    <Avatar>
                      <AvatarImage src={statusProgress?.profilePic?.url} />
                      <AvatarFallback>
                        {statusProgress?.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <p>{statusProgress.username}</p>
                    <p>
                      {formatDate(
                        statusProgress.status[currentIndex].createdAt
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center items-center">
                    {statusProgress.status[currentIndex].type == "video" && (
                      <div>
                        {mute ? (
                          <GoUnmute
                            className="w-[20px] h-[20px] cursor-pointer"
                            onClick={handleMute}
                          />
                        ) : (
                          <GoMute
                            className="w-[20px] h-[20px] cursor-pointer"
                            onClick={handleMute}
                          />
                        )}
                      </div>
                    )}
                    {statusProgress.owner == user._id && (
                      <div>
                        <Trash2
                          className="w-[20px] h-[20px] cursor-pointer"
                          onClick={handleDeleteStatus}
                        />
                      </div>
                    )}
                    {isPause ? (
                      <Pause
                        className="w-[20px] h-[20px] cursor-pointer"
                        onClick={handlePause}
                      />
                    ) : (
                      <Play
                        className="w-[20px] h-[20px] cursor-pointer"
                        onClick={handlePause}
                      />
                    )}
                  </div>
                </div>
                {statusProgress?.status.map((_, index) => (
                  <Progress
                    key={index}
                    value={currentIndex == index ? progressBarDaley : 0}
                    className="h-1 bg-white z-50"
                  />
                ))}
              </div>
              <div className="w-full min-h-full flex  justify-center items-center relative text-2xl">
                {statusProgress.status[currentIndex].type === "text" && (
                  <div className="text-white text-center p-4">
                    {statusProgress.status[currentIndex].content.text}
                  </div>
                )}
                {statusProgress.status[currentIndex].type === "image" && (
                  <Image
                    src={statusProgress.status[currentIndex].media.url}
                    alt="status"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                  />
                )}
                {statusProgress.status[currentIndex].type === "video" && (
                  <video
                    id={`video-${statusProgress.status[currentIndex]._id}`}
                    src={statusProgress.status[currentIndex].media.url}
                    autoPlay
                    muted={mute}
                    className="w-full h-full object-cover"
                  />
                )}
                {statusProgress.status[currentIndex].caption && (
                  <div className="text-white absolute w-full bottom-5 p-3 text-center bg-[#00000075]">
                    {statusProgress.status[currentIndex].caption}
                  </div>
                )}
              </div>
              <div
                className="absolute -right-10 text-white cursor-pointer"
                onClick={handleNext}
              >
                <ChevronRight className="h-[40px] w-[40px]" />
              </div>
              <div
                className="absolute -left-10 text-white cursor-pointer"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-[40px] w-[40px]" />
              </div>

              {statusProgress.owner == user?._id && (
                <div
                  className="absolute bottom-4 p-2 left-2 rounded-md justify-center items-center bg-gray-400 text-black flex cursor-pointer"
                  onClick={handleViews}
                >
                  <User />
                  <Views
                    openViews={openViews}
                    setOpenViews={setOpenViews}
                    handleViews={handleViews}
                    statusId={statusProgress.status[currentIndex]._id}
                  />
                  <p>views</p>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    )
  );
}

export default DisplayStatus;

const Views = ({ openViews, handleViews, statusId }) => {
  const [data, setData] = useState();
  const { updateData } = useUpdateData();
  useEffect(() => {
    const fetchView = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        const res = await updateData(
          "get",
          `/api/user/status/${statusId}`,
          {},
          headers
        );
        console.log(res);
        if (res?.success) {
          setData(res.data);
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    };
    if (statusId&&openViews) {
      fetchView();
    }
  }, [statusId,openViews]);
  return (
    <Dialog open={openViews} onOpenChange={handleViews}>
      <DialogContent className="max-w-[25vw]">
        <DialogHeader>
          <DialogTitle className="flex gap-1">
            <User />
            {data?.length||0}
          </DialogTitle>
          <DialogDescription>
            <div>
              <ScrollArea className="h-[250px] w-full rounded-md border p-2">
                {data?.length > 0 ? (
                  data.map((value) => (
                    <div
                      key={value?._id}
                      className="flex items-center justify-between mt-1 border-2 p-2 rounded-md"
                    >
                      <Avatar>
                        <AvatarImage src={value?.profilePic?.url} />
                        <AvatarFallback>
                          {value?.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p>{value?.username}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No views found</p>
                )}
              </ScrollArea>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
