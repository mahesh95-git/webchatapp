import Image from "next/image";
import {  LogOut, MessageSquare } from "lucide-react";
import Link from "next/link";
import { FaUserGroup } from "react-icons/fa6";
import { MdChatBubble } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

export default function RootLayout({ children }) {
  const data = [
    {
      name: "Allchats",
      icon: <MdChatBubble className="text-[#898788] text-2xl" />,
      path: "/home/allchats",
    },
    {
      name: "Friends",
      icon: <FaUserGroup className="text-[#898788] text-2xl" />,
      path: "/home/friends",
    },
    {
      name: "Groups",
      icon: <FaUserFriends className="text-[#898788] text-2xl" />,
      path: "/home/groups",
    },
    {
      name: "Profile",
      icon: <IoPerson className="text-[#898788] text-2xl" />,
      path: "/home/profile",
    }
    
  ];
  return (
    <div className="bg-[#202022] w-full min-h-screen flex py-3 pr-3">
      <div className="flex flex-col  justify-between p-1 items-center  px-3  py-4">
        <div className="">
          <Image src={"/pngegg.png"} alt="logo" width={40} height={40} />
        </div>
        <div className="  mt-12 flex-1 flex flex-col  ">
          <ul className="flex flex-col gap-10 w-full">
            {data.map((item) => (
              <li>
                <Link
                  className="text-[#898788] text-[12px] flex justify-center flex-col  items-center"
                  href={item.path}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <LogOut className="text-[#898788] text-[12px]" />
          <p className="text-[#898788] text-[12px]">Logout</p>
        </div>
      </div>
      <div className="bg-[#f9fafc] w-full min-h-full   rounded-3xl px-6 py-[14px]">
        {children}
      </div>
    </div>
  );
}
