"use client";
import React, { useState } from "react";
import Tiptap from "@/components/Editor/Tiptap";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BackButton from "@/components/back-button";

const Page = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/embeddings", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "服务器错误");
        }
        toast.success("文档创建成功");
        router.push("/admin/datasource");
      })
      .catch((e) => toast.error(`${e.message}`));
  };

  return (
    <div className="flex flex-col h-full">
      <BackButton href='/admin/datasource'/>
      <h1 className="mb-4 font-medium text-2xl">创建新文档</h1>
      <Tiptap onValueGet={setContent} />
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-row gap-1 items-center"
      >
        <Input
          className="my-1"
          placeholder="文档标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" variant="outline">
          提交
        </Button>
      </form>
    </div>
  );
};

export default Page;
