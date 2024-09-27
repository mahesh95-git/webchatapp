"use client";
import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Members({
  data,
  admin,
  user,
  handleRemoveMember,
  handleChangeRole,
  handleRemoveAdmin,
}) {
  return (
    <div className="w-full max-h-[600px] overflow-y-scroll">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((member) => (
              <ContextMenu key={member._id}>
                <ContextMenuTrigger asChild>
                  <TableRow>
                    <TableCell>
                      {member.username}
                      {admin.includes(member._id) && (
                        <span className="ml-2 text-white bg-green-950 rounded-full px-2">
                          Admin
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  {admin.includes(user._id) && (
                    <>
                      <ContextMenuItem
                        onClick={() => handleRemoveMember(member._id)}
                      >
                        Remove
                      </ContextMenuItem>
                      {admin.includes(member._id) ? (
                        <ContextMenuItem
                          onClick={() => handleRemoveAdmin(member._id)}
                        >
                          Remove Admin
                        </ContextMenuItem>
                      ) : (
                        <ContextMenuItem
                          onClick={() => handleChangeRole(member._id)}
                        >
                          Make admin
                        </ContextMenuItem>
                      )}
                    </>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Members;
