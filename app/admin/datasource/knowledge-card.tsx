"use client";
import { Card } from "@/components/dashboard/card";
import { useRouter } from "next/navigation";
import { stripHtml } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { RiFolder2Line } from "@remixicon/react";
import {FileComponent, FolderComponent} from "@/app/admin/datasource/folders";

interface Data {
  id: string;
  name: string;
  content: string;
  type: string;
}

export const KnowledgeCard = ({ data, unsorted }: { data: Data[], unsorted: Data[] }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    router.push(`/admin/datasource?s=${debouncedSearch}`);
  }, [debouncedSearch]);
  const [, cancel] = useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search],
  );


  console.log(data);
  return (
    <>
      <Input
        className="w-80 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索文档"
      />
      <div className="w-full flex flex-row gap-2 flex-wrap ">
        {data.map(folder => (
          <FolderComponent key={folder.id} folder={folder} folderList={data} />
        ))}
        {unsorted.map(file => (
          <FileComponent file={file} key={file.id} folderList={data} />
        ))}

      </div>
    </>
  );
};
