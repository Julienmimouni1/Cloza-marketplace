import { LoginForm } from "@/features/identity/components/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Suspense fallback={<div>Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
