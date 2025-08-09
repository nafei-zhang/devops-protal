import { Result, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function CR() {
	const { t } = useTranslation();

	return (
		<Result
			status="info"
			title={t("common.menu.cr")}
			subTitle="CR Page"
			extra={<Title level={4}>This is a placeholder for CR page</Title>}
		/>
	);
};
