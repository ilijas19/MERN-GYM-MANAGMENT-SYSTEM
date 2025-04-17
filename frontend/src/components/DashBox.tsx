import React from "react";
import { Link } from "react-router-dom";

type DashBoxProps = {
  title: string;
  icon: React.ReactElement<{ size?: number; className?: string }>;
  to: string;
  userRole: string;
  roleAvailable: string[];
};

const DashBox = ({
  title,
  icon,
  to,
  userRole,
  roleAvailable,
}: DashBoxProps) => {
  if (!roleAvailable.includes(userRole)) {
    return null;
  }

  return (
    <Link
      to={to}
      className="h-[15rem] w-[15rem] bg-[var(--grayLight)] rounded flex items-center justify-center flex-col gap-2 border border-cyan-900 cursor-pointer"
    >
      {React.cloneElement(icon, { size: 48, className: "text-cyan-600" })}
      <p className="font-semibold text-lg">{title}</p>
    </Link>
  );
};

export default DashBox;
