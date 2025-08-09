import { isValidElement } from "react";
import { useTranslation } from "react-i18next";
import { useMatches } from "react-router";

// 导入自定义样式
import "./iframe.css";

export function Iframe() {
	const matches = useMatches();
	const { t } = useTranslation();
	const currentRoute = matches[matches.length - 1];
	const iframeLink = currentRoute.handle?.iframeLink;
	const routeTitle = currentRoute.handle?.title;

	const title = (
		isValidElement(routeTitle) ? t(routeTitle?.props.children) : routeTitle
	) as string;

	return iframeLink
		? (
			/**
			 * use this tool https://iframegenerator.top/ to generate the iframe code
			 */
			<div className="iframe-container">
				<iframe
					src={iframeLink}
					title={title}
					loading="lazy"
					className="iframe-content"
					style={{ width: '100%', height: '100%' }}
				/>
			</div>
		)
		: null;
}
