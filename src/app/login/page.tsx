import { Metadata } from "next";
import { LoginContent } from "./LoginContent";

export const metadata: Metadata = {
  title: "Log in — TestLink",
  description: "Sign in with Google to create shareable test links with live leaderboards. No passwords, no forms — just your Google account.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <LoginContent />;
}
