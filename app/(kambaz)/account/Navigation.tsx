"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const pathname = usePathname();

  const links = currentUser ? ["profile"] : ["signin", "signup"];

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link key={link} href={`/account/${link}`}
          className={`list-group-item border-0 ${pathname.includes(link) ? "active" : "text-danger"}`}>
          {link.charAt(0).toUpperCase() + link.slice(1)}
        </Link>
      ))}
      {currentUser && currentUser.role === "ADMIN" && (
        <Link href="/account/users"
          className={`list-group-item border-0 ${pathname.includes("users") ? "active" : "text-danger"}`}>
          Users
        </Link>
      )}
    </div>
  );
}
