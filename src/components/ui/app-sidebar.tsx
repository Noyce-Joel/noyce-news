"use client";

import {
  SiSky,
  SiTechcrunch,
  SiTheguardian,
  SiWireguard,
  SiArstechnica,
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
  useSidebar,
} from "@/components/ui/sidebar";
import Headlines from "../the-headlines/headlines";
import Image from "next/image";
import { DotSquareIcon } from "lucide-react";
import Link from "next/link";
import WeatherButton from "../weather/weather-button";

const items = [
  {
    title: "Guardian",
    url: "/guardian",
    icon: <TbBrandGuardian className=" text-xl text-gray-400 w-8 h-8" />,
  },
  {
    title: "TechCrunch",
    url: "/tech-crunch",
    icon: <SiTechcrunch className="text-xl text-gray-400 w-8 h-8" />,
  },
  {
    title: "BBC",
    url: "/bbc",
    icon: <FcBbc className="text-xl text-gray-400 w-8 h-8" />,
  },
  {
    title: "Ars Technica",
    url: "/ars-technica",
    icon: <SiArstechnica className="text-xl text-gray-400 w-8 h-8" />,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar className="border-r border-gray-400">
      <Link
        href="/"
        className=" bold flex font-bold flex-row items-center gap-2 absolute z-50 top-5 left-5 text-sm border justify-center border-gray-400 rounded-md h-6 w-6"
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
                  className=" transition-all duration-200"
                  
                >
                  <SidebarMenuButton className="flex items-center justify-start gap-2 h-12">
                    <a
                      href={item.url}
                      className="flex gap-4 justify-center items-center"
                    >
                      {item.icon}
                      <span className="text-xl font-bold whitespace-nowrap">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarGroupContent className="w-full mx-auto absolute bottom-4 left-10 z-50">
        {/* <WeatherButton /> */}
      </SidebarGroupContent>
    </Sidebar>
  );
}
