import type { ColProps } from "antd";
import {
	RocketOutlined,
	CloudServerOutlined,
	TeamOutlined,
	ThunderboltOutlined,
	SafetyOutlined,
	CrownOutlined,
	StarOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import { cardListData } from "../mockData";

const wrapperCol: ColProps = {
	xs: 24,
	sm: 24,
	md: 12,
	lg: 8,
	xl: 8,
	xxl: 6,
};

export default function CardList() {
	const { t } = useTranslation();

	// 图标映射
	const iconMap = {
		RocketOutlined: <RocketOutlined />,
		TeamOutlined: <TeamOutlined />,
		CloudServerOutlined: <CloudServerOutlined />,
		ThunderboltOutlined: <ThunderboltOutlined />,
		SafetyOutlined: <SafetyOutlined />,
		CrownOutlined: <CrownOutlined />,
		StarOutlined: <StarOutlined />,
	};

	// 使用 mock 数据
	const CARD_LIST = cardListData.map(item => ({
		title: t(`home.${item.title}`),
		data: item.data,
		icon: iconMap[item.icon as keyof typeof iconMap],
	}));

	return (
		<Row justify="space-between" gutter={[20, 20]}>
			{
				CARD_LIST.map((cardItem) => {
					return (
						<Col {...wrapperCol} key={cardItem.title}>
							<Card className="">
								<div className="flex justify-between items-center">
									<div className="flex flex-col">
										<h3 className="text-xl">{cardItem.title}</h3>
										<CountUp 
									start={0}
									end={cardItem.data} 
									duration={2.5}
									delay={0.3}
									separator=","
									decimals={0}
									prefix=""
									suffix=""
									enableScrollSpy
									className="text-2xl"
								/>
									</div>
									<Button
										className="text-3xl"
										icon={cardItem.icon}
										type="text"
									/>
								</div>
							</Card>
						</Col>
					);
				})
			}
		</Row>
	);
}
