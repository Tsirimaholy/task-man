import { type Route } from ".react-router/types/app/routes/+types/projects";

import {
  Calendar,
  Settings,
  UserIcon,
  ChevronsUpDown,
  LucideHelpingHand,
  ArrowUpRight,
  Layers,
  FolderKanban,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { href, NavLink, useLoaderData, useLocation } from "react-router";
import { H6 } from "./typography";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import SearchInput from "./ui/SearchInput";

const items = [
  // {
  //   title: "Home",
  //   url: href("/"),
  //   icon: Home,
  // },
  // {
  //   title: "Task",
  //   url: href("/projects/:projectId/tasks", { projectId: "1" }),
  //   icon: LucideListTodo,
  // },
  {
    title: "Projects",
    url: href("/"),
    icon: FolderKanban,
  },
  {
    title: "Schedule",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
const footerItems = [
  {
    title: "Help Center",
    url: "",
    icon: LucideHelpingHand,
    rightIcon: ArrowUpRight,
  },
  {
    title: "Sub Accounts",
    url: "",
    icon: Layers,
    rightIcon: null,
  },
] as const;
export function AppSidebar() {
  const location = useLocation();
  const { projects } = useLoaderData<Route.ComponentProps["loaderData"]>();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="border-0 size-6 bg-gradient-to-br from-blue-900 via-pink-500 to-yellow-300 rounded-sm shadow-sm" />
              <H6 className="text-muted-foreground">Acme Inc</H6>
              <ChevronsUpDown size={15} className="text-muted-foreground" />
            </div>
            <Avatar className="">
              <AvatarImage src="/avatar.png" sizes="25px"></AvatarImage>
              <AvatarFallback className="bg-gray-200">
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </div>
          <SearchInput
            shortCutKey="/"
            placeholder="Search anything"
            className="bg-white"
            containerClassName="mt-2"
          />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location?.pathname === item.url}
                  >
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {/*
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <SidebarMenuItem>
                    <CollapsibleTrigger className="w-full">
                      <SidebarMenuButton>
                        <FolderKanban />
                        <span>Projects</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                   <CollapsibleContent>
                    <SidebarMenuSub>
                      {projects?.map((project) => {
                        return (
                          <SidebarMenuSubItem key={project.id}>
                            <SidebarMenuButton
                              asChild
                              isActive={
                                href("/projects/:projectId/tasks", {
                                  projectId: project.id.toString(),
                                }) === location.pathname
                              }
                            >
                              <NavLink
                                to={href("/projects/:projectId/tasks", {
                                  projectId: project.id.toString(),
                                })}
                              >
                                <span>{project.name}</span>{" "}
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
            */}
          </SidebarGroupContent>
          <SidebarGroup>
            <SidebarGroupContent></SidebarGroupContent>
          </SidebarGroup>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu className="pb-3">
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className={"flex justify-between"}>
                    <div>
                      <item.icon className="inline mr-2" size={17} />
                      <span className="align-middle">{item.title}</span>
                    </div>
                    {item.rightIcon && <item.rightIcon size={17} />}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
