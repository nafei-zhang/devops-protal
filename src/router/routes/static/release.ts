import type { AppRouteRecordRaw } from "#src/router/types";
import { ContainerLayout } from "#src/layout";
import { $t } from "#src/locales";
import { release } from "#src/router/extra-info";

import { AppstoreOutlined, DeploymentUnitOutlined, FileTextOutlined } from "@ant-design/icons";
import { createElement, lazy } from "react";

const CR = lazy(() => import("#src/pages/release/cr"));
const Pipeline = lazy(() => import("#src/pages/release/pipeline"));
const PipelineDetail = lazy(() => import("#src/pages/release/pipeline/detail"));

const routes: AppRouteRecordRaw[] = [
	{
		path: "/release",
		Component: ContainerLayout,
		handle: {
			icon: createElement(AppstoreOutlined),
			title: $t("common.menu.release"),
			order: release,
		},
		children: [
			{
				path: "/release/cr",
				Component: CR,
				handle: {
					icon: createElement(FileTextOutlined),
					title: $t("common.menu.cr"),
				},
			},
			{
				path: "/release/pipeline",
				Component: Pipeline,
				handle: {
					icon: createElement(DeploymentUnitOutlined),
					title: $t("common.menu.pipeline"),
				},
			},
			{
				path: "/release/pipeline/detail/:id",
				Component: PipelineDetail,
				handle: {
					hideInMenu: true, // 在菜单中隐藏
					title: $t("common.menu.pipelineDetail"),
				},
			},
		],
	},
];

export default routes;
