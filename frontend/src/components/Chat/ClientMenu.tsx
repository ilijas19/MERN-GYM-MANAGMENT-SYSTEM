import { BsChatLeftDots } from "react-icons/bs";
import { Chat, User } from "../../types/types";
import Loader from "../Loader";
import { useCreateChatMutation } from "../../redux/api/chatApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";

type FormProps = {
  clients: User[] | undefined;
  isMessageMenuOpen: boolean;
  setMessageMenuOpen: (bool: boolean) => void;
  clientsLoading: boolean;
  setOpenedChat: (chat: Chat) => void;
  refetch: () => void;
};

const ClientMenu = ({
  isMessageMenuOpen,
  setMessageMenuOpen,
  clientsLoading,
  clients,
  setOpenedChat,
  refetch,
}: FormProps) => {
  const [createChatApiHandler, { isLoading }] = useCreateChatMutation();

  const handleChatStart = async (id: string) => {
    if (isLoading) return;
    try {
      const res = await createChatApiHandler(id).unwrap();
      toast.success(res.msg);
      setOpenedChat(res.chat);
      refetch();
      setMessageMenuOpen(true);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <>
      {!isMessageMenuOpen && (
        <ul className="mt-4 max-w-[450px] mx-auto">
          {clientsLoading && <Loader />}
          {clients &&
            clients.map((client) => (
              <li
                onClick={() => handleChatStart(client.userId)}
                key={client.userId}
                className="hover:bg-[var(--grayLight)] cursor-pointer rounded p-2 flex gap-2 items-center shadow"
              >
                <img
                  src={
                    client.profilePicture === ""
                      ? "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg"
                      : client.profilePicture
                  }
                  alt=""
                  className="border rounded-full size-13 object-cover"
                />
                <div>
                  <p className="font-semibold">{client.fullName}</p>
                  <p className="text-sm text-gray-400">
                    {isMessageMenuOpen ? "Lorem ipsum dolors!" : "Start Chat!"}
                  </p>
                </div>
                <BsChatLeftDots className="ml-auto" />
              </li>
            ))}
        </ul>
      )}
    </>
  );
};
export default ClientMenu;
