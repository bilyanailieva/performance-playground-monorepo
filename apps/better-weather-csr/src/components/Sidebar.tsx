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
import Link from "next/link";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Tooltip } from "primereact/tooltip";
import { useCallback, useContext } from "react";

const itemRenderer = (
  item: MenuItem,
  activeTab: keyof typeof NavigatorViews,
  itemPath: string,
  updateActiveTab?: (activeTab: keyof typeof NavigatorViews) => void
) => (
  <div
    className={`p-menuitem-content rounded-md ${
      item.id === activeTab ? "bg-blue-400" : ""
    }`}
  >
    <Link
      className="flex align-items-center p-menuitem-link"
      data-pr-tooltip={item.label}
      data-pr-position="right"
      href={`/${itemPath}`}
      onClick={() => updateActiveTab?.(activeTab)}
    >
      <span>{item.icon}</span>
    </Link>
  </div>
);

export const Sidebar = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const { activeTab } = rootStore;

  const onMenuItemClick = useCallback((e: any) => {
    rootStore.setActiveTab(e);
  }, []);

  const sidebarItems: MenuItem[] = [
    {
      id: NavigatorViews.dashboard,
      icon: <IconLayoutDashboard className="w-6" stroke={2} />,
      label: "My Forecast",
      command: (e) => onMenuItemClick(e),
      template: (item) =>
        itemRenderer(item, activeTab, "", () =>
          rootStore.setActiveTab(NavigatorViews.dashboard)
        ),
    },
    {
      id: NavigatorViews.map,
      icon: <IconMap stroke={2} />,
      label: "Map overview CSR",
      disabled: true,
      command: (e) => onMenuItemClick(e),
      template: (item) =>
        itemRenderer(item, activeTab, NavigatorViews.map, () =>
          rootStore.setActiveTab(NavigatorViews.map)
        ),
    },
    {
      separator: true,
    },
    {
      id: NavigatorViews.comboChart,
      icon: <IconChartBar stroke={2} />,
      label: "Combo Chart CSR",
      command: onMenuItemClick,
      template: (item) =>
        itemRenderer(item, activeTab, NavigatorViews.comboChart, () =>
          rootStore.setActiveTab("comboChart")
        ),
    },
    {
      separator: true,
    },
    {
      id: NavigatorViews.advancedChartSSR,
      icon: <IconChartBarPopular stroke={2} />,
      label: "Combo Chart SSR",
      template: (item) => itemRenderer(item, activeTab, "combo-chart-ssr"),
    },
  ];

  return (
    <>
      <Menu
        className="h-full flex justify-center items-center p-4 w-max"
        model={sidebarItems}
      />
      <Tooltip target=".p-menuitem-link" />
    </>
  );
});

export default Sidebar;
