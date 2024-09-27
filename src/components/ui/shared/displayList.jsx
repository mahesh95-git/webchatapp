import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../button";

function DisplayList({ data, handler, type,loader }) {
    
    return (
      <div>
        <ScrollArea className="h-[250px] w-full rounded-md border p-4">
          {data?.length > 0 ? (
            data.map((value) => (
              <div key={value?._id} className="flex items-center justify-between mt-1 border-2 p-2 rounded-md">
                <Avatar>
                  <AvatarImage src={value?.profilePic?.url} />
                  <AvatarFallback>
                    {value?.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p>{value?.username}</p>
                <Button
                className="rounded-full"
                  disabled={loader}
                  onClick={() => handler({ username: value?.username, id: value?._id })}
                >
                  <Plus />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center">No {type} found</p>
          )}
        </ScrollArea>
      </div>
    );
  }
  

export default DisplayList;
