import { redirect } from "next/navigation"

export default function AuthPage() {
  // 重導向到 Clerk 登入頁
  redirect("/sign-in")
}
