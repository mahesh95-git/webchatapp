import dbConnect from "@/lib/dbConnection";
import Chat from "@/models/chat.model";
export async function newChat({ message, sender, receiver, type, group }) {
  try {
    await dbConnect();

    let newChat;
    if (type === "group") {
      newChat = {
        group,
        sender,
        message,
        isGroup: true,
      };
    } else {
      newChat = {
        sender,
        receiver,
        message,
        isGroup: false,
      };
    }
    const chat = await Chat.create(newChat);
  } catch (error) {
    return error;
  }
}
