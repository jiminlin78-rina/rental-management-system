import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware(() => {
  // 不做任何事情，所有路由公開
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
