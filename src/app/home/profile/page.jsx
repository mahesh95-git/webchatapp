"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import userSchema from "@/zodSchema/user.Schema";
import { Separator } from "@radix-ui/react-separator";
import { PenSquare, LoaderCircle } from "lucide-react";
import axios from "axios";
import useUpdateData from "@/customsHook/updateData";
import { useToast } from "@/components/ui/use-toast";
import { changePasswordSchema } from "@/zodSchema/changePassword.Schema";
function Page() {
  const { user, loader } = useContext(UserContext);
  const [edit, setEdit] = useState(false);
  const { updateData } = useUpdateData();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [loader2, setLoader] = useState(false);
  const [file, setFile] = useState("");
  const [profile, setProfile] = useState(false);
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      about: "",
    },
  });
  const form2 = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || "",
        email: user.email || "",
        about: user.about || "",
      });
    }
  }, [user, form]);

  const username = form.watch("username");

  useEffect(() => {
    if (username && username !== user?.username) {
      setLoader(true);
      const timeout = setTimeout(async () => {
        try {
          await axios.post(`/api/auth/verifyusername/${username}`);
        } catch (error) {
          form.setError("username", {
            type: "manual",
            message: error.response.data.message,
          });
        } finally {
          setLoader(false);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [username, user?.username, form]);

  const onSubmit = async (values) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("about", values.about);

    if (file) {
      formData.append("profilePic", file);
    }
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const response = await updateData("patch", "/api/user", formData, headers);
    if (response?.success) {
      form.reset({
        username: response.data?.username,
        email: response.data?.email,
        about: response.data?.about,
      });
      if (response.data?.profilePic?.url) {
        setProfile(response.data?.profilePic?.url);
      }
      setEdit(false);
      toast({
        description: response?.message,
      });
    } else {
      toast({
        description: response?.message,
      });
    }
    setLoader(false);
  };

  const onForm2Submit = async (values) => {
    setLoader(true);
    const response =await updateData("post", "/api/user/changepassword", values);
    if (response?.success) {
      toast({
        description: response?.message,
      });
    } else {
      toast({
        description: response?.message,
      });
    }
    form2.reset();
    setIsOpen(false);
    setLoader(false);
  };
  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  return loader ? (
    <p>Loading...</p>
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-[#dcdcff] w-1/3  p-5 rounded-md ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" w-full p-5 space-y-3"
          >
            <div className="flex justify-center items-center">
              {edit ? (
                <div className="flex flex-col justify-center items-center relative">
                  <Input
                    type="file"
                    onChange={handleFile}
                    className="w-24 h-24 rounded-full z-10 opacity-0 cursor-pointer absolute inset-0"
                  />
                  <p className="bg-[#000000c3] text-white p-1 rounded-full w-24 h-24 flex justify-center items-center">
                    <PenSquare />
                  </p>
                </div>
              ) : (
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={profile ? profile : user?.profilePic?.url}
                    alt="profilePic"
                  />
                  <AvatarFallback className="text-2xl">
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <Separator className="bg-[#3d3e6f] h-1 w-full" />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none ring-0"
                      readOnly={!edit}
                    />
                  </FormControl>
                  {loader2 && (
                    <div>
                      <span className="text-red-500 text-sm flex justify-start items-center">
                        <LoaderCircle className="animate-spin mt-1" /> Checking
                        username availability...
                      </span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-[#3d3e6f] h-[0.9px] w-full" />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none ring-0"
                      readOnly={!edit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-[#3d3e6f] h-[0.9px] w-full" />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter about yourself"
                      {...field}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none ring-0 resize-none"
                      readOnly={!edit}
                      rows={5}
                      cols={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-[#3d3e6f] h-[0.9px] w-full" />

            {edit && (
              <>
                <Button type="submit" className="w-1/3" disabled={loader2}>
                  Save
                </Button>
              </>
            )}
          </form>
        </Form>

        <div className="w-full pl-4 flex flex-col gap-2">
          <Dialog  open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
              <p className="text-blue-600 text-left cursor-pointer" onClick={()=>setIsOpen(true)}>change password</p>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  <Form {...form2}>
                    <form
                      onSubmit={form2.handleSubmit(onForm2Submit)}
                      className="  p-5 space-y-3 text-black"
                    >
                      <FormField
                        control={form2.control}
                        name="oldPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Old password</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your old password"
                                {...field}
                                className="bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none ring-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form2.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your new password"
                                {...field}
                                className="bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none ring-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form2.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your confirm password"
                                {...field}
                                className="bg-transparent border-none focus:ring-0 focus:outline-none focus:border-none ring-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-1/3"
                        disabled={loader2}
                      >
                        Change
                      </Button>
                    </form>
                  </Form>

                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {!edit ? (
            <Button className="w-1/3" disabled={loader2} onClick={handleEdit}>
              Edit
            </Button>
          ) : (
            <Button className="w-1/3" onClick={handleEdit}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
