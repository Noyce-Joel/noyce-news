import { SiTechcrunch, SiTheguardian, SiWireguard } from "react-icons/si";
import { TbBrandGuardian } from "react-icons/tb";
import { FcBbc } from "react-icons/fc";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Headlines from "../the-headlines/headlines";

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
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col justify-center items-center p-6 mb-2">
            <Headlines />
          </SidebarGroupContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
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
