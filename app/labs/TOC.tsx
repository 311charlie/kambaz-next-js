"use client";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { usePathname } from "next/navigation";

export default function TOC() {
  const pathname = usePathname();
  return (
    <Nav variant="pills">
      <NavItem>
        <NavLink href="/labs" active={pathname === "/labs"}>Labs</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/labs/lab1" active={pathname === "/labs/lab1"}>Lab 1</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/labs/lab2" active={pathname.includes("/labs/lab2")}>Lab 2</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/labs/lab3" active={pathname === "/labs/lab3"}>Lab 3</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/">Kambaz</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="https://github.com/311charlie/kambaz-next-js" id="wd-github">GitHub</NavLink>
      </NavItem>
    </Nav>
  );
}