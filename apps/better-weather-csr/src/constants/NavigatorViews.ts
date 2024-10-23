export const NavigatorViews = {
  dashboard: "dashboard",
  map: "map",
  heatmap: "Heatmap",
  comboChart: "combo-chart",
  advancedChartSSR: "advancedChartSSR",
} as const;

export type NavigatorView =
  (typeof NavigatorViews)[keyof typeof NavigatorViews];
