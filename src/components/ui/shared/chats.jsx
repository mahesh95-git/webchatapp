import React from "react";
import ChatOptions from "./chatOptions";
import { File } from 'lucide-react';
function Chats({ data = [], user, type,setData }) {
  const setHours = (date) => {
    let newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const dayStartDate = setHours(Date.now());
  const yesterday = setHours(dayStartDate.getTime() - 24 * 60 * 60 * 1000);

  const groupedData = data.reduce((acc, obj) => {
    const createdAt = new Date(obj.createdAt);
    const dateLabel = createdAt.toDateString();

    if (dayStartDate <= createdAt) {
      if (!acc["Today"]) {
        acc["Today"] = [];
      }
      acc["Today"].push(obj);
    } else if (yesterday <= createdAt) {
      if (!acc["Yesterday"]) {
        acc["Yesterday"] = [];
      }
      acc["Yesterday"].push(obj);
    } else {
      if (!acc[dateLabel]) {
        acc[dateLabel] = [];
      }
      acc[dateLabel].push(obj);
    }
    return acc;
  }, {});

  return Object.keys(groupedData).map((key) => (
    <React.Fragment key={key}>
      {groupedData[key].map((chat, index) => (
        <div key={chat._id}>
          {chat.isGroup ? (
            // If it's a group chat, check if the current user is not the sender
            user !== chat.sender?._id.toString() ? (
              <div className="flex items-end w-full flex-col mt-3">
                <div className="flex mr-16 w-[35%]">
                <ChatOptions chat={chat} type={type} index={index} setData={setData}>
                  <div className="bg-[#dcdcff] p-3 rounded-lg rounded-bl-none">
                    <h1 className="text-[#3d3e6f] font-bold">
                      {chat.sender.username}
                    </h1>
                    {chat.type === "text" ? (
                      <p>{chat.message}</p>
                    ) : chat.type === "image" ? (
                      <img src={chat.media.url} alt="image" />
                    ) : chat.type === "video" ? (
                      <video src={chat.media.url} alt="video" controls />
                    ) : chat.type === "audio" ? (
                      <audio src={chat.media.url} alt="audio" controls />
                    ) : (
                      <div>
                      <File />
                   </div>
                    )}
                  </div>
                </ChatOptions>
                </div>
              </div>
            ) : (
              <div className="flex items-start w-full flex-col mt-3">
                <div className="flex ml-24 w-[35%]">
                <ChatOptions chat={chat} type={type} index={index}setData={setData}>
                  <div className="bg-[#7679ee] p-3 rounded-lg rounded-bl-none">
                    <h1 className="text-[#252528] font-bold"></h1>
                    {chat.type === "text" ? (
                      <p>{chat.message}</p>
                    ) : chat.type === "image" ? (
                      <img src={chat.media.url} alt="image" />
                    ) : chat.type === "video" ? (
                      <video src={chat.media.url} alt="video" controls />
                    ) : chat.type === "audio" ? (
                      <audio controls>
                        <source src={chat.media.url} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                      </audio>
                    ) : (
                      <div>
                         <File />
                      </div>
                    )}
                  </div>
                </ChatOptions>
                </div>
              </div>
            )
          ) : (
            // If it's an individual chat, check if the current user is the receiver
            user === chat.receiver?._id.toString() ? (
              <div className="flex items-end w-full flex-col mt-3">
               <div className="flex mr-16 w-[35%]">
               <ChatOptions chat={chat} type={type} index={index} setData={setData}>
                  <div className="bg-[#dcdcff] p-3 rounded-lg rounded-bl-none">
                    <h1 className="text-[#3d3e6f] font-bold">
                      {chat.sender.username}
                    </h1>
                    
                    {chat.type === "text" ? (

                     <p>{chat.message}</p> 
                 
                    ) : chat.type === "image" ? (
                      <img src={chat.media.url} alt="image" />
                    ) : chat.type === "video" ? (
                      <video src={chat.media.url} alt="video" controls />
                    ) : chat.type === "audio" ? (
                      <audio src={chat.media.url} alt="audio" controls />
                    ) : (
                     
                      <div>
                      <File />
                   </div>
                      
                    )}
                  </div>
               </ChatOptions>
                </div>
              </div>
            ) : (
              <div className="flex items-start w-full flex-col mt-3">
               <div className="flex ml-24 w-[35%]">
               <ChatOptions chat={chat} type={type} index={index} setData={setData}>
                  <div className="bg-[#7679ee] p-3 rounded-lg rounded-bl-none">
                    <h1 className="text-[#252528] font-bold"></h1>
                    {chat.type === "text" ? (
                    
                       <p>{chat.message}</p> 
                     
                    ) : chat.type === "image" ? (
                      <img src={chat.media.url} alt="image" />
                    ) : chat.type === "video" ? (
                      <video src={chat.media.url} alt="video" controls />
                    ) : chat.type === "audio" ? (
                      <audio controls>
                        <source src={chat.media.url} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                      </audio>
                    ) : (
                      <div className="w-12 h-12 ">
                      <File width={30} height={30} />
                   </div>
                    )}
                  </div>
               </ChatOptions>
                </div>
              </div>
            )
          )}
        </div>
      ))}
      {/* Display Date Heading */}
      <div className="text-black flex justify-center">
        <div className="bg-[#e2e3e4cc] p-1 rounded-lg text-sm">
          <span>{key}</span>
        </div>
      </div>
    </React.Fragment>
  ));
}

export default Chats;
