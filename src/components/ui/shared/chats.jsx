import Image from "next/image";
import React from "react";

function Chats() {
    const date=new Date(Date.now())
  return (
    <div className="p-10 flex flex-col gap-3 max-h-[76vh] overflow-y-scroll scrollbar-custom">
      <div>

        <div className="text-black flex justify-center ">
            <div className="bg-[#e2e3e4cc] p-1 rounded-lg text-sm">
            <span>{date.getDate()}</span>-
            <span>{date.getMonth()}</span>-
            <span>{date.getFullYear()}</span>
            </div>
        </div>
      <div className="flex items-end w-full  flex-col gap-3 mt-2">
        <div className="flex  w-1/3">
          <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
            <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
            <p className="text-[#3e3e40]">
              Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
            </p>
          </div>
        </div>
        <div className="flex  w-1/3">
          <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
            <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
            <p className="text-[#3e3e40]">
              Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
            </p>
          </div>
        </div>
        
      </div>

      <div className="flex items-start  w-full flex-col gap-3">
        <div className="flex w-1/3">
          <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
            {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
            <p className="text-white">
              Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
            </p>
          </div>
        </div>
        <div className="flex w-1/3">
          <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
            {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
            <p className="text-white">
              Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
            </p>
          </div>
        </div>
        
      </div>
      </div>
      <div>

        <div className="text-black flex justify-center ">
            <div className="bg-[#e2e3e4cc] p-1 rounded-lg text-sm">
            <span>{date.getDate()}</span>-
            <span>{date.getMonth()}</span>-
            <span>{date.getFullYear()}</span>
            </div>
        </div>
      <div className="flex items-end w-full  flex-col gap-3 mt-2">
        <div className="flex  w-1/3">
          <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
            <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
            <p className="text-[#3e3e40]">
              Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
            </p>
          </div>
        </div>
        <div className="flex  w-1/3">
          <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
            <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
            <p className="text-[#3e3e40]">
              Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
            </p>
          </div>
        </div>
        
      </div>

      <div className="flex items-start  w-full flex-col gap-3">
        <div className="flex w-1/3">
          <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
            {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
            <p className="text-white">
              Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
            </p>
          </div>
        </div>
        <div className="flex w-1/3">
          <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
            {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
            <p className="text-white">
              Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
            </p>
          </div>
        </div>
        
      </div>
      </div>
      <div>

<div className="text-black flex justify-center ">
    <div className="bg-[#e2e3e4cc] p-1 rounded-lg text-sm">
    <span>{date.getDate()}</span>-
    <span>{date.getMonth()}</span>-
    <span>{date.getFullYear()}</span>
    </div>
</div>
<div className="flex items-end w-full  flex-col gap-3 mt-2">
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>

<div className="flex items-start  w-full flex-col gap-3">
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>
</div>
<div>

<div className="text-black flex justify-center ">
    <div className="bg-[#e2e3e4cc] p-1 rounded-lg text-sm">
    <span>{date.getDate()}</span>-
    <span>{date.getMonth()}</span>-
    <span>{date.getFullYear()}</span>
    </div>
</div>
<div className="flex items-end w-full  flex-col gap-3 mt-2">
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>

<div className="flex items-start  w-full flex-col gap-3">
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>
</div>
<div>

<div className="text-black flex justify-center ">
    <div className="bg-[#e2e3e4cc] p-1 rounded-lg text-sm">
    <span>{date.getDate()}</span>-
    <span>{date.getMonth()}</span>-
    <span>{date.getFullYear()}</span>
    </div>
</div>
<div className="flex items-end w-full  flex-col gap-3 mt-2">
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>

<div className="flex items-start  w-full flex-col gap-3">
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>
</div>
<div>

<div className="text-black flex justify-center ">
    <div className="bg-[#e2e3e4cc] p-1 rounded-lg text-sm">
    <span>{date.getDate()}</span>-
    <span>{date.getMonth()}</span>-
    <span>{date.getFullYear()}</span>
    </div>
</div>
<div className="flex items-end w-full  flex-col gap-3 mt-2">
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>

<div className="flex items-start  w-full flex-col gap-3">
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>
</div>
<div>

<div className="text-black flex justify-center ">
    <div className="bg-[#e2e3e4cc] p-1 rounded-lg text-sm">
    <span>{date.getDate()}</span>-
    <span>{date.getMonth()}</span>-
    <span>{date.getFullYear()}</span>
    </div>
</div>
<div className="flex items-end w-full  flex-col gap-3 mt-2">
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex  w-1/3">
  <div className="bg-[#dcdcff] p-2 rounded-lg rounded-bl-none ">
    <h1 className="text-[#3d3e6f] font-bold">mahesh</h1>
    <p className="text-[#3e3e40]">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>

<div className="flex items-start  w-full flex-col gap-3">
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>
<div className="flex w-1/3">
  <div className="bg-[#7679ee] p-2 rounded-lg rounded-bl-none ">
    {/* <h1 className="text-[#3d3e6f] font-bold">mahesh</h1> */}
    <p className="text-white">
      Lorem ipsum dolor sit amet fjkdlj jlfd fldkja fkldj
    </p>
  </div>
</div>

</div>
</div>

    </div>
  );
}

export default Chats;
