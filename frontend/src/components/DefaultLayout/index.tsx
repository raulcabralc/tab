import { SidebarRespect } from "@/styles/global";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

export function DefaultLayout() {
  return (
    <>
      <Sidebar />
      <SidebarRespect>
        <Outlet />
      </SidebarRespect>
    </>
  );
}
