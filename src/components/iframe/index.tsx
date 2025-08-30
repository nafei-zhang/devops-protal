/* eslint-disable react/no-comment-textnodes */
import React from "react";
import { useTranslation } from "react-i18next";
import { useMatches } from "react-router";

// 导入自定义样式
import "./iframe.css";

// 定义 crossOrigin 的可能值类型

export function Iframe() {
	const matches = useMatches();
	const { t } = useTranslation();
	const currentRoute = matches[matches.length - 1];
	const iframeLink = currentRoute.handle?.iframeLink;
	const routeTitle = currentRoute.handle?.title;

	const title = (
		React.isValidElement(routeTitle) ? t(routeTitle?.props.children) : routeTitle
	) as string;

	return iframeLink
		? (
			/**
			 * use this tool https://iframegenerator.top/ to generate the iframe code
			 */
			<div className="iframe-container">
				// eslint-disable-next-line react-dom/no-missing-iframe-sandbox
				<iframe
					src={iframeLink}
					title={title}
					loading="lazy"
					className="iframe-content"
					style={{ width: "100%", height: "100%" }}
					crossOrigin="anonymous"
				/>
			</div>
		)
		: null;
}
