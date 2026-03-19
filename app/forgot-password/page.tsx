import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "استعادة كلمة المرور"
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>استعادة كلمة المرور</CardTitle>
          <CardDescription>أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
