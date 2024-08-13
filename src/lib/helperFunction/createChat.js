import dbConnect from "@/lib/dbConnection";
import Chat from "@/models/chat.model";
export async function NewChat(req) {
  try {
    await dbConnect();
    const { sender, receiver, message } = await req.json();
    const chat= await Chat.create({ sender, receiver, message });
    return chat;
  } catch (error) {
    console.log(error);
    return error;
  }
}
