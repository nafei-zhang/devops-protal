import type { ApiItemType } from "../index";
import { fetchAddApiItem } from "#src/api/release";

import {
	ModalForm,
	ProFormSelect,
	ProFormText,
} from "@ant-design/pro-components";
import { Form } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface NewPipelineModalProps {
	title: React.ReactNode
	open: boolean
	onCloseChange: () => void
	refreshTable?: () => void
}

// 模拟环境数据
function getEnvironmentOptions(t: any) {
	return [
		{ label: t("pipeline.detail.steps.devDeployment"), value: "开发" },
		{ label: t("pipeline.detail.steps.sitEnvironment"), value: "测试" },
		{ label: t("pipeline.detail.steps.productionDeployment"), value: "生产" },
	];
}

// 模拟API名称数据
function getApiNameOptions(t: any) {
	return [
		{ label: t("pipeline.list.apiNames.userManagement"), value: "用户管理API" },
		{ label: t("pipeline.list.apiNames.orderManagement"), value: "订单管理API" },
		{ label: t("pipeline.list.apiNames.paymentManagement"), value: "支付管理API" },
		{ label: t("pipeline.list.apiNames.productManagement"), value: "商品管理API" },
		{ label: t("pipeline.list.apiNames.inventoryManagement"), value: "库存管理API" },
		{ label: t("pipeline.list.apiNames.logisticsManagement"), value: "物流管理API" },
		{ label: t("pipeline.list.apiNames.memberManagement"), value: "会员管理API" },
		{ label: t("pipeline.list.apiNames.marketingManagement"), value: "营销管理API" },
		{ label: t("pipeline.list.apiNames.dataAnalysis"), value: "数据分析API" },
		{ label: t("pipeline.list.apiNames.messageNotification"), value: "消息通知API" },
	];
}

export default function NewPipelineModal({
	title,
	open,
	onCloseChange,
	refreshTable,
}: NewPipelineModalProps) {
	const { t } = useTranslation();
	const [form] = Form.useForm<ApiItemType>();

	const onFinish = async (values: ApiItemType) => {
		try {
			// 调用API创建新的Pipeline
			// 调用添加API的函数
			const result = await fetchAddApiItem(values);

			if (result.success) {
				window.$message?.success(t("pipeline.list.createApiSuccess"));

				/* 刷新表格 */
				refreshTable?.();
				// 返回true会关闭弹框
				return true;
			}
			else {
				window.$message?.error(t("pipeline.list.createApiFailed"));
				return false;
			}
		}
		catch (error) {
			console.error(t("pipeline.list.createApiError"), error);
			window.$message?.error(t("pipeline.list.createApiError"));
			return false;
		}
	};

	useEffect(() => {
		if (open) {
			form.resetFields();
		}
	}, [open, form]);

	return (
		<ModalForm<ApiItemType>
			title={title}
			open={open}
			onOpenChange={(visible) => {
				if (visible === false) {
					onCloseChange();
				}
			}}
			labelCol={{ md: 8, xl: 6 }}
			layout="horizontal"
			form={form}
			autoFocusFirstInput
			modalProps={{
				destroyOnHidden: true,
				bodyStyle: { maxHeight: "600px", overflow: "auto" },
			}}
			width={700}
			onFinish={onFinish}
			submitter={{
				searchConfig: {
					resetText: t("common.cancel"),
					submitText: t("common.add"),
				},
			}}
		>
			<ProFormSelect
				showSearch
				rules={[
					{
						required: true,
						message: t("pipeline.list.pleaseSelectApiName"),
					},
				]}
				name="apiName"
				label={t("pipeline.detail.apiName")}
				options={getApiNameOptions(t)}
				fieldProps={{
					showSearch: true,
					filterOption: (input, option) =>
						(option?.label as string).toLowerCase().includes(input.toLowerCase()),
					allowClear: true,
					placeholder: t("pipeline.list.pleaseSelectOrSearchApiName"),
				}}
			/>

			<ProFormText
				allowClear
				rules={[
					{
						required: true,
						message: t("pipeline.list.pleaseInputApiVersion"),
					},
				]}
				name="apiVersion"
				label={t("pipeline.detail.apiVersion")}
			/>

			<ProFormText
				allowClear
				rules={[
					{
						required: true,
						message: t("pipeline.list.pleaseInputBranch"),
					},
				]}
				name="branch"
				label={t("pipeline.detail.branch")}
			/>

			<ProFormSelect
				name="stage"
				label={t("pipeline.list.targetEnvironment")}
				rules={[
					{
						required: true,
						message: t("pipeline.list.pleaseSelectTargetEnvironment"),
					},
				]}
				options={getEnvironmentOptions(t)}
			/>

			<ProFormText
				allowClear
				rules={[
					{
						required: true,
						message: t("pipeline.list.pleaseInputJiraId"),
					},
				]}
				name="jiraId"
				label={t("pipeline.detail.jiraId")}
			/>
		</ModalForm>
	);
}
