import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { fetchApiList } from "#src/api/release";
import { BasicButton, BasicContent, BasicTable } from "#src/components";

import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Tag } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import NewPipelineModal from "./components/new-pipeline-modal";

// API数据类型定义
export interface ApiItemType {
	id?: string
	status?: number
	apiName: string
	apiVersion: string
	stage: string
	creator?: string
	createdDate?: string
	branch: string
	jiraId: string
}

// 模拟API数据已移至 src/api/release/index.ts

// 模拟API请求函数已移至 src/api/release/index.ts

export default function Pipeline() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const actionRef = useRef<ActionType>(null);
	const [searchValue, setSearchValue] = useState<string>("");
	const [modalVisible, setModalVisible] = useState<boolean>(false);

	// 表格列定义
	const columns: ProColumns<ApiItemType>[] = [
		{
			dataIndex: "status",
			title: t("common.status"),
			width: 80,
			render: (_, record) => {
				return (
					<div
						className="flex items-center justify-center cursor-pointer"
						onClick={() => {
							if (record.id) {
								navigate(`/release/pipeline/detail/${record.id}`);
							}
						}}
						title={t("pipeline.detail.clickToViewDetails")}
					>
						<div
							className={`w-3 h-3 rounded-full ${record.status === 1 ? "bg-green-500" : "bg-gray-400"}`}
						/>
					</div>
				);
			},
		},
		{
			title: "ID",
			dataIndex: "id",
			width: 100,
		},
		{
			title: t("pipeline.detail.apiName"),
			dataIndex: "apiName",
			ellipsis: true,
		},
		{
			title: t("pipeline.detail.apiVersion"),
			dataIndex: "apiVersion",
			width: 100,
		},
		{
			title: t("pipeline.detail.stage"),
			dataIndex: "stage",
			width: 100,
			render: (text) => {
				let color = "blue";
				let stageText = text;

				// 根据stage值设置颜色和翻译
				switch (text) {
					case "生产":
					case "production":
						color = "green";
						stageText = t("pipeline.detail.steps.productionDeployment");
						break;
					case "测试":
					case "testing":
						color = "orange";
						stageText = t("pipeline.detail.steps.sitEnvironment");
						break;
					case "开发":
					case "development":
						color = "blue";
						stageText = t("pipeline.detail.steps.devDeployment");
						break;
					default:
						color = "blue";
						stageText = text as string;
				}

				return <Tag color={color}>{stageText}</Tag>;
			},
		},
		{
			title: t("pipeline.detail.creator"),
			dataIndex: "creator",
			width: 100,
		},
		{
			title: t("pipeline.detail.createdDate"),
			dataIndex: "createdDate",
			width: 120,
		},
		{
			title: t("common.action"),
			valueType: "option",
			key: "option",
			width: 120,
			fixed: "right",
			render: () => {
				return [
					<BasicButton key="rebuild" type="link" size="small">
						{t("common.rebuild")}
					</BasicButton>,
				];
			},
		},
	];

	// 搜索处理函数
	const handleSearch = () => {
		actionRef.current?.reload();
	};

	// 重置搜索
	const handleReset = () => {
		setSearchValue("");
		actionRef.current?.reload();
	};

	return (
		<BasicContent className="h-full">
			<BasicTable<ApiItemType>
				adaptive
				columns={columns}
				actionRef={actionRef}
				request={async (params) => {
					const responseData = await fetchApiList({
						...params,
						apiName: searchValue,
					});
					return {
						...responseData,
						data: responseData.result.list,
						total: responseData.result.total,
					};
				}}
				headerTitle={t("pipeline.list.apiManagement")}
				toolBarRender={() => [
					<Space key="search-input">
						<Input
							placeholder={t("pipeline.list.searchApiName")}
							value={searchValue}
							onChange={e => setSearchValue(e.target.value)}
							onPressEnter={handleSearch}
							style={{ width: 200 }}
							prefix={<SearchOutlined />}
						/>
						<Button type="primary" onClick={handleSearch}>
							{t("common.search")}
						</Button>
						<Button onClick={handleReset}>{t("common.reset")}</Button>
					</Space>,
					<Button
						key="add-api"
						icon={<PlusCircleOutlined />}
						type="primary"
						onClick={() => setModalVisible(true)}
					>
						{t("common.add")}
					</Button>,
				]}
				rowKey="id"
				search={false}
				pagination={{
					defaultPageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
				}}
			/>

			{/* 新建API模态框 */}
			<NewPipelineModal
				title={t("pipeline.list.newPipeline")}
				open={modalVisible}
				onCloseChange={() => setModalVisible(false)}
				refreshTable={() => actionRef.current?.reload()}
			/>
		</BasicContent>
	);
}
