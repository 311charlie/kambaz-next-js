"use client";
import { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-account-screen">
      <table>
        <tbody>
          <tr>
            <td valign="top"><AccountNavigation /></td>
            <td valign="top" className="p-3" width="100%">{children}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
