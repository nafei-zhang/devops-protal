import { faker } from "@faker-js/faker/locale/zh_CN";
import { defineFakeRoute } from "vite-plugin-fake-server/client";

import { resultSuccess } from "./utils";

const home = {
	cardList: [],
};

export default defineFakeRoute([
	{
		url: "/home",
		timeout: 1000,
		method: "get",
		response: () => resultSuccess(home),
	},
	{
		url: "/home/team-pods",
		timeout: 1000,
		method: "get",
		response: () => {
			// 生成总和为100的随机数据，代表全年CR数据占比
			const generateProportionalValues = () => {
				// 先生成随机数
				const rawValues = [
					faker.number.int({ min: 10, max: 30 }),
					faker.number.int({ min: 10, max: 25 }),
					faker.number.int({ min: 5, max: 15 }),
					faker.number.int({ min: 5, max: 20 }),
					faker.number.int({ min: 8, max: 18 }),
					faker.number.int({ min: 5, max: 15 }),
					faker.number.int({ min: 7, max: 20 }),
				];
				
				// 计算总和
				const sum = rawValues.reduce((acc, val) => acc + val, 0);
				
				// 按比例调整，确保总和为100
				return rawValues.map(val => Math.round((val / sum) * 100));
			};
			
			const proportionalValues = generateProportionalValues();
			
			const teamPods = [
				{ value: proportionalValues[0], code: "landsharks" },
				{ value: proportionalValues[1], code: "luckinseamen" },
				{ value: proportionalValues[2], code: "sre" },
				{ value: proportionalValues[3], code: "cherrybombers" },
				{ value: proportionalValues[4], code: "greatwallguardians" },
				{ value: proportionalValues[5], code: "kongfulpandas" },
				{ value: proportionalValues[6], code: "northenstars" },
			];
			return resultSuccess(teamPods);
		},
	},
	{
		url: "/home/pie",
		timeout: 1000,
		method: "get",
		// statusCode: 401,
		response: () => {
			const pie = [
				{ value: faker.number.int({ min: 10, max: 100 }), code: "electronics" },
				{ value: faker.number.int({ min: 10, max: 100 }), code: "home_goods" },
				{
					value: faker.number.int({ min: 10, max: 100 }),
					code: "apparel_accessories",
				},
				{
					value: faker.number.int({ min: 10, max: 100 }),
					code: "food_beverages",
				},
				{
					value: faker.number.int({ min: 10, max: 100 }),
					code: "beauty_skincare",
				},
			];
			return resultSuccess(pie);
		},
	},
	{
		url: "/home/line",
		timeout: 1000,
		method: "post",
		response: ({ body }) => {
			if (body.range === "week") {
				return resultSuccess(
					Array.from({ length: 7 }).map(() =>
						faker.number.int({ min: 100, max: 1000 }),
					),
				);
			}
			if (body.range === "month") {
				const currentDate = new Date();
				const currentDay = currentDate.getDate();
				return resultSuccess(
					Array.from({ length: currentDay }).map(() =>
						faker.number.int({ min: 100, max: 1000 }),
					),
				);
			}
			if (body.range === "year") {
				const currentDate = new Date();
				const currentMonth = currentDate.getMonth();
				const currentYear = currentDate.getFullYear();

				const daysBeforeCurrentMonth = [];

				for (let month = 0; month < currentMonth; month++) {
					const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
					for (let day = 1; day <= daysInMonth; day++) {
						daysBeforeCurrentMonth.push(day);
					}
				}

				return resultSuccess(
					Array.from({ length: daysBeforeCurrentMonth.length }).map(() =>
						faker.number.int({ min: 100, max: 1000 }),
					),
				);
			}
			return resultSuccess([]);
		},
	},
]);
