"use client";

import { rootStoreContext } from "@/app/layout";
import { NavigatorViews } from "@/constants/NavigatorViews";
import {
  IconChartBar,
  IconChartBarPopular,
  IconLayoutDashboard,
  IconMap,
} from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Tooltip } from "primereact/tooltip";
import { useCallback, useContext } from "react";

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
  const { activeTab } = rootStore;
  const router = useRouter();

  const onMenuItemClick = useCallback((e: any) => {
    router.push(`/${e.item.id}`);
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
        className="h-full flex justify-center items-center p-4 w-max gap-4"
        model={sidebarItems}
      />
      <Tooltip target=".p-menuitem-link" />
    </>
  );
});

export default Sidebar;
