import {
  SiSky,
  SiTechcrunch,
  SiTheguardian,
  SiWireguard,
} from "react-icons/si";
import { TbBrandGuardian, TbSphere } from "react-icons/tb";
import { FcBbc } from "react-icons/fc";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Headlines from "../the-headlines/headlines";
import Image from "next/image";
import { DotSquareIcon } from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Guardian",
    url: "/guardian",
    icon: TbBrandGuardian,
  },
  {
    title: "TechCrunch",
    url: "/tech-crunch",
    icon: SiTechcrunch,
  },
  {
    title: "BBC",
    url: "/bbc",
    icon: FcBbc,
  },
  {
    title: "Sky",
    url: "/sky",
    icon: SiSky,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-400">
     
        <Link
          href="/"
          className=" bold flex font-bold flex-row items-center gap-2 absolute z-50 top-4 left-4 text-sm border justify-center border-gray-400 rounded-md h-6 w-6"
        >
          <div className="text-sm font-bold border flex items-center justify-center border-gray-400 rounded-md h-6 w-6">
            N
          </div>
        </Link>
      
      <SidebarContent>  
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col justify-center items-center p-6 mb-8">
            <Headlines />
          </SidebarGroupContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="text-xl text-gray-400" />
                      <span className="text-xl font-bold">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
