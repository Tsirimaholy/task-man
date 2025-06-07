import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { Outlet, useLocation, useRouteLoaderData } from "react-router";
import { Paragraph } from "~/components/typography";
import { Link2Icon, Sparkle } from "lucide-react";
import { type Route } from ".react-router/types/app/routes/+types/tasks";
import { AvatarFallback, AvatarImage, Avatar } from "~/components/ui/avatar";
import { extractInitial } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import prisma from "~/lib/prisma";

export function meta({}) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
function PageHeaderTitle() {
  const location = useLocation();
  const title = location.pathname.split("/").at(-1);
  return (
    <div className="flex items-center">
      {title === "tasks" ? <Sparkle size={17} /> : ""}
      <Paragraph className="capitalize">{title}</Paragraph>
    </div>
  );
}
export const loader = async () => {
  const projects = await prisma.project.findMany();
  return { projects };
};
export default function Home() {
  const data =
    useRouteLoaderData<Route.ComponentProps["loaderData"]>("routes/tasks");

  return (
    <SidebarProvider className="overflow-hidden ">
      <AppSidebar />
      <main className="px-5 pb-10 flex flex-col h-svh w-full overflow-hidden">
        <header className="">
          <nav className="flex items-center justify-between p-2">
            <div className="flex">
              <SidebarTrigger className="cursor-pointer mr-2" />
              <PageHeaderTitle />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Paragraph
                  as={"span"}
                  className="text-xs"
                  textColorClassName="text-muted-foreground"
                >
                  Last updated x days ago
                </Paragraph>
                <div className="flex -space-x-2">
                  {data?.project?.members.map((member) => {
                    const img = ["/avatar.png", "/avatar2.png"];
                    const idx = Math.floor(Math.random() * 2);
                    return (
                      <Avatar key={member.id}>
                        <AvatarImage
                          src={img[idx]}
                          className="border-2 border-white"
                        ></AvatarImage>
                        <AvatarFallback>
                          {member?.user &&
                            extractInitial(
                              member.user.name || member.user.email
                            )}
                        </AvatarFallback>
                      </Avatar>
                    );
                  })}
                </div>
              </div>
              <Button
                variant={"secondary"}
                size={"sm"}
                className="text-sm text-muted-foreground"
              >
                <Link2Icon size={15} className="rotate-[135deg]"></Link2Icon>
                Share
              </Button>
            </div>
          </nav>
        </header>
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
