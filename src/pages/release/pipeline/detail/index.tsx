import { fetchApiDetail } from "#src/api/release";
import { BasicButton, BasicContent } from "#src/components";

import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Divider, Steps, Tag, Typography, Spin, Modal, Input, Checkbox, DatePicker, Form } from "antd";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

import type { ApiItemType } from "../index";
import { useStyles } from "./style";

const { Title, Text } = Typography;

// 步骤状态类型
type StepStatusType = 'pending' | 'running' | 'completed' | 'failed' | 'canceled' | 'skipped';

// 步骤属性类型
interface StepProps {
	title: string;
	description: string;
	customStatus: StepStatusType;
	status: "wait" | "process" | "finish" | "error";
	icon: React.ReactNode;
}

export default function PipelineDetail() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [apiDetail, setApiDetail] = useState<ApiItemType | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [currentStep, setCurrentStep] = useState<number>(3); // 当前步骤
	const [stepStatus, setStepStatus] = useState<'process' | 'wait' | 'finish' | 'error'>('process'); // 当前步骤状态
	const [isStepLoading, setIsStepLoading] = useState<boolean>(false); // 步骤加载状态
	const [stepDetails, setStepDetails] = useState<string>(''); // 步骤详情
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 模态框显示状态
	const [modalTitle, setModalTitle] = useState<string>(''); // 模态框标题
	const [showPipelineDetails, setShowPipelineDetails] = useState<boolean>(false); // 控制pipeline details的显示
	const stepsContainerRef = useRef<HTMLDivElement>(null);
	const classes = useStyles();

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				try {
					setLoading(true);
					// 确保初始加载时不显示pipeline details
					setShowPipelineDetails(false);
					const response = await fetchApiDetail(id);
					if (response.success && response.result) {
						setApiDetail(response.result);
					}
					else {
						window.$message?.error(t("pipeline.detail.noApiDetails", { id }));
					}
				}
				catch (error) {
					console.error("Error fetching API details:", error);
					window.$message?.error(t("pipeline.detail.noApiDetails", { id }));
				}
				finally {
					setLoading(false);
				}
			}
		};

		fetchData();
	}, [id, t]);

	// 获取步骤详情
	const getStepDetails = (stepIndex: number) => {
		// 这里可以根据步骤索引返回不同的详情信息
		const stepInfo = pipelineSteps[stepIndex];
		if (!stepInfo) return '';

		switch (stepInfo.customStatus) {
			case 'running':
				return t('pipeline.detail.steps.runningDescription');
			case 'completed':
				return t('pipeline.detail.steps.completedDescription');
			case 'failed':
				return t('pipeline.detail.steps.failedDescription');
			case 'pending':
				return t('pipeline.detail.steps.pendingDescription');
			case 'canceled':
				return t('pipeline.detail.steps.canceledDescription');
			case 'skipped':
				return t('pipeline.detail.steps.skippedDescription');
			default:
				return t('pipeline.detail.stepDetails');
		}
	};

	// 自定义图标组件
	const CustomStepIcon = ({ status }: { status: StepStatusType }) => {
		let iconClass = '';
		let content = '';

		switch (status) {
			case 'pending':
				iconClass = classes.pendingIcon;
				// 使用空内容，让背景色显示为圆点
				content = '';
				break;
			case 'running':
				iconClass = classes.runningIcon;
				// 使用空内容，让背景色显示为圆点
				content = '';
				break;
			case 'completed':
				iconClass = classes.completedIcon;
				// 使用空内容，让背景色显示为圆点
				content = '';
				break;
			case 'failed':
				iconClass = classes.failedIcon;
				// 使用空内容，让背景色显示为圆点
				content = '';
				break;
			case 'canceled':
				iconClass = classes.canceledIcon;
				// 使用空内容，让背景色显示为圆点
				content = '';
				break;
			case 'skipped':
				iconClass = classes.skippedIcon;
				// 使用空内容，让背景色显示为圆点
				content = '';
				break;
			default:
				iconClass = classes.pendingIcon;
				// 使用空内容，让背景色显示为圆点
				content = '';
		}

		return (
			<div className={`${classes.stepIcon} ${iconClass}`}>
				{content}
			</div>
		);
	};

	// 将自定义状态映射到 Ant Design Steps 组件的状态
	const mapCustomStatusToAntd = (customStatus: StepStatusType): 'wait' | 'process' | 'finish' | 'error' => {
		switch (customStatus) {
			case 'pending':
				return 'wait';
			case 'running':
				return 'process';
			case 'completed':
				return 'finish';
			case 'failed':
				return 'error';
			case 'canceled':
				return 'wait';
			case 'skipped':
				return 'wait';
			default:
				return 'wait';
		}
	};

	// 步骤状态管理
	const [pipelineSteps, setPipelineSteps] = useState<StepProps[]>([]);

	// 更新步骤状态
	const updateStepStatus = (stepIndex: number, newStatus: StepStatusType) => {
		const updatedSteps = [...pipelineSteps];
		if (updatedSteps[stepIndex]) {
			updatedSteps[stepIndex].customStatus = newStatus;
			updatedSteps[stepIndex].status = mapCustomStatusToAntd(newStatus);
			updatedSteps[stepIndex].icon = <CustomStepIcon status={newStatus} />;
		}
		return updatedSteps;
	};

	// 切换步骤状态 - 模拟不同状态之间的切换
	const toggleStepStatus = (stepIndex: number) => {
		const updatedSteps = [...pipelineSteps];
		if (updatedSteps[stepIndex]) {
			// 获取当前状态
			const currentStatus = updatedSteps[stepIndex].customStatus;

			// 定义状态切换顺序 - 根据第二张图片中的状态顺序
			let newStatus: StepStatusType = 'pending';
			switch (currentStatus) {
				case 'pending':
					newStatus = 'running';
					break;
				case 'running':
					newStatus = 'completed';
					break;
				case 'completed':
					newStatus = 'failed';
					break;
				case 'failed':
					newStatus = 'canceled';
					break;
				case 'canceled':
					newStatus = 'skipped';
					break;
				case 'skipped':
					newStatus = 'pending';
					break;
				default:
					newStatus = 'pending';
			}

			// 更新步骤状态
			updatedSteps[stepIndex].customStatus = newStatus;
			updatedSteps[stepIndex].status = mapCustomStatusToAntd(newStatus);
			updatedSteps[stepIndex].icon = <CustomStepIcon status={newStatus} />;

			// 更新步骤数组
			setPipelineSteps(updatedSteps);

			// 更新全局步骤状态
			if (newStatus === 'failed') {
				setStepStatus('error');
			} else if (newStatus === 'running') {
				setStepStatus('process');
			} else if (newStatus === 'completed') {
				setStepStatus('finish');
			} else if (newStatus === 'canceled' || newStatus === 'skipped') {
				setStepStatus('wait');
			}
		}
	};

	// 处理步骤点击
	const handleStepClick = (current: number) => {
		setIsStepLoading(true);

		// 模拟加载数据
		setTimeout(() => {
			// 更新当前步骤
			setCurrentStep(current);

			// 更新步骤详情
			setStepDetails(getStepDetails(current));

			// 不显示pipeline details
			setShowPipelineDetails(false);

			// 显示模态框 - 无论是否是同一个步骤，都显示模态框
			setModalTitle(pipelineSteps[current]?.title || '');
			setIsModalVisible(true);

			setIsStepLoading(false);
		}, 500);
	};

	// 模拟步骤状态变化
	const simulateStepStatusChange = () => {
		// 模拟不同步骤的不同状态 - 这里可以根据实际API返回的状态来设置
		const statusMap: StepStatusType[] = ['completed', 'running', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'];

		// 创建新的步骤数组 - 根据第一张图片中的流水线步骤
		const updatedSteps: StepProps[] = [
			{
				title: t("pipeline.detail.steps.start"),
				description: "",
				customStatus: 'completed' as StepStatusType,
				status: mapCustomStatusToAntd('completed'),
				icon: <CustomStepIcon status="completed" />
			},
			{
				title: t("pipeline.detail.steps.staticScanning"),
				description: "",
				customStatus: 'running' as StepStatusType,
				status: mapCustomStatusToAntd('running'),
				icon: <CustomStepIcon status="running" />
			},
			{
				title: t("pipeline.detail.steps.devDeployment"),
				description: "",
				customStatus: 'pending' as StepStatusType,
				status: mapCustomStatusToAntd('pending'),
				icon: <CustomStepIcon status="pending" />
			},
			{
				title: t("pipeline.detail.steps.sitEnvironment"),
				description: "",
				customStatus: 'pending' as StepStatusType,
				status: mapCustomStatusToAntd('pending'),
				icon: <CustomStepIcon status="pending" />
			},
			{
				title: t("pipeline.detail.steps.releaseSignoff"),
				description: "",
				customStatus: 'pending' as StepStatusType,
				status: mapCustomStatusToAntd('pending'),
				icon: <CustomStepIcon status="pending" />
			},
			{
				title: t("pipeline.detail.steps.cteDeployment"),
				description: "",
				customStatus: 'pending' as StepStatusType,
				status: mapCustomStatusToAntd('pending'),
				icon: <CustomStepIcon status="pending" />
			},
			{
				title: t("pipeline.detail.steps.prepareFinalCR"),
				description: "",
				customStatus: 'pending' as StepStatusType,
				status: mapCustomStatusToAntd('pending'),
				icon: <CustomStepIcon status="pending" />
			},
			{
				title: t("pipeline.detail.steps.productionDeployment"),
				description: "",
				customStatus: 'pending' as StepStatusType,
				status: mapCustomStatusToAntd('pending'),
				icon: <CustomStepIcon status="pending" />
			},
			{
				title: t("pipeline.detail.steps.completed"),
				description: "",
				customStatus: 'pending' as StepStatusType,
				status: mapCustomStatusToAntd('pending'),
				icon: <CustomStepIcon status="pending" />
			},
		];

		// 设置当前步骤为正在运行的步骤
		const runningStepIndex = updatedSteps.findIndex(step => step.customStatus === 'running');
		if (runningStepIndex !== -1) {
			setCurrentStep(runningStepIndex);
		}

		return updatedSteps;
	};

	// 初始化步骤状态
	useEffect(() => {
		// 模拟步骤状态变化
		const updatedSteps = simulateStepStatusChange();
		setPipelineSteps(updatedSteps);
	}, [t]);

	// 处理Pending按钮点击
	const handlePendingClick = () => {
		// 将当前步骤状态设置为pending
		const updatedSteps = updateStepStatus(currentStep, 'pending');
		setPipelineSteps(updatedSteps);
		setStepStatus('wait');
		setIsModalVisible(false);
		// 不显示pipeline details
		setShowPipelineDetails(false);
		// 重置当前步骤状态，确保下次点击同一步骤时能再次打开模态框
		setCurrentStep(-1);
	};

	// 处理Continue按钮点击
	const handleContinueClick = () => {
		// 将当前步骤状态设置为running
		const updatedSteps = updateStepStatus(currentStep, 'running');
		setPipelineSteps(updatedSteps);
		setStepStatus('process');
		setIsModalVisible(false);
		// 显示pipeline details
		setShowPipelineDetails(true);
		// 重置当前步骤状态，确保下次点击同一步骤时能再次打开模态框
		// setCurrentStep(-1);
	};

	// 关闭模态框
	const handleModalCancel = () => {
		setIsModalVisible(false);
		// 不显示pipeline details
		setShowPipelineDetails(false);
		// 重置当前步骤状态，确保下次点击同一步骤时能再次打开模态框
		setCurrentStep(-1);
	};

	// 更新当前步骤详情
	useEffect(() => {
		setStepDetails(getStepDetails(currentStep));
	}, [currentStep, t]);

	return (
		<BasicContent>
			{/* 步骤操作模态框 */}
			<Modal
				title={modalTitle}
				open={isModalVisible}
				onCancel={handleModalCancel}
				footer={null}
				width={600}
				centered
				className={classes.stepModal}
			>
				<div className={classes.modalContent}>
					<Form layout="vertical" className={classes.formContainer}>
						<Form.Item label="Schedule Start Date Time" name="startDateTime">
							<DatePicker showTime style={{ width: '100%' }} />
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
							<Button onClick={handlePendingClick} className={classes.pendingButton}>
								{t('pipeline.detail.status.pending')}
							</Button>
							<Button type="primary" onClick={handleContinueClick}>
								{t('pipeline.detail.status.continue')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="loading-spinner"></div>
				</div>
			) : (
				<>
					<div className="mb-4 flex justify-between items-center">
						<Title level={4}>
							{t("pipeline.detail.pipelineDetail")}
						</Title>
						<Button
							icon={<ArrowLeftOutlined />}
							type="link"
							onClick={() => navigate("/release/pipeline")}
						>
							{t("pipeline.detail.backToList")}
						</Button>
					</div>

					{apiDetail && (
						<>
							<Card title={t("pipeline.detail.apiInfo")} className="mb-4">
								<Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
									<Descriptions.Item label={t("pipeline.detail.apiName")}>
										{apiDetail.apiName}
									</Descriptions.Item>
									<Descriptions.Item label={t("pipeline.detail.apiVersion")}>
										{apiDetail.apiVersion}
									</Descriptions.Item>
									<Descriptions.Item label={t("pipeline.detail.stage")}>
										{(() => {
											let color = "blue";
											let stageText = apiDetail.stage;

											switch (apiDetail.stage) {
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
													stageText = apiDetail.stage;
											}

											return <Tag color={color}>{stageText}</Tag>;
										})()}
									</Descriptions.Item>
									<Descriptions.Item label={t("pipeline.detail.statusLabel")}>
										<Tag color={apiDetail.status === 1 ? "success" : "default"}>
											{apiDetail.status === 1 ? t("pipeline.detail.active") : t("pipeline.detail.inactive")}
										</Tag>
									</Descriptions.Item>
									<Descriptions.Item label={t("pipeline.detail.creator")}>
										{apiDetail.creator}
									</Descriptions.Item>
									<Descriptions.Item label={t("pipeline.detail.createdDate")}>
										{apiDetail.createdDate}
									</Descriptions.Item>
									<Descriptions.Item label={t("pipeline.detail.branch")}>
										{apiDetail.branch}
									</Descriptions.Item>
									<Descriptions.Item label={t("pipeline.detail.jiraId")}>
										{apiDetail.jiraId}
									</Descriptions.Item>
								</Descriptions>
							</Card>

							<Card title={t("pipeline.detail.pipelineProgress")} className="mb-4">
								{/* 状态图例 - 放在进度条上方 */}
								<div className={classes.statusLegendSmall}>
									<div className={classes.legendItemSmall}>
										<div className={`${classes.stepIconSmall} ${classes.pendingIcon}`}></div>
										<span>{t('pipeline.detail.status.pending')}</span>
									</div>
									<div className={classes.legendItemSmall}>
										<div className={`${classes.stepIconSmall} ${classes.runningIcon}`}></div>
										<span>{t('pipeline.detail.status.running')}</span>
									</div>
									<div className={classes.legendItemSmall}>
										<div className={`${classes.stepIconSmall} ${classes.completedIcon}`}></div>
										<span>{t('pipeline.detail.status.completed')}</span>
									</div>
									<div className={classes.legendItemSmall}>
										<div className={`${classes.stepIconSmall} ${classes.failedIcon}`}></div>
										<span>{t('pipeline.detail.status.failed')}</span>
									</div>
									<div className={classes.legendItemSmall}>
										<div className={`${classes.stepIconSmall} ${classes.canceledIcon}`}></div>
										<span>{t('pipeline.detail.status.canceled')}</span>
									</div>
									<div className={classes.legendItemSmall}>
										<div className={`${classes.stepIconSmall} ${classes.skippedIcon}`}></div>
										<span>{t('pipeline.detail.status.skipped')}</span>
									</div>
								</div>

								<div className={classes.stepsWrapper} ref={stepsContainerRef}>
									<div className={classes.stepsContainer}>
										<Steps
											current={currentStep}
											items={pipelineSteps}
											direction="horizontal"
											labelPlacement="vertical"
											onChange={handleStepClick}
											status={isStepLoading ? 'process' : stepStatus}
										/>
									</div>
								</div>
							</Card>

							{showPipelineDetails && (
								<Card title={t("pipeline.detail.pipelineDetails")}>
									<div className={classes.stepDetails}>
										<div className={classes.stepTitle}>
											{pipelineSteps[currentStep]?.icon}
											<Text strong>{pipelineSteps[currentStep]?.title}</Text>
										</div>
										<Divider />
										<div>
											{isStepLoading ? (
												<div className="flex justify-center items-center py-4">
													<Spin />
												</div>
											) : (
												<p>{stepDetails || t("pipeline.detail.stepDetails")}</p>
											)}
										</div>
									</div>
								</Card>
							)}
						</>
					)}
				</>
			)}
		</BasicContent>
	);
}
