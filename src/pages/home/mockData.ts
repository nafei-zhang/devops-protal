import type { TeamPodDataType } from "#src/api/home";

// 模拟 LineChart 数据
export const lineChartData = {
  week: [320, 450, 280, 560, 390, 420, 350],
  month: Array.from({ length: 30 }).map(() => Math.floor(Math.random() * 900) + 100),
  year: Array.from({ length: 365 }).map(() => Math.floor(Math.random() * 900) + 100)
};

// 模拟 TeamPodChart 数据
export const teamPodData: TeamPodDataType[] = [
  { value: 25, code: "landsharks" },
  { value: 20, code: "luckinseamen" },
  { value: 10, code: "sre" },
  { value: 15, code: "cherrybombers" },
  { value: 12, code: "greatwallguardians" },
  { value: 8, code: "kongfulpandas" },
  { value: 10, code: "northenstars" },
];

// 模拟 CardList 数据
export const cardListData = [
  {
    title: "landsharks",
    data: 132,
    icon: "RocketOutlined",
  },
  {
    title: "luckinseamen",
    data: 148,
    icon: "TeamOutlined",
  },
  {
    title: "sre",
    data: 95,
    icon: "CloudServerOutlined",
  },
  {
    title: "cherrybombers",
    data: 118,
    icon: "ThunderboltOutlined",
  },
  {
    title: "greatwallguardians",
    data: 122,
    icon: "SafetyOutlined",
  },
  {
    title: "kongfulpandas",
    data: 85,
    icon: "CrownOutlined",
  },
  {
    title: "northenstars",
    data: 128,
    icon: "StarOutlined",
  },
];