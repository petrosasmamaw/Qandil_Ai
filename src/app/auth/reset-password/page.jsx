import { Suspense } from "react";
import ResetPasswordForm from "./Form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
