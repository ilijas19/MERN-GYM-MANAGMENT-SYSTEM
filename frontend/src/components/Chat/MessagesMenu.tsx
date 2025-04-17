import { BsChatLeftDots } from "react-icons/bs";
import { Chat, PopulatedMessage } from "../../types/types";
import Loader from "../Loader";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

type FormProps = {
  isMessageMenuOpen: boolean;
  setOpenedChat: (chat: Chat) => void;
  openedChat: Chat | null;
  chats: Chat[] | undefined;
  chatsLoading: boolean;
  refetchMessages: () => void;
  messages: PopulatedMessage[];
  socket: Socket;
  connected: boolean;
};

const MessagesMenu = ({
  isMessageMenuOpen,
  setOpenedChat,
  openedChat,
  chats,
  chatsLoading,
  refetchMessages,
  messages,
  socket,
  connected,
}: FormProps) => {
  const [unreadChats, setUnreadChats] = useState<Set<string>>(new Set());

  const handleChatEnter = (chat: Chat) => {
    // Remove from unread when chat is opened
    setUnreadChats((prev) => {
      const newSet = new Set(prev);
      newSet.delete(chat._id);
      return newSet;
    });
    setOpenedChat(chat);
    if (messages.length > 0) {
      refetchMessages();
    }
  };

  useEffect(() => {
    if (!isMessageMenuOpen || !socket || !connected) return;

    const handleNotification = (chatId: string) => {
      if (openedChat?._id === chatId) {
        // console.log("Chat is opened no notification");
      } else {
        // console.log("notification from chat _id", chatId);
        setUnreadChats((prev) => new Set(prev).add(chatId));
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, connected, openedChat, isMessageMenuOpen]);

  return (
    <>
      {chatsLoading && <Loader />}
      {isMessageMenuOpen && (
        <ul className="mt-4 max-w-[450px] mx-auto">
          {chats &&
            chats.map((chat) => (
              <li
                onClick={() => handleChatEnter(chat)}
                className="hover:bg-[var(--grayLight)] cursor-pointer rounded p-2 flex gap-2 items-center shadow"
                key={chat._id}
              >
                <img
                  src={
                    chat.memberId.profilePicture === ""
                      ? "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg"
                      : chat.memberId.profilePicture
                  }
                  alt=""
                  className="border rounded-full size-13 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {chat.memberId.fullName}
                  </p>
                  <p
                    className={`text-sm truncate ${
                      unreadChats.has(chat._id)
                        ? "text-red-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {unreadChats.has(chat._id)
                      ? "New Message"
                      : // : chat.lastMessage
                        // ? chat.lastMessage.text
                        "No New Messages"}
                  </p>
                </div>
                <BsChatLeftDots className="ml-2" />
                {unreadChats.has(chat._id) && (
                  <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </li>
            ))}
        </ul>
      )}
    </>
  );
};

export default MessagesMenu;
