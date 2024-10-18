import React, { useState } from "react";
import { Card } from "@/components/dashboard/card";
import { RiFolder2Line } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { stripHtml } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";

interface FolderProps {
  folder: any;
  folderList: any
}
interface Data {
  id: string;
  name: string;
  content: string;
  type: string;
}

export const FolderComponent: React.FC<FolderProps> = ({ folder, folderList }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)}>
        <Card
          onClick={() => {}}
          className="w-80 flex flex-row gap-2 hover:opacity-80 cursor-pointer bg-neutral-100"
          key={folder.id}
        >
          <RiFolder2Line />
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            {folder.name}
          </h3>
        </Card>
      </div>
      {isOpen && (
        <div className="pt-1">
          {folder.children.map((child: Data) =>
            child.type === "folder" ? (
              <FolderComponent key={child.id} folder={child} folderList={folderList} />
            ) : (
              <FileComponent key={child.id} file={child} folderList={folderList} />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export const FileComponent = ({
  file,
  folderList,
}: {
  file: Data;
  folderList: any;
}) => {
  const router = useRouter();
  const handleMove = async (id: string) => {
    await fetch("/api/embeddings/folder/file", {
      method: "PUT",
      body: JSON.stringify({ folderId: id, fileId: file.id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text())
        }
        toast.success("文件移动成功");
        router.refresh()
      })
      .catch((err) => toast.error(`文件移动失败: ${err.message}`));
  };

  const handleDelete = async () => {
    if (!confirm("确定删除文件吗？")) return;
    await fetch("/api/embeddings", {
      method: "DELETE",
      body: JSON.stringify({ id: file.id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        toast.success("文件删除成功");
        router.refresh()
      })
      .catch((err) => toast.error(`文件删除失败: ${err.message}`));
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          onClick={() => {
            router.push(`/admin/datasource/${file.id}`);
          }}
          className="w-80 min-h-52 hover:opacity-80 cursor-pointer"
          key={file.id}
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            {file.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-900 dark:text-gray-50">
            {file?.content?.length > 100
              ? stripHtml(file.content.slice(0, 100)) + "..."
              : stripHtml(file.content)}
          </p>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>移动至</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {folderList.map((folder: any) => (
              <ContextMenuItem
                onClick={() => {
                  handleMove(folder.id);
                }}
                key={folder.id}
              >
                {folder.name}
              </ContextMenuItem>
            ))}
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => {
                handleMove("root");
              }}
            >
              根目录
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem onClick={handleDelete}>删除</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
