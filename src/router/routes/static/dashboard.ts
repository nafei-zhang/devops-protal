import type { AppRouteRecordRaw } from "#src/router/types";
import { Iframe } from "#src/components";
import { ContainerLayout } from "#src/layout";
import { $t } from "#src/locales";
import { dashboard } from "#src/router/extra-info";

import { DashboardOutlined } from "@ant-design/icons";
import { createElement } from "react";

const routes: AppRouteRecordRaw[] = [
	{
		path: "/dashboard",
		Component: ContainerLayout,
		handle: {
			icon: createElement(DashboardOutlined),
			title: $t("common.menu.dashboard"),
			order: dashboard,
		},
		children: [
			{
				index: true,
				Component: Iframe,
				handle: {
					title: $t("common.menu.dashboard"),
					icon: createElement(DashboardOutlined),
					iframeLink: "https://ant.design/", // 替换为实际的外部网站URL
				},
			},
		],
	},
];

export default routes;
