import React from "react";
import { Link } from "react-router-dom";

type NavBoxProps = {
  title: string;
  icon: React.ReactElement<{ size?: number; className?: string }>;
  to: string;
  userRole: string;
  roleAvailable: string[];
  onClick: () => void;
};

const NavBox = ({
  title,
  icon,
  to,
  userRole,
  roleAvailable,
  onClick,
}: NavBoxProps) => {
  if (!roleAvailable.includes(userRole)) {
    return null;
  }

  return (
    <Link
      onClick={onClick}
      to={to}
      className="flex items-center justify-between bg-[var(--grayLight)] p-2 rounded cursor-pointer hover:border-white border border-[var(--grayLight)]"
    >
      <p className="font-semibold ">{title}</p>
      {React.cloneElement(icon, { size: 20, className: "text-cyan-600" })}
    </Link>
  );
};

export default NavBox;
