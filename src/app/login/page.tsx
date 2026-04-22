'use client';

import { LoginPage } from "@/components/LoginPage";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleLogin = () => {
    // In a real app, this would be handled by a session cookie or JWT
    router.push('/dashboard');
  };

  return <LoginPage onLogin={handleLogin} />;
}
