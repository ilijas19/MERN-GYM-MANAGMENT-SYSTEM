import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { useGetAllClientsQuery } from "../../redux/api/trainerApiSlice";
import ClientMenu from "../../components/Chat/ClientMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useSocket from "../../hooks/useSocket";
import MessagesMenu from "../../components/Chat/MessagesMenu";
import {
  useGetAllChatsQuery,
  useGetChatMessagesQuery,
} from "../../redux/api/chatApiSlice";
import { Chat, PopulatedMessage } from "../../types/types";
import Loader from "../../components/Loader";
import { FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal";
import DeleteChatForm from "../../components/forms/Chat/DeleteChatForm";

const TrainerChat = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMessageMenuOpen, setMessageMenuOpen] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");

  const { data: clients, isLoading: clientsLoading } = useGetAllClientsQuery();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { socket, connected } = useSocket();

  // Chat
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [openedChat, setOpenedChat] = useState<Chat | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const {
    data: dbMessages,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery(openedChat?._id ?? "", { skip: !openedChat });

  const {
    data: chats,
    isLoading: chatsLoading,
    refetch: refetchChats,
  } = useGetAllChatsQuery();

  const [messages, setMessages] = useState<PopulatedMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!inputValue.trim() || !openedChat || !socket) return;

    const message = {
      _id: Math.random(),
      sender: currentUser,
      senderId: currentUser?._id,
      chat: openedChat._id,
      text: inputValue,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", { roomName, message });
    setInputValue("");
  };

  const handleMessage = (message: any) => {
    const formattedMessage = {
      _id: message._id,
      senderId: {
        _id: message.sender._id,
        fullName: message.sender.fullName,
        email: message.sender.email,
        userId: message.sender.userId,
      },
      chatId: message.chat,
      text: message.text,
      status: "sent",
      createdAt: message.createdAt,
    };
    setMessages((prev) => [...prev, formattedMessage]);
  };

  useEffect(() => {
    if (socket && connected) {
      socket.emit("joined", { currentUser, socketId: socket.id });
    }
    if (openedChat && socket && connected) {
      const room = `${openedChat.trainerId.userId}&${openedChat.memberId.userId}`;
      socket.emit("join-room", room);
      setRoomName(room);

      socket.on("receive-message", handleMessage);

      return () => {
        socket.off("receive-message", handleMessage);
      };
    }
  }, [openedChat, socket, connected]);

  useEffect(() => {
    if (dbMessages) {
      setMessages(dbMessages.messages);
    }
  }, [dbMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (openedChat) {
      setOpenedChat(openedChat);
      //  set last message to seen
    }
  }, [openedChat]);

  return (
    <section className="sm:-mx-6 -mx-3 -my-4 flex grow ">
      {/* Sidebar */}
      <aside
        className={`bg-[var(--grayDark)] border-r border-r-gray-600 flex flex-col z-49 transition-transform duration-500 md:translate-x-0 md:relative md:w-[20rem] sm:w-[20rem] fixed top-0 left-0 w-full not-md:h-full ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 pb-0 md:static">
          <div className="flex gap-2">
            {isMessageMenuOpen ? (
              <button
                onClick={() => setMessageMenuOpen(false)}
                className="bg-cyan-700 text-white font-semibold px-2 py-1 rounded cursor-pointer shadow"
              >
                Clients
              </button>
            ) : (
              <button
                onClick={() => setMessageMenuOpen(true)}
                className="bg-cyan-700 text-white font-semibold px-2 py-1 rounded cursor-pointer shadow"
              >
                Chats
              </button>
            )}
          </div>

          <IoMdClose
            size={24}
            className="text-red-700 cursor-pointer md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        <div className="mt-2 px-3">
          <h2 className="font-semibold text-xl text-center">
            {isMessageMenuOpen ? "Chats" : "Clients"}
          </h2>
          {/* MESSAGES MENU */}
          <MessagesMenu
            isMessageMenuOpen={isMessageMenuOpen}
            setOpenedChat={setOpenedChat}
            openedChat={openedChat}
            chats={chats?.chats}
            chatsLoading={chatsLoading}
            refetchMessages={refetchMessages}
            messages={messages}
            socket={socket}
            connected={connected}
          />
          {/* CLIENTS MENU */}
          <ClientMenu
            clients={clients?.clients}
            isMessageMenuOpen={isMessageMenuOpen}
            setMessageMenuOpen={setMessageMenuOpen}
            clientsLoading={clientsLoading}
            setOpenedChat={setOpenedChat}
            refetch={refetchChats}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 bg-[var(--gray)] flex flex-col gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-white text-black font-semibold px-3 py-0.5 rounded cursor-pointer md:hidden absolute"
        >
          Chats
        </button>

        <h2 className="text-center text-xl relative">
          {openedChat ? openedChat.memberId.fullName : "Start A Chat"}
          {openedChat && (
            <FaTrash
              className="absolute -top-1 right-0 text-red-600 cursor-pointer"
              onClick={() => setDeleteModalOpen(true)}
            />
          )}
        </h2>

        {/* Chat container */}
        {openedChat && (
          <>
            <ul className="rounded-lg flex-1 mt-3 overflow-y-auto flex flex-col gap-4 max-h-[calc(100vh-200px)] sidebar-content ">
              {/* Messages */}
              {messagesLoading && <Loader />}
              {messages &&
                messages.map((message) => (
                  <li
                    key={message._id}
                    className={`${
                      message.senderId.userId === currentUser?.userId
                        ? "self-end  bg-cyan-700"
                        : "self-start bg-gray-800"
                    } max-w-[70%]  text-white p-3 rounded-lg shadow-md`}
                  >
                    {message.text}
                    <span className="block text-xs text-gray-400 mt-2">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              <div ref={messagesEndRef} />
            </ul>
            <div className="flex gap-1 mt-auto">
              <input
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter Message . . ."
                type="text"
                className="border border-gray-500 rounded-lg grow px-2"
              />
              <button
                onClick={sendMessage}
                className="bg-cyan-600 px-5 py-2 rounded-lg"
              >
                <IoSendSharp size={18} />
              </button>
            </div>
          </>
        )}
      </div>
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DeleteChatForm
          openedChat={openedChat}
          onClose={() => setDeleteModalOpen(false)}
          setOpenedChat={setOpenedChat}
          refetch={refetchChats}
        />
      </Modal>
    </section>
  );
};

export default TrainerChat;
