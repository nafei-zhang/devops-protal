import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Form, Input, Modal, Radio, Select, Upload } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "../style";

// 基础模态框属性
interface BaseModalProps {
	open: boolean
	title: string
	onCancel: () => void
	onPending: () => void
	onContinue: () => void
}

// 开始步骤模态框
export const StartModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="Project Name" name="projectName">
						<Input />
					</Form.Item>
					<Form.Item label="Start Date" name="startDate">
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label="Team" name="team">
						<Select
							options={[
								{ label: "Team A", value: "teamA" },
								{ label: "Team B", value: "teamB" },
								{ label: "Team C", value: "teamC" },
							]}
						/>
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// 静态扫描与镜像构建模态框
export const StaticScanningModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="Scan Type" name="scanType">
						<Radio.Group>
							<Radio value="full">Full Scan</Radio>
							<Radio value="incremental">Incremental Scan</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Image Name" name="imageName">
						<Input />
					</Form.Item>
					<Form.Item label="Image Tag" name="imageTag">
						<Input />
					</Form.Item>
					<Form.Item label="Build Parameters" name="buildParams">
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// 开发部署与Cyberflows DAST模态框
export const DevDeploymentModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="Environment" name="environment">
						<Select
							defaultValue="dev"
							options={[
								{ label: "Development", value: "dev" },
								{ label: "Testing", value: "test" },
							]}
						/>
					</Form.Item>
					<Form.Item label="Schedule Start Date Time" name="startDateTime">
						<DatePicker showTime style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label="Duration" name="duration">
						<Input />
					</Form.Item>
					<Form.Item label="DAST Scan Level" name="dastScanLevel">
						<Radio.Group>
							<Radio value="basic">Basic</Radio>
							<Radio value="standard">Standard</Radio>
							<Radio value="comprehensive">Comprehensive</Radio>
						</Radio.Group>
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// SIT环境流程模态框
export const SitEnvironmentModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="SIT Environment" name="sitEnvironment">
						<Select
							defaultValue="sit1"
							options={[
								{ label: "SIT 1", value: "sit1" },
								{ label: "SIT 2", value: "sit2" },
								{ label: "SIT 3", value: "sit3" },
							]}
						/>
					</Form.Item>
					<Form.Item label="Schedule Start Date Time" name="startDateTime">
						<DatePicker showTime style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label="Test Cases" name="testCases">
						<Input.TextArea rows={4} placeholder="Enter test cases to run" />
					</Form.Item>
					<Form.Item label="Regression Test" name="regressionTest" valuePropName="checked">
						<Checkbox>Run Regression Tests</Checkbox>
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// 发布签核与准备模态框
export const ReleaseSignoffModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="Approver" name="approver">
						<Select
							mode="multiple"
							placeholder="Select approvers"
							options={[
								{ label: "John Doe", value: "john" },
								{ label: "Jane Smith", value: "jane" },
								{ label: "Bob Johnson", value: "bob" },
							]}
						/>
					</Form.Item>
					<Form.Item label="Release Notes" name="releaseNotes">
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item label="Change Purpose" name="changePurpose">
						<Input />
					</Form.Item>
					<Form.Item label="Supporting Documents" name="supportingDocs">
						<Upload>
							<Button icon={<UploadOutlined />}>Upload Files</Button>
						</Upload>
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// CTE/预生产部署模态框
export const CteDeploymentModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="CTE Environment" name="cteEnvironment">
						<Select
							defaultValue="preprod"
							options={[
								{ label: "Pre-Production", value: "preprod" },
								{ label: "CTE", value: "cte" },
							]}
						/>
					</Form.Item>
					<Form.Item label="Schedule Start Date Time" name="startDateTime">
						<DatePicker showTime style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label="Duration" name="duration">
						<Input />
					</Form.Item>
					<Form.Item label="Deployment Strategy" name="deploymentStrategy">
						<Radio.Group>
							<Radio value="blueGreen">Blue-Green</Radio>
							<Radio value="canary">Canary</Radio>
							<Radio value="rolling">Rolling</Radio>
						</Radio.Group>
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// 准备最终CR模态框
export const PrepareFinalCRModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="CR Number" name="crNumber">
						<Input />
					</Form.Item>
					<Form.Item label="Change Purpose" name="changePurpose">
						<Input />
					</Form.Item>
					<Form.Item label="Short Description" name="shortDescription">
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item label="Risk Assessment" name="riskAssessment">
						<Select
							options={[
								{ label: "Low", value: "low" },
								{ label: "Medium", value: "medium" },
								{ label: "High", value: "high" },
							]}
						/>
					</Form.Item>
					<Form.Item name="isEmergency" valuePropName="checked">
						<Checkbox>Is Emergency</Checkbox>
					</Form.Item>
					<Form.Item label="Attachments" name="attachments">
						<Upload.Dragger multiple>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">Click or drag file to this area to upload</p>
						</Upload.Dragger>
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// 生产部署模态框
export const ProductionDeploymentModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="Schedule Start Date Time" name="startDateTime">
						<DatePicker showTime style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label="Duration" name="duration">
						<Input />
					</Form.Item>
					<Form.Item label="Deployment Window" name="deploymentWindow">
						<Select
							options={[
								{ label: "Regular Hours", value: "regular" },
								{ label: "After Hours", value: "after" },
								{ label: "Weekend", value: "weekend" },
							]}
						/>
					</Form.Item>
					<Form.Item label="Deployment Strategy" name="deploymentStrategy">
						<Radio.Group>
							<Radio value="blueGreen">Blue-Green</Radio>
							<Radio value="canary">Canary</Radio>
							<Radio value="rolling">Rolling</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Rollback Plan" name="rollbackPlan">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// 完成模态框
export const CompletedModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="Completion Date" name="completionDate">
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label="Deployment Summary" name="deploymentSummary">
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item label="Post-Deployment Issues" name="postDeploymentIssues">
						<Radio.Group>
							<Radio value="yes">Yes</Radio>
							<Radio value="no">No</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Issue Description" name="issueDescription">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

// 默认模态框（用于未定义特定模态框的步骤）
export const DefaultModal: React.FC<BaseModalProps> = ({
	open,
	title,
	onCancel,
	onPending,
	onContinue,
}) => {
	const { t } = useTranslation();
	const classes = useStyles();

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={null}
			width={600}
			centered
			className={classes.stepModal}
		>
			<div className={classes.modalContent}>
				<Form layout="vertical" className={classes.formContainer}>
					<Form.Item label="Schedule Start Date Time" name="startDateTime">
						<DatePicker showTime style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label="Duration" name="duration">
						<Input />
					</Form.Item>
					<Form.Item label="Change Purpose" name="changePurpose">
						<Input />
					</Form.Item>
					<Form.Item label="Short Description" name="shortDescription">
						<Input />
					</Form.Item>
					<Form.Item name="isEmergency" valuePropName="checked" className={classes.checkbox}>
						<Checkbox>Is Emergency</Checkbox>
					</Form.Item>
				</Form>
				<div className={classes.modalFooter}>
					<div className={classes.actionButtons}>
						<Button onClick={onPending} className={classes.pendingButton}>
							{t("pipeline.detail.status.pending")}
						</Button>
						<Button type="primary" onClick={onContinue}>
							{t("pipeline.detail.status.continue")}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};
