import { useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useGetTrainerChatQuery } from "../../redux/api/trainerApiSlice";
import { isApiError } from "../../utils/isApiError";
import { Link } from "react-router";
import Loader from "../../components/Loader";
import useSocket from "../../hooks/useSocket";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useGetChatMessagesQuery } from "../../redux/api/chatApiSlice";
import { PopulatedMessage } from "../../types/types";

const TrainerMessages = () => {
  const { socket, connected } = useSocket();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [inputValue, setInputValue] = useState<string>("");
  const [roomName, setRoomName] = useState<string | null>(null);

  const { data: chat, isLoading, isError, error } = useGetTrainerChatQuery();

  const { data: dbMessages, isLoading: messagesLoading } =
    useGetChatMessagesQuery(chat?.chat._id ?? "", { skip: !chat });

  const [messages, setMessages] = useState<PopulatedMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!inputValue.trim() || !chat || !socket) return;

    const message = {
      _id: Math.random(),
      sender: currentUser,
      senderId: currentUser?._id,
      chat: chat.chat._id,
      text: inputValue,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", { roomName, message });
    setInputValue("");
  };

  useEffect(() => {
    if (chat && socket && connected) {
      socket.emit("joined", { socketId: socket.id, currentUser });

      const roomName = `${chat.chat.trainerId.userId}&${chat.chat.memberId.userId}`;
      socket.emit("join-room", roomName);
      setRoomName(`${chat.chat.trainerId.userId}&${chat.chat.memberId.userId}`);

      socket.on("receive-message", (message) => {
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
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      });
    }
  }, [chat, socket, connected]);

  useEffect(() => {
    if (dbMessages) {
      setMessages(dbMessages.messages);
    }
  }, [dbMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    if (isApiError(error)) {
      return (
        <div>
          <Link className="underline" to={"/"}>
            Go Back
          </Link>
          <h2 className="text-red-600 text-xl">{error.data.msg}</h2>
        </div>
      );
    } else {
      return (
        <div>
          <Link className="underline" to={"/"}>
            Go Back
          </Link>
          <h2 className="text-red-600 text-xl">Something Went Wrong</h2>
        </div>
      );
    }
  }

  return (
    <section className="sm:-mx-6 -mx-3 -my-4 flex grow p-4 bg-[var(--gray)] ">
      {/* Main content */}
      <div className="flex-1 p-4 py-0  rounded-lg bg-[var(--gray)] flex flex-col gap-3 max-w-[1000px] mx-auto ">
        <h2 className="text-center text-xl">
          {/* {openedChat ? openedChat.memberId.fullName : "Start A Chat"} */}
          Trainer Messages
        </h2>

        {/* Chat container */}

        <ul className="rounded-lg flex-1 mt-3 overflow-y-auto flex flex-col gap-4 max-h-[calc(100vh-200px)] sidebar-content">
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
          {/* =========== */}
        </ul>
        <div className="flex gap-1 mt-auto">
          <input
            value={inputValue}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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

        {/*------------*/}
      </div>
    </section>
  );
};
export default TrainerMessages;
