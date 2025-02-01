"use client";

import { TbBuildingCommunity, TbSphere } from "react-icons/tb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import Headlines from "../the-headlines/headlines";
import Link from "next/link";
import GovUkIcon from "../icons/GovUkIcon";

const items = [
  {
    title: "GOV.UK",
    url: "/gov-uk",
    icon: <GovUkIcon />,
    subItems: [
      {
        title: "Environment",
        url: "/gov-uk/environment",
        icon: <TbSphere />,
      },
      {
        title: "Business and Industry",
        url: "/gov-uk/business-and-industry",
        icon: <TbBuildingCommunity />,
      },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar className="border-r border-gray-400">
      <Link
        href="/"
        className="bold flex font-bold flex-row items-center gap-2 absolute z-50 top-5 left-5 text-sm border justify-center border-gray-400 rounded-md h-6 w-6"
      >
        <div className="text-sm font-bold border flex items-center justify-center border-gray-400 rounded-md h-6 w-6">
          N
        </div>
      </Link>

      <SidebarContent>
        <SidebarGroup
          style={{
            transform: open ? "translateY(0)" : "translateY(-100px)",
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          }}
        >
          <SidebarGroupContent className="flex flex-col justify-center items-center p-6 mb-8">
            <div
              style={{
                opacity: open ? 1 : 0,
                transition: "opacity 0.1s ease-in-out",
              }}
            >
              <Headlines />
            </div>
          </SidebarGroupContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="transition-all duration-200"
                >
                  <SidebarMenuButton className="relative flex items-center justify-start gap-2">
                    
                      {item.icon}
                      <span className="text-xl font-bold whitespace-nowrap">
                        {item.title}
                      </span>
                  </SidebarMenuButton>
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a
                              href={subItem.url}
                              className="flex gap-4 items-center"
                            >
                              {subItem.icon}
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
