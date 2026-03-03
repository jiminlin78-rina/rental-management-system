import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary-bg">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-none border border-border-subtle rounded-2xl p-8",
            headerTitle: "font-heading text-2xl font-semibold text-primary-text",
            headerSubtitle: "text-text-muted text-sm",
            socialButtonsBlockButton: "bg-primary-bg border border-border-subtle text-primary-text hover:bg-border-subtle",
            formButtonPrimary: "bg-gradient-to-r from-gold-primary to-gold-light text-white font-medium",
            formFieldLabel: "text-text-secondary text-sm mb-1",
            formFieldInput: "input",
            footerActionLink: "text-gold-primary hover:text-gold-dark font-medium",
          },
        }}
      />
    </div>
  )
}
