'use client';

import { LoginPage } from "@/components/LoginPage";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleLogin = (role: string) => {
    // Redirect based on role
    if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/agent/dashboard');
    }
  };

  return <LoginPage onLogin={handleLogin} />;
}
