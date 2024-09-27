import ChatListing from "@/components/ui/shared/chatListing";
import React from "react";

function page({ searchParams, params, pathname }) {
  
  const urlSearchParams= new URLSearchParams(searchParams)
   const type = urlSearchParams.get("type")
  const { id } = params;
  return (
 
      <ChatListing id={id} type={type} />
    
  );
}

export default page;
