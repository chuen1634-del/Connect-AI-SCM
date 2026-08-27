import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCM 발주·입고관리",
  description: "수요부터 입고·PO Match까지 단계형 SCM 업무 프로토타입",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
