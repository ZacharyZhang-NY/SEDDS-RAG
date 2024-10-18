import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/app/admin/sidebar-nav";
import {auth} from "@/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}
const sidebarNavItems = [
  {
    title: "控制面板",
    href: "/admin/center",
  },
  {
    title: "知识库",
    href: "/admin/datasource",
  },
  {
    title: "设置",
    href: "/admin/settings",
  },
];

export default async function Layout({ children }: AdminLayoutProps) {
  const session = await auth()
  return (
    <div className="p-6 space-y-6 md:p-10 pb-16 md:block md:mx-20 dark:text-neutral-200">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-medium tracking-tight dark:text-neutral-100">
          管理面板
        </h2>
        {/*TODO: user*/}
        <div className="text-muted-foreground dark:text-neutral-400">
          {session?.user?.email}，您好！
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5 dark:text-neutral-200">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
