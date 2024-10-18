"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { getStringFromBuffer, ResultCode } from "@/lib/utils";
import { updatePassword } from "@/app/signup/actions";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";

const PasswordResetForm = () => {
  const [password, setPassword] = React.useState("");
  const user = useUserStore();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("密码长度至少为6位");
      return;
    }

    const parsed = z.string().min(6).safeParse(password);
    if (parsed.success) {
      const salt = crypto.randomUUID();

      const encoder = new TextEncoder();
      const saltedPassword = encoder.encode(password + salt);
      const hashedPasswordBuffer = await crypto.subtle.digest(
        "SHA-256",
        saltedPassword,
      );
      const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);
      const email = user.user?.email;
      if (!email) {
        toast.error("An error occurred, please try again");
        return;
      }

      try {
        const res = await updatePassword(email, hashedPassword, salt);
        if (res.resultCode === ResultCode.UserUpdated) {
          toast.success("密码修改成功");
          router.refresh();
        }
      } catch (e) {
        console.log(e);
        toast.error("密码修改失败");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm items-center gap-1.5"
    >
      <Label htmlFor="password">修改密码</Label>
      <Input
        type="password"
        id="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="输入修改的密码"
      />
      <Button type="submit">提交</Button>
    </form>
  );
};

export default PasswordResetForm;
