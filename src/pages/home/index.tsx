import type { ColProps } from "antd";

import { BasicContent } from "#src/components";
import { Col, Row, Typography, Alert, Card } from "antd";
import { useTranslation } from "react-i18next";

import BarChart from "./components/bar-chart";
import CardList from "./components/card-list";
import LineChart from "./components/line-chart";

import TeamPodChart from "./components/team-pod-chart";

const wrapperCol: ColProps = {
	xs: 24,
	sm: 24,
	md: 12,
	lg: 12,
	xl: 12,
	xxl: 12,
};
export default function Home() {
	const { t } = useTranslation();
	return (
		<BasicContent>
			<Row gutter={[20, 20]}>
				<Col span={24}>
					<Alert
						message={<Typography.Title level={4} style={{ margin: 0 }}>{t("home.mockDataTitle")}</Typography.Title>}
						type="info"
						showIcon
						style={{ marginBottom: 16 }}
					/>
				</Col>
				<Col span={24}>
					<Card
						title={<Typography.Title level={4} style={{ margin: 0 }}>{t("home.pendingCRTitle")}</Typography.Title>}
						bodyStyle={{ padding: "16px" }}
					>
						<CardList />
					</Card>
				</Col>
				<Col span={24}>
					<LineChart />
				</Col>
				<Col span={24}>
					<Row justify="space-between" gutter={[20, 20]}>
						<Col {...wrapperCol}>
							<BarChart />
						</Col>
						<Col {...wrapperCol}>
							<TeamPodChart />
						</Col>
					</Row>
				</Col>
			</Row>
		</BasicContent>
	);
}
