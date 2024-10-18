"use client";
import { Badge } from "@/components/dashboard/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/dashboard/Table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ComprehensiveUser, User } from "@/lib/types";
import { Confirmation } from "@/components/cofirmation";

export function UserTable({ data }: { data: ComprehensiveUser[] }) {
  const resetPassword = async (id: string) => {
    const response = await fetch(`/api/admin/users?id=${id}`, {
      method: "PUT",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        toast.success("密码重置成功");
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const getRole = (role: string) => {
    switch (role) {
      case "admin":
        return "管理员";
      case "super_admin":
        return "超级管理员";
      case "user":
        return "用户";
      default:
        return "未知";
    }
  };

  return (
    <>
      <div className="mx-4 flex justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            用户详情
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            查看、管理用户
          </p>
        </div>
      </div>
      <TableRoot className="mt-8">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>创建于</TableHeaderCell>
              <TableHeaderCell>权限</TableHeaderCell>
              <TableHeaderCell>操作</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item: ComprehensiveUser) => (
              <TableRow key={item.id}>
                <TableCell className="">{item.email}</TableCell>
                <TableCell className="">
                  {item.created_at.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.role.includes("admin") ? "warning" : "default"
                    }
                  >
                    {getRole(item.role)}
                  </Badge>
                </TableCell>
                <TableCell className="flex flex-row gap-1 items-center">
                  <Confirmation
                    trigger={
                      <Button variant="outline" className="text-xs">
                        重置密码
                      </Button>
                    }
                    title={`将为 ${item.email} 重置密码`}
                    description={"重置后密码为 123456"}
                    onClick={() => resetPassword(item.id)}
                  />
                  <Confirmation
                    trigger={
                      <Button variant="destructive" className="text-xs">
                        删除用户
                      </Button>
                    }
                    title={`确定要删除 ${item.email} 吗？`}
                    description={"此操作为永久性且不可逆"}
                    onClick={() => resetPassword(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </>
  );
}
