import type { TeamPodDataType } from "#src/api/home";
import type { EChartsOption } from "echarts";
import { Card } from "antd";
import ReactECharts from "echarts-for-react";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { teamPodData } from "../mockData";

export default function TeamPodChart() {
	const { t } = useTranslation();
	
	const DATA_KEY = {
		landsharks: t("home.landsharks"),
		luckinseamen: t("home.luckinseamen"),
		sre: t("home.sre"),
		cherrybombers: t("home.cherrybombers"),
		greatwallguardians: t("home.greatwallguardians"),
		kongfulpandas: t("home.kongfulpandas"),
		northenstars: t("home.northenstars"),
	};
	
	const [data, setData] = useState<TeamPodDataType[]>(
		teamPodData.map((item) => {
			const code = item.code as keyof typeof DATA_KEY;
			return {
				...item,
				name: DATA_KEY[code],
			};
		})
	);

	const option: EChartsOption = {
		tooltip: {
			trigger: "item",
			formatter: "{a} <br/>{b} : {c}%",
		},
		legend: {
			orient: "vertical",
			left: "left",
			type: "scroll",
			textStyle: {
				overflow: "truncate",
				width: 100
			}
		},
		series: [
			{
				name: t("home.teamDistribution"),
				type: "pie",
				radius: ["40%", "70%"],
				center: ["60%", "55%"],
				avoidLabelOverlap: true,
				itemStyle: {
					borderRadius: 6,
					borderColor: "#fff",
					borderWidth: 2
				},
				label: {
					show: true,
					formatter: "{b}: {c}%",
					fontWeight: "normal"
				},
				emphasis: {
					label: {
						show: true,
						fontWeight: "normal"
					},
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)"
					}
				},
				data,
			},
		],
	};



	return (
		<Card
			title={t("home.teamDistribution")}
		>
			<div style={{ height: "350px" }}>
				<ReactECharts 
					opts={{ height: "auto", width: "auto" }} 
					option={option} 
					style={{ height: "100%", width: "100%" }}
				/>
			</div>
		</Card>
	);
}