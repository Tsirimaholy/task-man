import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import {
  Outlet,
  useLocation,
  useRouteLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { Paragraph } from "~/components/typography";
import {
  ChevronRight,
  ClipboardCheck,
  ClipboardIcon,
  Link2Icon,
  Sparkle,
} from "lucide-react";
import { type Route } from ".react-router/types/app/routes/+types/tasks";
import { AvatarFallback, AvatarImage, Avatar } from "~/components/ui/avatar";
import { extractInitial } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { getMyProjects } from "~/queries/projects";
import { requireIsAuthenticated } from "~/lib/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { useState } from "react";

export function meta({}) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
function PageHeaderTitle() {
  const location = useLocation();
  const title = location.pathname.split("/").at(-1) || "Projects";
  return (
    <div className="flex items-center">
      {title === "tasks" ? <Sparkle size={17} /> : ""}
      <Paragraph className="capitalize">{title}</Paragraph>
    </div>
  );
}
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireIsAuthenticated(request);
  const projects = getMyProjects(user?.id!);
  return { projects };
};

export default function Home() {
  // Fetch data for active project
  const activeProjectData =
    useRouteLoaderData<Route.ComponentProps["loaderData"]>("routes/tasks");
  const [copiedSuccessFully, setCopiedSuccessFully] = useState(false);
  return (
    <SidebarProvider className="overflow-hidden ">
      <AppSidebar />
      <main className="px-5 pb-10 flex flex-col h-svh w-full overflow-hidden">
        <header className="border-b">
          <nav className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <SidebarTrigger className="cursor-pointer mr-2" />
              <PageHeaderTitle />{" "}
              <ChevronRight className="text-muted-foreground" size={20} />
              <Paragraph>{activeProjectData?.project?.name}</Paragraph>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {activeProjectData?.project ? (
                  <>
                    <Paragraph
                      as={"span"}
                      className="text-xs"
                      textColorClassName="text-muted-foreground"
                    >
                      Last updated x days ago
                    </Paragraph>
                    <div className="flex -space-x-2">
                      {activeProjectData.project?.members.map((member) => {
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
                  </>
                ) : null}
              </div>
              {activeProjectData &&
              <Popover
                onOpenChange={(open) => !open && setCopiedSuccessFully(false)}
              >
                <PopoverContent className="flex items-center gap-2">
                  <Input
                    id="sharable-link"
                    defaultValue={
                      typeof window != "undefined"
                        ? window.location.toString()
                        : ""
                    }
                    readOnly
                  />
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={async () => {
                      const input = document.getElementById(
                        "sharable-link"
                      ) as HTMLInputElement;
                      input.select();
                      await navigator.clipboard.writeText(input.value);
                      setCopiedSuccessFully(true);
                    }}
                  >
                    {!copiedSuccessFully ? (
                      <ClipboardIcon />
                    ) : (
                      <ClipboardCheck />
                    )}
                  </Button>
                </PopoverContent>
                <PopoverTrigger asChild>
                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    className="text-sm text-muted-foreground"
                  >
                    <Link2Icon
                      size={15}
                      className="rotate-[135deg]"
                    ></Link2Icon>
                    Share
                  </Button>
                </PopoverTrigger>
              </Popover>}
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
