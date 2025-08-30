import type { ApiItemType } from "../index";
import { fetchApiDetail } from "#src/api/release";

import { BasicContent } from "#src/components";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Divider, Spin, Steps, Tag, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router";

// 导入不同步骤的模态框组件
import {
	CompletedModal,
	CteDeploymentModal,
	DefaultModal,
	DevDeploymentModal,
	PrepareFinalCRModal,
	ProductionDeploymentModal,
	ReleaseSignoffModal,
	SitEnvironmentModal,
	StartModal,
	StaticScanningModal,
} from "./modals";
import { useStyles } from "./style";

const { Title, Text } = Typography;

// 步骤状态类型
type StepStatusType = "pending" | "running" | "completed" | "failed" | "canceled" | "skipped";

// 步骤属性类型
interface StepProps {
	"title": string
	"description": string
	"customStatus": StepStatusType
	"status": "wait" | "process" | "finish" | "error"
	"icon": React.ReactNode
	// 添加data属性用于存储自定义状态
	"data-custom-status"?: StepStatusType
	// 添加jobList属性
	"jobList"?: JobItem[]
	// 添加modelType属性用于确定显示哪种模态框
	"modelType"?: "start" | "staticScanning" | "devDeployment" | "sitEnvironment" | "releaseSignoff" | "cteDeployment" | "prepareFinalCR" | "productionDeployment" | "completed" | "default"
}

// Job项类型
interface JobItem {
	id: string
	name: string
	status: "pending" | "running" | "completed" | "failed"
	startTime: string
	endTime?: string
	logs?: string[]
}

// 自定义图标组件
function CustomStepIcon({ status }: { status: StepStatusType }) {
	const classes = useStyles();
	let iconClass = "";
	let content = "";

	switch (status) {
		case "pending":
			iconClass = classes.pendingIcon;
			// 使用空内容，让背景色显示为圆点
			content = "";
			break;
		case "running":
			iconClass = classes.runningIcon;
			// 使用空内容，让背景色显示为圆点
			content = "";
			break;
		case "completed":
			iconClass = classes.completedIcon;
			// 使用空内容，让背景色显示为圆点
			content = "";
			break;
		case "failed":
			iconClass = classes.failedIcon;
			// 使用空内容，让背景色显示为圆点
			content = "";
			break;
		case "canceled":
			iconClass = classes.canceledIcon;
			// 使用空内容，让背景色显示为圆点
			content = "";
			break;
		case "skipped":
			iconClass = classes.skippedIcon;
			// 使用空内容，让背景色显示为圆点
			content = "";
			break;
		default:
			iconClass = classes.pendingIcon;
			// 使用空内容，让背景色显示为圆点
			content = "";
	}

	return (
		<div className={`${classes.stepIcon} ${iconClass}`}>
			{content}
		</div>
	);
}

export default function PipelineDetail() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [apiDetail, setApiDetail] = useState<ApiItemType | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [currentStep, setCurrentStep] = useState<number>(3); // 当前步骤
	const [stepStatus, setStepStatus] = useState<"process" | "wait" | "finish" | "error">("process"); // 当前步骤状态
	const [isStepLoading, setIsStepLoading] = useState<boolean>(false); // 步骤加载状态
	const [stepDetails, setStepDetails] = useState<string>(""); // 步骤详情
	// 模态框标题已集成到modalState中
	const [currentJobs, setCurrentJobs] = useState<JobItem[]>([]); // 当前步骤的任务列表
	// 以下状态变量在当前实现中不再使用，因为每个任务都有独立的日志显示
	// const [selectedJob, setSelectedJob] = useState<string>(""); // 选中的任务ID
	// const [jobLogs, setJobLogs] = useState<string>(""); // 任务日志
	// const [showJobLogs, setShowJobLogs] = useState<boolean>(false); // 控制任务日志的显示
	const stepsContainerRef = useRef<HTMLDivElement>(null);
	const classes = useStyles();

	// 步骤状态管理
	const [pipelineSteps, setPipelineSteps] = useState<StepProps[]>([]);

	// 统一的模态框状态管理
	const [modalState, setModalState] = useState<{
		visibleType: string | null
		title: string
	}>({ visibleType: null, title: "" });

	// 控制pipeline details的显示
	const [showPipelineDetails, setShowPipelineDetails] = useState<boolean>(false);

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
		if (!stepInfo)
			return "";

		switch (stepInfo.customStatus) {
			case "running":
				return t("pipeline.detail.steps.runningDescription");
			case "completed":
				return t("pipeline.detail.steps.completedDescription");
			case "failed":
				return t("pipeline.detail.steps.failedDescription");
			case "pending":
				return t("pipeline.detail.steps.pendingDescription");
			case "canceled":
				return t("pipeline.detail.steps.canceledDescription");
			case "skipped":
				return t("pipeline.detail.steps.skippedDescription");
			default:
				return t("pipeline.detail.stepDetails");
		}
	};

	// 将自定义状态映射到 Ant Design Steps 组件的状态
	const mapCustomStatusToAntd = (customStatus: StepStatusType): "wait" | "process" | "finish" | "error" => {
		switch (customStatus) {
			case "pending":
				return "wait";
			case "running":
				return "process";
			case "completed":
				return "finish";
			case "failed":
				return "error";
			case "canceled":
				return "wait";
			case "skipped":
				return "wait";
			default:
				return "wait";
		}
	};

	// 更新步骤状态
	const updateStepStatus = (stepIndex: number, newStatus: StepStatusType) => {
		const updatedSteps = [...pipelineSteps];
		if (updatedSteps[stepIndex]) {
			updatedSteps[stepIndex].customStatus = newStatus;
			updatedSteps[stepIndex].status = mapCustomStatusToAntd(newStatus);
			updatedSteps[stepIndex].icon = <CustomStepIcon status={newStatus} />;
			updatedSteps[stepIndex]["data-custom-status"] = newStatus;
		}
		return updatedSteps;
	};

	// 切换步骤状态 - 模拟不同状态之间的切换
	const _toggleStepStatus = (stepIndex: number) => {
		const updatedSteps = [...pipelineSteps];
		if (updatedSteps[stepIndex]) {
			// 获取当前状态
			const currentStatus = updatedSteps[stepIndex].customStatus;

			// 定义状态切换顺序 - 根据第二张图片中的状态顺序
			let newStatus: StepStatusType = "pending";
			switch (currentStatus) {
				case "pending":
					newStatus = "running";
					break;
				case "running":
					newStatus = "completed";
					break;
				case "completed":
					newStatus = "failed";
					break;
				case "failed":
					newStatus = "canceled";
					break;
				case "canceled":
					newStatus = "skipped";
					break;
				case "skipped":
					newStatus = "pending";
					break;
				default:
					newStatus = "pending";
			}

			// 更新步骤状态
			updatedSteps[stepIndex].customStatus = newStatus;
			updatedSteps[stepIndex].status = mapCustomStatusToAntd(newStatus);
			updatedSteps[stepIndex].icon = <CustomStepIcon status={newStatus} />;
			updatedSteps[stepIndex]["data-custom-status"] = newStatus;

			// 更新步骤数组
			setPipelineSteps(updatedSteps);

			// 更新全局步骤状态
			if (newStatus === "failed") {
				setStepStatus("error");
			}
			else if (newStatus === "running") {
				setStepStatus("process");
			}
			else if (newStatus === "completed") {
				setStepStatus("finish");
			}
			else if (newStatus === "canceled" || newStatus === "skipped") {
				setStepStatus("wait");
			}
		}
	};

	// 模态框策略对象 - 统一管理模态框的展示和关闭
	const modalStrategy = {
		// 显示指定类型的模态框
		show: (type: string, title: string = "") => {
			// 关闭pipeline details
			setShowPipelineDetails(false);
			// 设置当前显示的模态框类型和标题
			setModalState({ visibleType: type, title });
		},

		// 关闭所有模态框
		closeAll: () => {
			setModalState({ visibleType: null, title: "" });
			setShowPipelineDetails(false);
		},

		// 显示pipeline details
		showDetails: (title: string = "") => {
			setModalState({ visibleType: null, title });
			setShowPipelineDetails(true);
		},

		// 检查指定类型的模态框是否显示
		isVisible: (type: string): boolean => {
			return modalState.visibleType === type;
		},
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

			// 获取当前步骤的标题
			const title = pipelineSteps[current]?.title || "";

			// 关闭所有模态框
			modalStrategy.closeAll();

			// 加载当前步骤的任务列表
			if (pipelineSteps[current]?.jobList) {
				setCurrentJobs(pipelineSteps[current].jobList);
			}
			else {
				// 没有任务列表时重置状态
				setCurrentJobs([]);
			}

			// 获取当前步骤的modelType
			const modelType = pipelineSteps[current]?.modelType;

			// 使用策略模式显示模态框或pipeline details
			if (modelType) {
				// 如果有modelType，则显示对应的模态框
				modalStrategy.show(modelType, title);
			}
			else if (current <= 2) {
				// 前三个步骤默认显示pipeline details
				modalStrategy.showDetails();
			}
			else {
				// 其他情况显示默认模态框
				modalStrategy.show("default", title);
			}

			setIsStepLoading(false);
		}, 500);
	};

	// 生成模拟日志
	const generateMockLogs = (jobName: string, status: string): string[] => {
		// 创建格式化的时间戳函数
		const timestamp = () => {
			const now = new Date();
			const hours = now.getHours().toString().padStart(2, "0");
			const minutes = now.getMinutes().toString().padStart(2, "0");
			const seconds = now.getSeconds().toString().padStart(2, "0");
			const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
			return `${hours}:${minutes}:${seconds}.${milliseconds}`;
		};

		// 创建随机延迟函数
		const randomDelay = () => {
			const baseDate = new Date();
			baseDate.setSeconds(baseDate.getSeconds() - Math.floor(Math.random() * 60));
			return baseDate;
		};

		// 生成随机构造ID
		const buildId = Math.floor(10000 + Math.random() * 90000);
		const commitId = Array.from({ length: 8 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");

		// 开始构建Jenkins风格的日志 - 使用数组存储每行日志
		const logs: string[] = [];
		logs.push("+------------------------------------------+");
		logs.push("|               Jenkins Build               |");
		logs.push("+------------------------------------------+");
		logs.push(`| Job Name: ${jobName.padEnd(32)} |`);
		logs.push(`| Build ID: #${buildId.toString().padEnd(31)} |`);
		logs.push(`| Status: ${status.toUpperCase().padEnd(33)} |`);
		logs.push("+------------------------------------------+");

		// 添加构建初始化信息 - 添加到日志数组
		logs.push(`[${timestamp()}] Started by user admin`);
		logs.push(`[${timestamp()}] Running in Durability level: MAX_SURVIVABILITY`);
		logs.push(`[${timestamp()}] [Pipeline] Start of Pipeline`);
		logs.push(`[${timestamp()}] [Pipeline] node`);
		logs.push(`[${timestamp()}] Running on Jenkins in /var/jenkins_home/workspace/${jobName.replace(/ /g, "_")}`);
		logs.push(`[${timestamp()}] [Pipeline] { (Checkout)`);
		logs.push(`[${timestamp()}] [Pipeline] checkout`);
		logs.push(`[${timestamp()}] using credential github-token`);
		logs.push(`[${timestamp()}] Cloning repository https://github.com/company/project.git`);
		logs.push(`[${timestamp()}] > git init /var/jenkins_home/workspace/${jobName.replace(/ /g, "_")}`);
		logs.push(`[${timestamp()}] > git checkout -b main ${commitId}`);
		logs.push(`[${timestamp()}] [Pipeline] }`);

		// 根据不同的任务添加特定日志 - 添加到日志数组
		if (jobName.includes("构建") || jobName.includes("Build")) {
			logs.push(`[${timestamp()}] [Pipeline] { (Build)`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + npm ci`);
			logs.push(`[${timestamp()}] added 1232 packages in 25s`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + npm run lint`);
			logs.push(`[${timestamp()}] > project@1.0.0 lint`);
			logs.push(`[${timestamp()}] > eslint . --ext .js,.jsx,.ts,.tsx`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + npm run build`);
			logs.push(`[${timestamp()}] > project@1.0.0 build`);
			logs.push(`[${timestamp()}] > react-scripts build`);
			logs.push(`[${timestamp()}] Creating an optimized production build...`);
			logs.push(`[${timestamp()}] Compiled successfully.`);
			logs.push(`[${timestamp()}] File sizes after gzip:`);
			logs.push(`[${timestamp()}]   126.45 KB  build/static/js/main.${commitId.substring(0, 6)}.js`);
			logs.push(`[${timestamp()}]   24.33 KB   build/static/css/main.${commitId.substring(0, 6)}.css`);
			logs.push(`[${timestamp()}]   1.23 KB    build/static/js/runtime-main.${commitId.substring(0, 6)}.js`);
			logs.push(`[${timestamp()}] The project was built assuming it is hosted at /.`);
			logs.push(`[${timestamp()}] [Pipeline] }`);
		}
		else if (jobName.includes("测试") || jobName.includes("Test")) {
			logs.push(`[${timestamp()}] [Pipeline] { (Test)`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + npm test -- --coverage`);
			logs.push(`[${timestamp()}] > project@1.0.0 test`);
			logs.push(`[${timestamp()}] > react-scripts test --coverage`);
			logs.push(`[${timestamp()}] PASS src/components/__tests__/Button.test.tsx`);
			logs.push(`[${timestamp()}] PASS src/utils/__tests__/format.test.ts`);
			logs.push(`[${timestamp()}] PASS src/hooks/__tests__/useAuth.test.ts`);
			logs.push(`[${timestamp()}] ------------------|---------|----------|---------|---------|-------------------`);
			logs.push(`[${timestamp()}] File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s `);
			logs.push(`[${timestamp()}] ------------------|---------|----------|---------|---------|-------------------`);
			logs.push(`[${timestamp()}] All files          |   85.71 |    76.92 |   84.21 |   85.45 |                   `);
			logs.push(`[${timestamp()}]  src/components    |   92.31 |    83.33 |   88.89 |   92.00 |                   `);
			logs.push(`[${timestamp()}]  src/utils         |   79.17 |    70.00 |   77.78 |   78.95 | 25,43-48          `);
			logs.push(`[${timestamp()}]  src/hooks         |   85.71 |    77.78 |   85.71 |   85.29 | 32,67-68          `);
			logs.push(`[${timestamp()}] ------------------|---------|----------|---------|---------|-------------------`);
			logs.push(`[${timestamp()}] Test Suites: 3 passed, 3 total`);
			logs.push(`[${timestamp()}] Tests:       18 passed, 18 total`);
			logs.push(`[${timestamp()}] Snapshots:   0 total`);
			logs.push(`[${timestamp()}] Time:        5.28s`);
			logs.push(`[${timestamp()}] [Pipeline] }`);
		}
		else if (jobName.includes("部署") || jobName.includes("Deploy")) {
			logs.push(`[${timestamp()}] [Pipeline] { (Deploy)`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + docker build -t project:${buildId} .`);
			logs.push(`[${timestamp()}] Step 1/12 : FROM node:16-alpine AS builder`);
			logs.push(`[${timestamp()}]  ---> 5c43e435cc11`);
			logs.push(`[${timestamp()}] Step 2/12 : WORKDIR /app`);
			logs.push(`[${timestamp()}]  ---> Using cache`);
			logs.push(`[${timestamp()}]  ---> 9a56b8da441e`);
			logs.push(`[${timestamp()}] Step 3/12 : COPY package*.json ./`);
			logs.push(`[${timestamp()}]  ---> Using cache`);
			logs.push(`[${timestamp()}]  ---> 7c3ed8cb8972`);
			logs.push(`[${timestamp()}] Step 4/12 : RUN npm ci`);
			logs.push(`[${timestamp()}]  ---> Using cache`);
			logs.push(`[${timestamp()}]  ---> 3a9e8a5e1234`);
			logs.push(`[${timestamp()}] Step 5/12 : COPY . .`);
			logs.push(`[${timestamp()}]  ---> 8c7d9a5e1234`);
			logs.push(`[${timestamp()}] Step 6/12 : RUN npm run build`);
			logs.push(`[${timestamp()}]  ---> Running in 7c3ed8cb8972`);
			logs.push(`[${timestamp()}] > project@1.0.0 build`);
			logs.push(`[${timestamp()}] > react-scripts build`);
			logs.push(`[${timestamp()}] Creating an optimized production build...`);
			logs.push(`[${timestamp()}] Compiled successfully.`);
			logs.push(`[${timestamp()}]  ---> 9a56b8da441e`);
			logs.push(`[${timestamp()}] Step 7/12 : FROM nginx:alpine`);
			logs.push(`[${timestamp()}]  ---> 5c43e435cc11`);
			logs.push(`[${timestamp()}] Step 8/12 : COPY --from=builder /app/build /usr/share/nginx/html`);
			logs.push(`[${timestamp()}]  ---> Using cache`);
			logs.push(`[${timestamp()}]  ---> 7c3ed8cb8972`);
			logs.push(`[${timestamp()}] Step 9/12 : EXPOSE 80`);
			logs.push(`[${timestamp()}]  ---> Using cache`);
			logs.push(`[${timestamp()}]  ---> 3a9e8a5e1234`);
			logs.push(`[${timestamp()}] Step 10/12 : CMD ["nginx", "-g", "daemon off;"]`);
			logs.push(`[${timestamp()}]  ---> Using cache`);
			logs.push(`[${timestamp()}]  ---> 8c7d9a5e1234`);
			logs.push(`[${timestamp()}] Successfully built 8c7d9a5e1234`);
			logs.push(`[${timestamp()}] Successfully tagged project:${buildId}`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + kubectl set image deployment/project project=project:${buildId}`);
			logs.push(`[${timestamp()}] deployment.apps/project image updated`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + kubectl rollout status deployment/project`);
			logs.push(`[${timestamp()}] Waiting for deployment "project" rollout to finish: 1 old replicas are pending termination...`);
			logs.push(`[${timestamp()}] Waiting for deployment "project" rollout to finish: 1 old replicas are pending termination...`);
			logs.push(`[${timestamp()}] deployment "project" successfully rolled out`);
			logs.push(`[${timestamp()}] [Pipeline] }`);
		}
		else {
			logs.push(`[${timestamp()}] [Pipeline] { (Execute)`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + echo "Executing ${jobName}"`);
			logs.push(`[${timestamp()}] Executing ${jobName}`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + npm run script`);
			logs.push(`[${timestamp()}] > project@1.0.0 script`);
			logs.push(`[${timestamp()}] > node scripts/execute.js`);
			logs.push(`[${timestamp()}] Script execution started...`);
			logs.push(`[${timestamp()}] Processing data...`);
			logs.push(`[${timestamp()}] Script completed successfully`);
			logs.push(`[${timestamp()}] [Pipeline] }`);
		}

		// 添加结果日志
		if (status === "completed") {
			logs.push(`[${timestamp()}] [Pipeline] { (Finalize)`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + echo "Build successful"`);
			logs.push(`[${timestamp()}] Build successful`);
			logs.push(`[${timestamp()}] [Pipeline] }`);
			logs.push(`[${timestamp()}] [Pipeline] // node`);
			logs.push(`[${timestamp()}] [Pipeline] End of Pipeline`);
			logs.push(`[${timestamp()}] Finished: SUCCESS`);
			logs.push("+------------------------------------------+");
			logs.push("|             BUILD SUCCESS              |");
			logs.push("+------------------------------------------+");
			logs.push(`| Total time: ${Math.floor(30 + Math.random() * 120)}s                       |`);
			logs.push("+------------------------------------------+");
		}
		else if (status === "failed") {
			logs.push(`[${timestamp()}] [Pipeline] { (Error)`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + exit 1`);
			logs.push(`[${timestamp()}] [Pipeline] }`);
			logs.push(`[${timestamp()}] [Pipeline] // node`);
			logs.push(`[${timestamp()}] [Pipeline] End of Pipeline`);
			logs.push(`[${timestamp()}] ERROR: script returned exit code 1`);
			logs.push(`[${timestamp()}] Finished: FAILURE`);
			logs.push("+------------------------------------------+");
			logs.push("|             BUILD FAILED               |");
			logs.push("+------------------------------------------+");
			logs.push("| Error: Process exited with code 1      |");
			logs.push(`| Total time: ${Math.floor(15 + Math.random() * 45)}s                       |`);
			logs.push("+------------------------------------------+");
		}
		else if (status === "running") {
			logs.push(`[${timestamp()}] [Pipeline] { (In Progress)`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + echo "Build in progress..."`);
			logs.push(`[${timestamp()}] Build in progress...`);
			logs.push(`[${timestamp()}] [Pipeline] sh`);
			logs.push(`[${timestamp()}] + sleep 10`);
		}

		// 添加更多随机日志行以达到约500行
		const logTypes = [
			"[INFO] Processing file {0}.js",
			"[DEBUG] Variable {0} = {1}",
			"[TRACE] Function {0} called with params ({1})",
			"[INFO] Loaded module {0} in {1}ms",
			"[DEBUG] Cache hit ratio: {0}%",
			"[INFO] API request to {0} completed in {1}ms",
			"[DEBUG] Memory usage: {0}MB",
			"[TRACE] Event {0} triggered",
			"[INFO] Thread {0} started",
			"[DEBUG] Connection pool: {0} active, {1} idle",
		];

		const fileNames = ["main", "utils", "helpers", "components", "services", "models", "controllers", "views", "middleware", "config"];
		const functionNames = ["initialize", "process", "transform", "validate", "calculate", "render", "update", "create", "delete", "fetch"];
		const moduleNames = ["react", "redux", "axios", "lodash", "moment", "express", "webpack", "babel", "typescript", "jest"];
		const apiEndpoints = ["/api/users", "/api/products", "/api/orders", "/api/auth", "/api/settings"];
		const eventNames = ["click", "load", "change", "submit", "resize", "scroll", "connect", "disconnect", "error", "success"];

		const getRandomItem = (array: string[]) => array[Math.floor(Math.random() * array.length)];
		const getRandomNumber = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));

		for (let i = 0; i < 350; i++) {
			const logTemplate = getRandomItem(logTypes);
			let logMessage = logTemplate;

			// 替换占位符
			if (logTemplate.includes("{0}")) {
				if (logTemplate.includes("file")) {
					logMessage = logMessage.replace("{0}", getRandomItem(fileNames));
				}
				else if (logTemplate.includes("Variable")) {
					logMessage = logMessage.replace("{0}", `var_${getRandomNumber(1, 100)}`);
					logMessage = logMessage.replace("{1}", `${getRandomNumber(0, 1000)}`);
				}
				else if (logTemplate.includes("Function")) {
					logMessage = logMessage.replace("{0}", getRandomItem(functionNames));
					logMessage = logMessage.replace("{1}", `id=${getRandomNumber(1, 1000)}, type='${getRandomItem(["user", "product", "order", "payment"])}'`);
				}
				else if (logTemplate.includes("module")) {
					logMessage = logMessage.replace("{0}", getRandomItem(moduleNames));
					logMessage = logMessage.replace("{1}", `${getRandomNumber(10, 500)}`);
				}
				else if (logTemplate.includes("Cache")) {
					logMessage = logMessage.replace("{0}", `${getRandomNumber(50, 99)}`);
				}
				else if (logTemplate.includes("API")) {
					logMessage = logMessage.replace("{0}", getRandomItem(apiEndpoints));
					logMessage = logMessage.replace("{1}", `${getRandomNumber(50, 2000)}`);
				}
				else if (logTemplate.includes("Memory")) {
					logMessage = logMessage.replace("{0}", `${getRandomNumber(100, 1024)}`);
				}
				else if (logTemplate.includes("Event")) {
					logMessage = logMessage.replace("{0}", getRandomItem(eventNames));
				}
				else if (logTemplate.includes("Thread")) {
					logMessage = logMessage.replace("{0}", `worker-${getRandomNumber(1, 10)}`);
				}
				else if (logTemplate.includes("Connection")) {
					logMessage = logMessage.replace("{0}", `${getRandomNumber(1, 20)}`);
					logMessage = logMessage.replace("{1}", `${getRandomNumber(5, 50)}`);
				}
			}

			// 添加带有随机延迟的时间戳
			const delayedDate = randomDelay();
			const hours = delayedDate.getHours().toString().padStart(2, "0");
			const minutes = delayedDate.getMinutes().toString().padStart(2, "0");
			const seconds = delayedDate.getSeconds().toString().padStart(2, "0");
			const milliseconds = delayedDate.getMilliseconds().toString().padStart(3, "0");
			const logTimestamp = `${hours}:${minutes}:${seconds}.${milliseconds}`;

			logs.push(`[${logTimestamp}] ${logMessage}`);
		}

		return logs;
	};

	// 模拟步骤状态变化
	const simulateStepStatusChange = () => {
		// 模拟不同步骤的不同状态 - 这里可以根据实际API返回的状态来设置
		const _statusMap: StepStatusType[] = ["completed", "running", "pending", "pending", "pending", "pending", "pending", "pending", "pending"];

		// 创建新的步骤数组 - 根据第一张图片中的流水线步骤
		const updatedSteps: StepProps[] = [
			{
				"title": t("pipeline.detail.steps.start"),
				"description": "",
				"customStatus": "completed" as StepStatusType,
				"status": mapCustomStatusToAntd("completed"),
				"icon": <CustomStepIcon status="completed" />,
				"data-custom-status": "completed",
				"modelType": "start", // 添加modelType属性
				"jobList": [
					{
						id: "job-start-1",
						name: "初始化项目",
						status: "completed",
						startTime: "2023-06-01 09:00:00",
						endTime: "2023-06-01 09:05:00",
						logs: generateMockLogs("初始化项目", "completed"),
					},
					{
						id: "job-start-2",
						name: "配置环境",
						status: "completed",
						startTime: "2023-06-01 09:05:00",
						endTime: "2023-06-01 09:10:00",
						logs: generateMockLogs("配置环境", "completed"),
					},
				],
			},
			{
				"title": t("pipeline.detail.steps.staticScanning"),
				"description": "",
				"customStatus": "running" as StepStatusType,
				"status": mapCustomStatusToAntd("running"),
				"icon": <CustomStepIcon status="running" />,
				"data-custom-status": "running",
				"modelType": "staticScanning", // 添加modelType属性
				"jobList": [
					{
						id: "job-scan-1",
						name: "代码扫描",
						status: "completed",
						startTime: "2023-06-01 10:00:00",
						endTime: "2023-06-01 10:15:00",
						logs: generateMockLogs("代码扫描", "completed"),
					},
					{
						id: "job-scan-2",
						name: "安全检查",
						status: "running",
						startTime: "2023-06-01 10:15:00",
						logs: generateMockLogs("安全检查", "running"),
					},
				],
			},
			{
				"title": t("pipeline.detail.steps.devDeployment"),
				"description": "",
				"customStatus": "pending" as StepStatusType,
				"status": mapCustomStatusToAntd("pending"),
				"icon": <CustomStepIcon status="pending" />,
				"data-custom-status": "pending",
				"modelType": "devDeployment", // 添加modelType属性
				"jobList": [
					{
						id: "job-dev-1",
						name: "构建开发包",
						status: "pending",
						startTime: "",
						logs: [],
					},
					{
						id: "job-dev-2",
						name: "部署到开发环境",
						status: "pending",
						startTime: "",
						logs: [],
					},
				],
			},
			{
				"title": t("pipeline.detail.steps.sitEnvironment"),
				"description": "",
				"customStatus": "pending" as StepStatusType,
				"status": mapCustomStatusToAntd("pending"),
				"icon": <CustomStepIcon status="pending" />,
				"data-custom-status": "pending",
				"modelType": "sitEnvironment", // 添加modelType属性
				"jobList": [
					{
						id: "job-sit-1",
						name: "构建测试包",
						status: "pending",
						startTime: "",
						logs: [],
					},
					{
						id: "job-sit-2",
						name: "部署到测试环境",
						status: "pending",
						startTime: "",
						logs: [],
					},
				],
			},
			{
				"title": t("pipeline.detail.steps.releaseSignoff"),
				"description": "",
				"customStatus": "pending" as StepStatusType,
				"status": mapCustomStatusToAntd("pending"),
				"icon": <CustomStepIcon status="pending" />,
				"data-custom-status": "pending",
				"modelType": "releaseSignoff", // 添加modelType属性
				"jobList": [
					{
						id: "job-signoff-1",
						name: "准备发布文档",
						status: "pending",
						startTime: "",
						logs: [],
					},
					{
						id: "job-signoff-2",
						name: "获取发布批准",
						status: "pending",
						startTime: "",
						logs: [],
					},
				],
			},
			{
				"title": t("pipeline.detail.steps.cteDeployment"),
				"description": "",
				"customStatus": "pending" as StepStatusType,
				"status": mapCustomStatusToAntd("pending"),
				"icon": <CustomStepIcon status="pending" />,
				"data-custom-status": "pending",
				"modelType": "cteDeployment", // 添加modelType属性
				"jobList": [
					{
						id: "job-cte-1",
						name: "构建CTE包",
						status: "pending",
						startTime: "",
						logs: [],
					},
					{
						id: "job-cte-2",
						name: "部署到CTE环境",
						status: "pending",
						startTime: "",
						logs: [],
					},
				],
			},
			{
				"title": t("pipeline.detail.steps.prepareFinalCR"),
				"description": "",
				"customStatus": "pending" as StepStatusType,
				"status": mapCustomStatusToAntd("pending"),
				"icon": <CustomStepIcon status="pending" />,
				"data-custom-status": "pending",
				"modelType": "prepareFinalCR", // 添加modelType属性
				"jobList": [
					{
						id: "job-cr-1",
						name: "准备CR文档",
						status: "pending",
						startTime: "",
						logs: [],
					},
					{
						id: "job-cr-2",
						name: "CR审核",
						status: "pending",
						startTime: "",
						logs: [],
					},
				],
			},
			{
				"title": t("pipeline.detail.steps.productionDeployment"),
				"description": "",
				"customStatus": "pending" as StepStatusType,
				"status": mapCustomStatusToAntd("pending"),
				"icon": <CustomStepIcon status="pending" />,
				"data-custom-status": "pending",
				"modelType": "productionDeployment", // 添加modelType属性
				"jobList": [
					{
						id: "job-prod-1",
						name: "构建生产包",
						status: "pending",
						startTime: "",
						logs: [],
					},
					{
						id: "job-prod-2",
						name: "部署到生产环境",
						status: "pending",
						startTime: "",
						logs: [],
					},
				],
			},
			{
				"title": t("pipeline.detail.steps.completed"),
				"description": "",
				"customStatus": "pending" as StepStatusType,
				"status": mapCustomStatusToAntd("pending"),
				"icon": <CustomStepIcon status="pending" />,
				"data-custom-status": "pending",
				"modelType": "completed", // 添加modelType属性
				"jobList": [
					{
						id: "job-complete-1",
						name: "完成部署",
						status: "pending",
						startTime: "",
						logs: [],
					},
					{
						id: "job-complete-2",
						name: "发布通知",
						status: "pending",
						startTime: "",
						logs: [],
					},
				],
			},
		];

		return updatedSteps;
	};

	// 初始化步骤状态
	useEffect(() => {
		// 模拟步骤状态变化
		const updatedSteps = simulateStepStatusChange();
		setPipelineSteps(updatedSteps);

		// 找到Running状态的步骤并自动显示其详情
		const runningStepIndex = updatedSteps.findIndex(step => step.customStatus === "running");
		if (runningStepIndex !== -1) {
			// 设置当前步骤为Running状态的步骤
			setCurrentStep(runningStepIndex);
			// 设置模态框标题并显示pipeline details
			modalStrategy.showDetails(updatedSteps[runningStepIndex]?.title || "");
		}
	}, [t]);

	// 处理Pending按钮点击
	const handlePendingClick = () => {
		// 将当前步骤状态设置为pending
		const updatedSteps = updateStepStatus(currentStep, "pending");
		setPipelineSteps(updatedSteps);
		setStepStatus("wait");
		// 关闭所有模态框
		modalStrategy.closeAll();
		// 重置当前步骤状态，确保下次点击同一步骤时能再次打开模态框
		setCurrentStep(-1);
		// 重置任务列表
		setCurrentJobs([]);
	};

	// 处理任务点击 - 不再需要，因为每个任务都会独立显示日志
	// const handleJobClick = (jobId: string) => {
	// 	// 查找选中的任务
	// 	const job = currentJobs.find(job => job.id === jobId);
	// 	if (job) {
	// 		setSelectedJob(jobId);
	// 		setJobLogs(job.logs || []);
	// 		setShowJobLogs(job.status === "completed" || job.status === "running");
	// 	}
	// };

	// 处理刷新任务日志
	const handleRefreshJobLogs = (jobId: string) => {
		// 查找要刷新的任务
		const jobIndex = currentJobs.findIndex(job => job.id === jobId);
		if (jobIndex !== -1) {
			// 创建一个新的任务列表，以便React能检测到变化
			const updatedJobs = [...currentJobs];
			const job = updatedJobs[jobIndex];

			// 为选中的任务生成新的日志
			if (job.status === "completed" || job.status === "running" || job.status === "failed") {
				// 生成新的模拟日志
				updatedJobs[jobIndex].logs = generateMockLogs(job.name, job.status);

				// 更新状态
				setCurrentJobs(updatedJobs);

				// 显示成功消息
				window.$message?.success(`${t("pipeline.detail.jobLogs")} ${t("common.refreshSuccess")}`);
			}
		}
	};

	// 处理Continue按钮点击
	const handleContinueClick = () => {
		// 将当前步骤状态设置为running
		const updatedSteps = updateStepStatus(currentStep, "running");
		setPipelineSteps(updatedSteps);
		setStepStatus("process");
		// 关闭所有模态框并显示pipeline details
		modalStrategy.showDetails(updatedSteps[currentStep]?.title || "");
		// 重置当前步骤状态，确保下次点击同一步骤时能再次打开模态框
		// setCurrentStep(-1);
	};

	// 关闭模态框
	const handleModalCancel = () => {
		// 关闭所有模态框
		modalStrategy.closeAll();
		// 重置当前步骤状态，确保下次点击同一步骤时能再次打开模态框
		setCurrentStep(-1);
	};

	// 更新当前步骤详情
	useEffect(() => {
		setStepDetails(getStepDetails(currentStep));
	}, [currentStep, t]);

	return (
		<BasicContent>
			{/* 各步骤对应的模态框 */}
			<StartModal
				open={modalStrategy.isVisible("start")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<StaticScanningModal
				open={modalStrategy.isVisible("staticScanning")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<DevDeploymentModal
				open={modalStrategy.isVisible("devDeployment")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<SitEnvironmentModal
				open={modalStrategy.isVisible("sitEnvironment")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<ReleaseSignoffModal
				open={modalStrategy.isVisible("releaseSignoff")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<CteDeploymentModal
				open={modalStrategy.isVisible("cteDeployment")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<PrepareFinalCRModal
				open={modalStrategy.isVisible("prepareFinalCR")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<ProductionDeploymentModal
				open={modalStrategy.isVisible("productionDeployment")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<CompletedModal
				open={modalStrategy.isVisible("completed")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			<DefaultModal
				open={modalStrategy.isVisible("default")}
				title={modalState.title}
				onCancel={handleModalCancel}
				onPending={handlePendingClick}
				onContinue={handleContinueClick}
			/>

			{loading
				? (
					<div className="flex justify-center items-center h-64">
						<div className="loading-spinner"></div>
					</div>
				)
				: (
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
											<span>{t("pipeline.detail.status.pending")}</span>
										</div>
										<div className={classes.legendItemSmall}>
											<div className={`${classes.stepIconSmall} ${classes.runningIcon}`}></div>
											<span>{t("pipeline.detail.status.running")}</span>
										</div>
										<div className={classes.legendItemSmall}>
											<div className={`${classes.stepIconSmall} ${classes.completedIcon}`}></div>
											<span>{t("pipeline.detail.status.completed")}</span>
										</div>
										<div className={classes.legendItemSmall}>
											<div className={`${classes.stepIconSmall} ${classes.failedIcon}`}></div>
											<span>{t("pipeline.detail.status.failed")}</span>
										</div>
										<div className={classes.legendItemSmall}>
											<div className={`${classes.stepIconSmall} ${classes.canceledIcon}`}></div>
											<span>{t("pipeline.detail.status.canceled")}</span>
										</div>
										<div className={classes.legendItemSmall}>
											<div className={`${classes.stepIconSmall} ${classes.skippedIcon}`}></div>
											<span>{t("pipeline.detail.status.skipped")}</span>
										</div>
									</div>

									<div className={classes.stepsWrapper} ref={stepsContainerRef}>
										<div className={classes.stepsContainer}>
											<Steps
												current={currentStep}
												items={pipelineSteps.map((step) => {
													// 创建一个新对象，不包含customStatus属性
													const { customStatus, ...stepWithoutCustomStatus } = step;
													return stepWithoutCustomStatus;
												})}
												direction="horizontal"
												labelPlacement="vertical"
												onChange={handleStepClick}
												status={isStepLoading ? "process" : stepStatus}
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
												{isStepLoading
													? (
														<div className="flex justify-center items-center py-4">
															<Spin />
														</div>
													)
													: (
														<>
															<p>{stepDetails || t("pipeline.detail.stepDetails")}</p>

															{/* 任务列表 */}
															{currentJobs.length > 0 && (
																<div className="mt-4">
																	<Divider orientation="left">{t("pipeline.detail.jobList")}</Divider>
																	<div className="space-y-2">
																		{currentJobs.map(job => (
																			<div key={job.id} className="mb-4">
																				{/* Job Header */}
																				<div className="p-3 border rounded border-gray-200">
																					<div className="flex justify-between items-center">
																						<div className="flex items-center gap-2">
																							<div className="font-medium">{job.name}</div>
																							<Button
																								type="text"
																								size="small"
																								icon={<ReloadOutlined />}
																								onClick={() => handleRefreshJobLogs(job.id)}
																								title="刷新日志"
																							/>
																						</div>
																						<Tag color={job.status === "completed" ? "success" : job.status === "running" ? "processing" : job.status === "failed" ? "error" : "default"}>
																							{job.status}
																						</Tag>
																					</div>
																					<div className="text-sm text-gray-500 mt-2">
																						<div>
																							{t("pipeline.detail.startTime")}
																							:
																							{" "}
																							{job.startTime || "-"}
																						</div>
																						{job.endTime && (
																							<div>
																								{t("pipeline.detail.endTime")}
																								:
																								{" "}
																								{job.endTime}
																							</div>
																						)}
																					</div>
																				</div>

																				{/* Job Logs */}
																				{(job.status === "completed" || job.status === "running" || job.status === "failed") && job.logs && (
																					<div className="mt-2">
																						<div className={classes.logsContainer}>
																							<pre className={classes.logs}>
																								{job.logs.map((line, index) => {
																									// 生成一个更稳定的key，使用行内容的哈希值和索引
																									const lineKey = `${job.id}-${line.slice(0, 10)}-${index}`;

																									// 解析不同类型的日志行并添加适当的样式
																									if (line.includes("BUILD SUCCESS") || line.includes("Finished: SUCCESS")) {
																										return (
																											<span key={lineKey} className={classes.successLog}>
																												{line}
																											</span>
																										);
																									}
																									else if (line.includes("BUILD FAILED") || line.includes("Finished: FAILURE") || line.includes("ERROR:")) {
																										return (
																											<span key={lineKey} className={classes.errorLog}>
																												{line}
																											</span>
																										);
																									}
																									else if (line.match(/^\+-{2,}\+$/)) {
																										return (
																											<span key={lineKey} className={classes.headerLog}>
																												{line}
																											</span>
																										);
																									}
																									else if (line.includes("[Pipeline]")) {
																										return (
																											<span key={lineKey} className={classes.pipelineLog}>
																												{line}
																											</span>
																										);
																									}
																									else if (line.match(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] \+/)) {
																										return (
																											<span key={lineKey} className={classes.commandLog}>
																												{line}
																											</span>
																										);
																									}
																									else if (line.match(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] \[INFO\]/)) {
																										return (
																											<span key={lineKey} className={classes.infoLog}>
																												{line}
																											</span>
																										);
																									}
																									else if (line.match(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\] \[DEBUG\]/)) {
																										return (
																											<span key={lineKey} className={classes.debugLog}>
																												{line}
																											</span>
																										);
																									}
																									else if (line.match(/^\[\d{2}:\d{2}:\d{2}\.\d{3}\]/)) {
																										// 为时间戳部分添加特殊样式
																										const timestampMatch = line.match(/^(\[\d{2}:\d{2}:\d{2}\.\d{3}\])(.*)$/);
																										if (timestampMatch) {
																											return (
																												<span key={lineKey} style={{ display: "block" }}>
																													<span className={classes.timestampLog}>{timestampMatch[1]}</span>
																													{timestampMatch[2]}
																												</span>
																											);
																										}
																									}
																									return (
																										<span key={lineKey} style={{ display: "block" }}>
																											{line}
																										</span>
																									);
																								})}
																							</pre>
																						</div>
																					</div>
																				)}
																			</div>
																		))}
																	</div>
																</div>
															)}

															{/* 不再需要单独的日志显示区域，因为每个任务都有自己的日志显示 */}
														</>
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
