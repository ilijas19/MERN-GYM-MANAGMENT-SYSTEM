import React from "react";
import { IoMdClose } from "react-icons/io";

type ModalProps = {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isModalOpen, onClose, children }: ModalProps) => {
  return (
    isModalOpen && (
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
        className="fixed inset-0  flex justify-center z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[var(--grayDark)] relative sm:w-[60%] w-[90%] h-fit rounded-lg p-3 mt-32 mb-10 max-w-[600px]"
        >
          <IoMdClose
            className="absolute top-2 right-2 text-red-700 cursor-pointer"
            size={24}
            onClick={() => onClose()}
          />
          {children}
        </div>
      </div>
    )
  );
};
export default Modal;
