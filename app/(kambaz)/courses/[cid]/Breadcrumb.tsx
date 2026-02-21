"use client";
import { usePathname } from "next/navigation";

export default function Breadcrumb({ course }: { course: { name: string } | undefined }) {
  const pathname = usePathname();
  const parts = pathname.split("/");
  let section = parts.pop() || "";
  if (section === "table") section = "people";
  return (
    <span>
      Course {course?.name} &gt; {section}
    </span>
  );
}
