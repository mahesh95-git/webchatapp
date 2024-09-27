import ChatListing from "@/components/ui/shared/chatListing";
import React from "react";

function page({ searchParams, params, pathname }) {
  
  const urlSearchParams= new URLSearchParams(searchParams)
   const type = urlSearchParams.get("type")
  const {userId } = params;
 
  return (
 
      <ChatListing id={userId} type={type} />
    
  );
}

export default page;
