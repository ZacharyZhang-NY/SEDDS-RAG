"use client";
import React, { useState } from "react";
import Tiptap from "@/components/Editor/Tiptap";
import { Button } from "@/components/ui/button";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

interface ModifyContentProps {
  content: string;
  id: string;
}
const ModifyContent = ({ content: initialContent, id }: ModifyContentProps) => {
  const [content, setContent] = useState<string>(initialContent);
  const router = useRouter()
  const handleClick = async () => {
    await fetch("/api/embeddings", {
      method: "PUT",
      body: JSON.stringify({ id, content }),
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(await res.text())
      }
      toast.success('文档更新成功')
    }).catch((e) => toast.error(e.message))
  };

  const handleDelete = async () => {
    const confirm = window.confirm('确定删除文档吗？')
    if (!confirm) return
    await fetch("/api/embeddings", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(await res.text())
      }
      toast.success('文档删除成功')
      router.push('/admin/datasource')
    }).catch((e) => toast.error(e.message))
  }

  return (
    <div>
      <Tiptap content={initialContent} onValueGet={setContent} />
      <div className='mt-4 w-full flex flex-row justify-between'>
      <Button className="" onClick={handleClick}>
        保存修改
      </Button>
      <Button onClick={handleDelete} variant='destructive'>
        删除文档
      </Button>
      </div>
    </div>
  );
};

export default ModifyContent;
