"use client";

import { rootStoreContext } from "@/app/layout";
import { NavigatorView, NavigatorViews } from "@/constants/NavigatorViews";
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
import { useContext } from "react";

const itemRenderer = (
  item: MenuItem,
  activeTab: NavigatorView,
  itemPath: string,
  updateActiveTab?: (tab: NavigatorView, path: string) => void
) => (
  <div
    className={`p-menuitem-content rounded-md ${
      item.id === activeTab ? "bg-blue-400" : ""
    }`}
  >
    <button
      className="flex align-items-center p-menuitem-link"
      data-pr-tooltip={item.label}
      data-pr-position="right"
      type="button"
      onClick={() => {
        updateActiveTab?.(item.id as NavigatorView, itemPath);
      }}
    >
      <span>{item.icon}</span>
    </button>
  </div>
);

export const Sidebar = observer(() => {
  const rootStore = useContext(rootStoreContext);
  const { activeTab } = rootStore;
  const router = useRouter();

  const onMenuItemClick = (tab: NavigatorView, path: string) => {
    rootStore.setActiveTab(tab);
    router.push(path);
    rootStore.setFrontendData(tab);
  };

  const sidebarItems: MenuItem[] = [
    {
      id: NavigatorViews.dashboard,
      icon: <IconLayoutDashboard className="w-6" stroke={2} />,
      label: "My Forecast",
      template: (item) => itemRenderer(item, activeTab, "/", onMenuItemClick),
    },
    {
      id: NavigatorViews.map,
      icon: <IconMap stroke={2} />,
      label: "Map overview CSR",
      disabled: true,
      template: (item) =>
        itemRenderer(item, activeTab, NavigatorViews.map, onMenuItemClick),
    },
    {
      separator: true,
    },
    {
      id: NavigatorViews.comboChart,
      icon: <IconChartBar stroke={2} />,
      label: "Combo Chart CSR",
      template: (item) =>
        itemRenderer(
          item,
          activeTab,
          NavigatorViews.comboChart,
          onMenuItemClick
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
