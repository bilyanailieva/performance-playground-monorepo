"use client";

import { NavigatorViews } from "@/constants/NavigatorViews";
import {
  IconChartBar,
  IconChartBarPopular,
  IconLayoutDashboard,
  IconMap,
} from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Tooltip } from "primereact/tooltip";
import { useCallback, useContext, useEffect } from "react";
import { rootStoreContext } from "./RootStoreProvider";

const itemRenderer = (item: MenuItem, options: any, activeTab: string) => {
  return (
    <div
      className={`p-menuitem-content rounded-md p-1 my-3 ${
        item.id === activeTab ? "bg-blue-500 hover:bg-blue-700 text-white" : "hover:bg-blue-100"
      }` }
    >
      <button
        className="flex align-items-center p-menuitem-link"
        data-pr-tooltip={item.label}
        data-pr-position="right"
        onClick={(e) => options.onClick(e)}
      >
        <span>{item.icon}</span>
      </button>
    </div>
  );
};

export const Sidebar = observer(() => {
  const rootStore = useContext(rootStoreContext);
  if (!rootStore) {
    console.error("RootStore is not available.");
    return <div>Unable to load data. Please try again later.</div>;
  }
  const { activeTab } = rootStore;
  const router = useRouter();
  const pathname = usePathname()

  

  useEffect(() => {
    rootStore.setActiveTab(pathname as any);
  }, []);

  const onMenuItemClick = useCallback((e: any) => {
    router.push(`${e.item.id}`);
    rootStore.setActiveTab(e.item.id);
  }, []);

  const sidebarItems: MenuItem[] = [
    {
      id: NavigatorViews.dashboard,
      icon: <IconLayoutDashboard className="w-6" stroke={2} />,
      label: "My Forecast",
      command: (e) => onMenuItemClick(e),
      template: (item, options) => itemRenderer(item, options, activeTab),
    },
    {
      separator: true,
    },
    {
      id: NavigatorViews.map,
      icon: <IconMap stroke={2} />,
      label: "Map overview CSR",
      command: (e) => onMenuItemClick(e),
      template: (item, options) => itemRenderer(item, options, activeTab),
    },
    {
      separator: true,
    },
    {
      id: NavigatorViews.comboChart,
      icon: <IconChartBar stroke={2} />,
      label: "Combo Chart CSR",
      command: onMenuItemClick,
      template: (item, options) => itemRenderer(item, options, activeTab),
    },
    {
      separator: true,
    },
  ];

  return (
    <>
      <Menu
        className="flex-shrink-0 min-w-[25px] h-full flex justify-center items-center p-4 w-max gap-4"
        model={sidebarItems}
      />
      <Tooltip target=".p-menuitem-link" />
    </>
  );
});

export default Sidebar;
