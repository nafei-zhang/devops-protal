import type { EChartsOption } from "echarts";
import { Card, Tooltip } from "antd";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function BarChart() {
	const { t } = useTranslation();
	const option: EChartsOption = {
		title: {
			text: "",
			subtext: "",
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: {
			type: "category",
			data: [
				t("home.systemStability"),
				t("home.deploymentFrequency"),
				t("home.leadTime"),
				t("home.mttr"),
				t("home.changeFailureRate"),
			],
			axisLabel: {
				interval: 0,
				rotate: 45,
				margin: 15,
				overflow: "breakAll"
			}
		},
		yAxis: {
			type: "value",
			name: "%",
			max: 100
		},
		tooltip: {
			trigger: "axis",
			formatter: "{b}: {c}%",
			textStyle: {
				fontWeight: "normal"
			}
		},
		series: [
			{
				type: "bar",
				data: [
					{ value: 99.5, name: t("home.systemStability") },
					{ value: 85, name: t("home.deploymentFrequency") },
					{ value: 78, name: t("home.leadTime") },
					{ value: 92, name: t("home.mttr") },
					{ value: 15, name: t("home.changeFailureRate") },
				],
				itemStyle: {
					color: function(params) {
						// 为变更失败率使用不同的颜色
						if (params.dataIndex === 4) {
							return '#ff7875'; // 红色
						}
						return '#1890ff'; // 蓝色
					}
				}
			},
		],
	};
	const tooltipTitle = (
		<>
			<div>{t("home.doraMetricsExplanation")}</div>
			<div>- {t("home.systemStabilityExplanation")}</div>
			<div>- {t("home.deploymentFrequencyExplanation")}</div>
			<div>- {t("home.leadTimeExplanation")}</div>
			<div>- {t("home.mttrExplanation")}</div>
			<div>- {t("home.changeFailureRateExplanation")}</div>
		</>
	);

	return (
		<Card 
			title={
				<div className="flex items-center">
					<span>{t("home.views")}</span>
					<Tooltip title={tooltipTitle}>
						<InfoCircleOutlined className="ml-2 text-gray-400" />
					</Tooltip>
				</div>
			}
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
