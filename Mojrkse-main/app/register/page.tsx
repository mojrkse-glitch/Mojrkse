import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "إنشاء حساب"
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>إنشاء حساب</CardTitle>
          <CardDescription>أنشئ حسابك لرفع الطلبات ومتابعة حالتها داخل منصة Mo.jrk.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
