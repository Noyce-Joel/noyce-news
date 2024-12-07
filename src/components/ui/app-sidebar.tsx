import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { SiTheguardian } from "react-icons/si";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs";

// Menu items.
const items = [
  {
    title: "Guardian",
    url: "/guardian",
    icon: SiTheguardian,
    

  },
  
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="absolute left-4 bottom-4">
          {/* <UserButton appearance={{
            elements: {
              avatarBox: "w-9 h-9"
            }
          }} /> */}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold">News Freed</SidebarGroupLabel>
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
  )
}
