import Image from "next/image";
import Link from "next/link";
import { FaUserGroup } from "react-icons/fa6";
import { MdChatBubble } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import Request from "@/components/ui/shared/request";
import Logout from "@/components/ui/shared/logout";

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
    },
  ];
  return (
    <div className="bg-[#202022] w-full h-screen grid grid-cols-[80px_1fr] grid-rows-1  py-3 pr-3">
      <div className="flex flex-col w-20 justify-between p-1 items-center  px-3  py-4">
        <div className="">
          <Image
            src={"/coffeechat.jpg"}
            alt="logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="  mt-12 flex-1 flex flex-col  ">
          <ul className="flex flex-col gap-10 w-full">
            <Request />

            {data.map((item) => (
              <li key={item.name}>
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
       <Logout />
      </div>
      <div className="bg-[#f9fafc] rounded-3xl ">
       
          {children}
       
      </div>
    </div>
  );
}
