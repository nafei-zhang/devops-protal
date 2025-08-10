import type { ApiItemType } from "#src/pages/release/pipeline";

// 模拟获取API详情的函数
export async function fetchApiDetail(id: string) {
	// 模拟API请求延迟
	await new Promise(resolve => setTimeout(resolve, 500));

	// 这里应该是从后端获取数据
	// 为了演示，返回一些模拟数据
	// 状态值对应关系：
	// 0: Pending (橙色)
	// 1: Running (绿色)
	// 2: Completed (蓝色)
	// 3: Failed (红色)
	// 4: Canceled (灰色)
	// 5: Skipped (浅灰色)
	const mockApiData: ApiItemType[] = [
		{
			id: "API001",
			status: 0, // Pending
			apiName: "用户管理API",
			apiVersion: "v1.0.0",
			stage: "生产",
			creator: "张三",
			createdDate: "2023-05-15",
			branch: "master",
			jiraId: "JIRA-001",
		},
		{
			id: "API002",
			status: 1, // Running
			apiName: "订单管理API",
			apiVersion: "v2.1.0",
			stage: "测试",
			creator: "李四",
			createdDate: "2023-06-20",
			branch: "feature/order",
			jiraId: "JIRA-002",
		},
		{
			id: "API003",
			status: 2, // Completed
			apiName: "支付管理API",
			apiVersion: "v1.5.0",
			stage: "开发",
			creator: "王五",
			createdDate: "2023-07-10",
			branch: "feature/payment",
			jiraId: "JIRA-003",
		},
		{
			id: "API004",
			status: 3, // Failed
			apiName: "库存管理API",
			apiVersion: "v1.2.0",
			stage: "测试",
			creator: "赵六",
			createdDate: "2023-08-05",
			branch: "feature/inventory",
			jiraId: "JIRA-004",
		},
		{
			id: "API005",
			status: 4, // Canceled
			apiName: "消息通知API",
			apiVersion: "v0.9.0",
			stage: "开发",
			creator: "钱七",
			createdDate: "2023-09-12",
			branch: "feature/notification",
			jiraId: "JIRA-005",
		},
		{
			id: "API006",
			status: 5, // Skipped
			apiName: "报表统计API",
			apiVersion: "v1.1.0",
			stage: "生产",
			creator: "孙八",
			createdDate: "2023-10-01",
			branch: "feature/reports",
			jiraId: "JIRA-006",
		},
	];

	// 查找对应ID的API
	const apiItem = mockApiData.find(item => item.id === id);

	return {
		success: true,
		result: apiItem || null,
	};
}

// 模拟添加API的函数
export async function fetchAddApiItem(data: ApiItemType) {
	// 模拟API请求延迟
	await new Promise(resolve => setTimeout(resolve, 500));

	// 模拟返回结果
	return {
		success: true,
		result: {
			...data,
			id: `API${Math.floor(Math.random() * 1000)}`,
			status: 1,
			creator: "当前用户",
			createdDate: new Date().toISOString().split("T")[0],
		},
	};
}

// 模拟获取API列表的函数
export async function fetchApiList(params: any) {
	// 模拟API请求延迟
	await new Promise(resolve => setTimeout(resolve, 500));

	// 这里应该是从后端获取数据
	// 为了演示，返回一些模拟数据
	// 状态值对应关系：
	// 0: Pending (橙色)
	// 1: Running (绿色)
	// 2: Completed (蓝色)
	// 3: Failed (红色)
	// 4: Canceled (灰色)
	// 5: Skipped (浅灰色)
	const mockApiData: ApiItemType[] = [
		{
			id: "API001",
			status: 0, // Pending
			apiName: "用户管理API",
			apiVersion: "v1.0.0",
			stage: "生产",
			creator: "张三",
			createdDate: "2023-05-15",
			branch: "master",
			jiraId: "JIRA-001",
		},
		{
			id: "API002",
			status: 1, // Running
			apiName: "订单管理API",
			apiVersion: "v2.1.0",
			stage: "测试",
			creator: "李四",
			createdDate: "2023-06-20",
			branch: "feature/order",
			jiraId: "JIRA-002",
		},
		{
			id: "API003",
			status: 2, // Completed
			apiName: "支付管理API",
			apiVersion: "v1.5.0",
			stage: "开发",
			creator: "王五",
			createdDate: "2023-07-10",
			branch: "feature/payment",
			jiraId: "JIRA-003",
		},
		{
			id: "API004",
			status: 3, // Failed
			apiName: "库存管理API",
			apiVersion: "v1.2.0",
			stage: "测试",
			creator: "赵六",
			createdDate: "2023-08-05",
			branch: "feature/inventory",
			jiraId: "JIRA-004",
		},
		{
			id: "API005",
			status: 4, // Canceled
			apiName: "消息通知API",
			apiVersion: "v0.9.0",
			stage: "开发",
			creator: "钱七",
			createdDate: "2023-09-12",
			branch: "feature/notification",
			jiraId: "JIRA-005",
		},
		{
			id: "API006",
			status: 5, // Skipped
			apiName: "报表统计API",
			apiVersion: "v1.1.0",
			stage: "生产",
			creator: "孙八",
			createdDate: "2023-10-01",
			branch: "feature/reports",
			jiraId: "JIRA-006",
		},
	];

	// 模拟搜索过滤
	let filteredData = [...mockApiData];
	if (params.apiName) {
		filteredData = filteredData.filter(item =>
			item.apiName.toLowerCase().includes(params.apiName.toLowerCase()),
		);
	}

	return {
		success: true,
		result: {
			list: filteredData,
			total: filteredData.length,
		},
	};
}
