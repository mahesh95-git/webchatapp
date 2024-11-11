"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import AddNew from "./addNew";
import useFetchData from "@/customsHook/FetchData";
import { useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socketContext";
import { UserContext } from "@/context/userContext";
import DisplayStatus from "./displayStatus";

function ListLayout({ path, type }) {
  const [refresh, setRefresh] = useState(false);
  const [chat, setChat] = useState([]);
  const [search, setSearch] = useState("");
  const { user, loader: loader1 } = useContext(UserContext);

  const socket = useContext(SocketContext);
  const { loader, data } = useFetchData({
    path: `/api/user/${type}`,
    method: "get",
    headers: {},
    dependencies: [refresh],
  });

  const getStoredChatData = () => {
    const storedData = localStorage.getItem("chatData");
    return storedData ? JSON.parse(storedData) : {};
  };

  const storeChatData = (updatedChat) => {
    const chatData = updatedChat.reduce((acc, curr) => {
      acc[curr._id] = {
        count: curr.count,
        recentMessage: curr.recentMessage,
        date: curr.lastSeen || "Unknown",
      };
      return acc;
    }, {});
    localStorage.setItem("chatData", JSON.stringify(chatData));
  };
  useEffect(() => {
    const storedChatData = getStoredChatData();

    if (type !== "status" && data) {
      const chatWithStoredData = data.map((chat) => ({
        ...chat,
        count: storedChatData[chat._id]?.count || 0,
        recentMessage: storedChatData[chat._id]?.recentMessage || "",
        lastSeen: storedChatData[chat._id]?.date || chat.lastSeen || "Unknown",
      }));
      setChat(chatWithStoredData);
    } else {
      console.log(user);
      setChat(data);
    }
  }, [data]);

  useEffect(() => {
    if (type !== "status" && socket) {
      const handleRefreshChat = () => {
        setRefresh((prev) => !prev);
      };

      const handleNewMessageAlert = (data) => {
        setChat((prev) => {
          const updatedChat = prev.map((chat) => {
            if (data.isGroup && chat._id === data.group) {
              return {
                ...chat,
                count: (chat.count || 0) + 1,
                recentMessage: data.message,
                lastSeen: new Date().toLocaleString(),
              };
            } else if (!data.isGroup && chat._id === data.sender._id) {
              return {
                ...chat,
                count: (chat.count || 0) + 1,
                recentMessage: data.message,
                lastSeen: new Date().toLocaleString(),
              };
            }
            return chat;
          });
          storeChatData(updatedChat);
          return updatedChat;
        });
      };

      socket.on("refresh:chat", handleRefreshChat);
      socket.on("new:messageAlert", handleNewMessageAlert);
      return () => {
        socket.off("refresh:chat", handleRefreshChat);
        socket.off("new:messageAlert", handleNewMessageAlert);
      };
    }
  }, [socket]);

  const handleSearch = useCallback(
    (e) => {
      setSearch(e.target.value);

      if (e.target.value === "") {
        setChat(data);
      }
      if (data) {
        const filteredData = data.filter((value) => {
          if (
            value.type === "friend" &&
            value?.username
              ?.toLowerCase()
              .includes(e.target.value.toLowerCase())
          ) {
            return value;
          } else {
            if (
              value.type === "group" &&
              value?.name?.toLowerCase().includes(e.target.value.toLowerCase())
            ) {
              return value;
            }
          }
        });
        setChat(filteredData);
      }
    },
    [data, search]
  );
  const handleSetChat = () => {
    setChat((prev) => {
      const updatedChat = prev.map((chat) => {
        if (chat._id === value._id) {
          return {
            ...chat,
            count: 0,
          };
        }
        return chat;
      });
      storeChatData(updatedChat);
      return updatedChat;
    });
  };
  const [openStatusView, setOpenStatusView] = useState(false);
  const [statusId, setStatusId] = useState(0);
  const viewStateHandler = (id) => {
    setStatusId(id);
    setOpenStatusView(!openStatusView);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Check if the date is today
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `Today ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    // Check if the date is yesterday
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday ${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    // Return time in HH:MM format for earlier dates
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };
  console.log(chat)
  return (
    <div>
      <div>
        <Input
          placeholder="Search"
          className="bg-[#dcdcff] text-black"
          onChange={handleSearch}
        />
      </div>
      <div className="flex flex-col h-[calc(100vh-100px)]  gap-1 overflow-y-scroll scrollbar-custom mt-2 ">
        {type !== "allchat" ? (
          <AddNew type={type} viewStateHandler={viewStateHandler} />
        ) : (
          <AddNew type={"friend"} viewStateHandler={viewStateHandler} />
        )}

        {loader ? (
          <p>Loading...</p>
        ) : (
          chat &&
          chat.map((value) =>
            type === "friend" || type === "group" || type == "allchat" ? (
              <Link
                href={`${path}/${value._id}?type=${value.type}`}
                key={value._id}
              >
                <UserCard
                  value={value}
                  setChat={setChat}
                  storeChatData={storeChatData}
                  handler={handleSetChat}
                  type={type}
                  formatDate={formatDate}
                />
              </Link>
            ) : (
              value?.owner != user?._id && (
                <div key={value?.username}>
                  <UserCard
                    value={value}
                    handler={setChat}
                    storeChatData={storeChatData}
                    type={type}
                    user={user}
                    viewStateHandler={viewStateHandler}
                    formatDate={formatDate}
                    isViewed={value?.status.every((status) =>
                      status.views.includes(user?._id))}
                  />
                </div>
              )
            )
          )
        )}
        <DisplayStatus
          statusId={statusId}
          openStatusView={openStatusView}
          setOpenStatusView={setOpenStatusView}
          viewStateHandler={viewStateHandler}
          formatDate={formatDate}
          chat={chat}
          setChat={setChat}
        />
      </div>
    </div>
  );
}

const UserCard = ({
  value,
  handler,
  type,
  isViewed,
  viewStateHandler,
  formatDate,
}) => {
  return (
    <div
      className="h-35 flex p-2 rounded-sm items-center w-full justify-between gap-2 border-2 "
      onClick={type == "status" ? () => viewStateHandler(value.owner) : handler}
    >
      <Avatar
        className={`h-12 w-12 border-4`}
        style={{
          ...(type === "status" && {
            borderColor: isViewed && type == "status" ? "#c6cbd0" : "#7facdf",
          }),
        }}
      >
        <AvatarImage src={value?.profilePic?.url} />
        <AvatarFallback>
          {value?.type === "friend" || value?.type === "status"
            ? value?.username[0].toUpperCase()
            : value?.name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="h-full flex-1">
        <h2 className="font-bold">
          {value?.type === "friend" || value?.type === "status"
            ? value?.username
            : value?.name}
        </h2>
        {value?.recentMessage && (
          <p className="text-sm h-[21] overflow-hidden text-nowrap w-[100px] ">
            {value?.recentMessage?.split(" ").slice(0, 3).join(" ") +
              (value?.recentMessage.split(" ").length > 3 ? "..." : "")}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        {value?.lastSeen ? (
          <p className="text-sm">{value?.lastSeen}</p>
        ) : (
          <p>{value?.status&&formatDate(value?.status[0]?.createdAt)}</p>
        )}
        {value?.count > 0 && (
          <p className="bg-orange-600 text-white text-sm px-1 w-6 h-6 rounded-full text-center">
            {value?.count}
          </p>
        )}
      </div>
    </div>
  );
};

export default ListLayout;
