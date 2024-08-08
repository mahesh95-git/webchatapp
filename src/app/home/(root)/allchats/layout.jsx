import ListLayout from "@/components/ui/shared/listLayout";
import React from "react";

function layout({ children, chats }) {
  const data=[{
    id:"2",
    name:"mahesh",
    msg:"hello",
    image:"/pngegg.png",
    lastSeen:"10",

  },
  {
    id:"3",
    name:"mahesh",
    msg:"hello",
    image:"/pngegg.png",
    lastSeen:"10",

  },
  {
    id:"4",
    name:"mahesh",
    msg:"hello",
    image:"/pngegg.png",
    lastSeen:"10",

  },
  {
    id:"5",
    name:"mahesh",
    msg:"hello",
    image:"/pngegg.png",
    lastSeen:"10",

  },
  {
    id:"6",
    name:"mahesh",
    msg:"hello",
    image:"/pngegg.png",
    lastSeen:"10",

  },
]
  return <div className="w-full  min-h-full flex">
    <ListLayout data={data} path="/home/allchats" />
    {children}
    
    </div>;
}

export default layout;
