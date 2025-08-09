import type { EChartsOption } from "echarts";
import { Card, Radio } from "antd";
import ReactECharts from "echarts-for-react";
import { useState } from "react";

import { useTranslation } from "react-i18next";
import { lineChartData } from "../mockData";

export default function LineChart() {
	const { t } = useTranslation();
	const [value, setValue] = useState("month");

	const [data, setData] = useState<number[]>(lineChartData.month);

	const DATA_KEYS = {
		week: [
			t("home.monday"),
			t("home.thursday"),
			t("home.wednesday"),
			t("home.thursday"),
			t("home.friday"),
			t("home.saturday"),
			t("home.sunday"),
		],
		month: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
		year: Array.from({ length: 12 }, (_, i) => t(`home.month${i + 1}`)),
	};

	const option: EChartsOption = {
		dataZoom: {
			type: value === "week" ? "inside" : "slider",
		},
		title: {
			text: "",
			subtext: "",
		},
		xAxis: {
			type: "category",
			// @ts-expect-error: xxx
			data: DATA_KEYS[value],
		},
		yAxis: {
			type: "value",
		},
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "cross" },
			textStyle: {
				fontWeight: "normal"
			}
		},
		series: [
			{
				type: "line",
				data,
			},
		],
	};

	// 当 value 变化时，更新数据
	const handleValueChange = (newValue: string) => {
		setValue(newValue);
		setData(lineChartData[newValue as keyof typeof lineChartData]);
	};

	return (
		<Card
			title={t("home.crNumber")}
			extra={(
				<Radio.Group
					defaultValue="month"
					buttonStyle="solid"
					value={value}
					onChange={e => handleValueChange(e.target.value)}
				>
					<Radio.Button value="week">{t("home.thisWeek")}</Radio.Button>
					<Radio.Button value="month">{t("home.thisMonth")}</Radio.Button>
					<Radio.Button value="year">{t("home.thisYear")}</Radio.Button>
				</Radio.Group>
			)}
		>
			<ReactECharts
				opts={{ height: "auto", width: "auto" }}
				option={option}
			/>
		</Card>
	);
}
