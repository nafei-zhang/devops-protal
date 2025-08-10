import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles(({ token }) => ({
	"actionButtons": {
		display: "flex",
		justifyContent: "flex-end",
		gap: "12px",
		marginTop: "16px",
	},
	// Form title and description styles
	"formTitle": {
		fontSize: "20px",
		fontWeight: "bold",
		color: token.colorTextHeading,
		marginBottom: "8px",
	},
	"formDescription": {
		fontSize: "14px",
		color: token.colorTextSecondary,
		marginBottom: "24px",
	},
	// Checkbox styles
	"checkbox": {
		"marginRight": "8px",
		"& .ant-checkbox-wrapper": {
			alignItems: "flex-start",
		},
		"& .ant-checkbox": {
			top: "2px",
		},
		"& .ant-checkbox-checked .ant-checkbox-inner": {
			backgroundColor: token.colorPrimary,
			borderColor: token.colorPrimary,
		},
		"& .ant-checkbox:hover .ant-checkbox-inner": {
			borderColor: token.colorPrimary,
		},
	},
	"checkboxGroup": {
		display: "flex",
		flexDirection: "column",
		gap: "8px",
		marginBottom: "16px",
	},
	// CR Form and Action Button Styles
	"crFormContainer": {
		padding: "20px",
		backgroundColor: token.colorBgContainer,
		borderRadius: token.borderRadius,
		border: `1px solid ${token.colorBorderSecondary}`,
	},
	"crSubmitContainer": {
		display: "flex",
		justifyContent: "flex-end",
		gap: "12px",
		marginTop: "24px",
		paddingTop: "16px",
		borderTop: `1px solid ${token.colorBorderSecondary}`,
	},
	"formLabel": {
		display: "block",
		marginBottom: "8px",
		fontWeight: "medium",
		color: token.colorTextLabel,
	},
	"formGroup": {
		marginBottom: "20px",
	},
	"formInput": {
		"width": "100%",
		"padding": "10px 12px",
		"borderRadius": token.borderRadius,
		"border": `1px solid ${token.colorBorderSecondary}`,
		"&:focus": {
			borderColor: token.colorPrimary,
			boxShadow: `0 0 0 2px ${token.colorPrimaryBg}`,
			outline: "none",
		},
	},
	"formSubmitContainer": {
		display: "flex",
		justifyContent: "flex-end",
		gap: "12px",
		marginTop: "24px",
	},

	"buttonContainer": {
		display: "flex",
		justifyContent: "flex-end",
		gap: "12px",
		marginTop: "20px",
	},
	"inputContainer": {
		"marginBottom": "20px",
		"& .ant-input": {
			"padding": "10px 12px",
			"borderRadius": token.borderRadius,
			"border": `1px solid ${token.colorBorderSecondary}`,
			"&:focus": {
				borderColor: token.colorPrimary,
				boxShadow: `0 0 0 2px ${token.colorPrimaryBg}`,
			},
		},
		"& .ant-input-affix-wrapper": {
			padding: "4px 12px",
			borderRadius: token.borderRadius,
		},
	},
	"stepModal": {
		"width": "80%",
		"maxWidth": "800px",
		"margin": "0 auto",
		"& .ant-modal-content": {
			padding: "24px",
			borderRadius: token.borderRadius,
		},
		"& .ant-modal-header": {
			marginBottom: "16px",
		},
		"& .ant-modal-body": {
			padding: "0",
		},
		"& .ant-modal-footer": {
			marginTop: "24px",
			padding: "16px 0 0",
			borderTop: `1px solid ${token.colorBorderSecondary}`,
		},
	},
	"pendingButton": {
		"backgroundColor": "#F5A623",
		"color": "#fff",
		"border": "none",
		"borderRadius": "4px",
		"padding": "8px 16px",
		"cursor": "pointer",
		"fontWeight": "bold",
		"&:hover": {
			backgroundColor: "#E69500",
		},
		"&:disabled": {
			backgroundColor: "#FFD591",
			cursor: "not-allowed",
		},
	},
	"modalContainer": {
		width: "100%",
		padding: "20px",
		backgroundColor: token.colorBgContainer,
		borderRadius: token.borderRadius,
		boxShadow: token.boxShadow,
	},
	"modalTitle": {
		fontWeight: "bold",
		fontSize: "18px",
		marginBottom: "16px",
		color: token.colorTextHeading,
		borderBottom: `1px solid ${token.colorBorderSecondary}`,
		paddingBottom: "12px",
	},
	"modalContent": {
		marginBottom: "24px",
		color: token.colorText,
		lineHeight: "1.5",
	},
	"modalFooter": {
		display: "flex",
		justifyContent: "flex-end",
		gap: "12px",
		paddingTop: "12px",
		borderTop: `1px solid ${token.colorBorderSecondary}`,
	},
	"stepsWrapper": {
		"position": "relative",
		"width": "100%",
		"overflow": "auto",
		"paddingBottom": "30px",
		"paddingTop": "10px",
		"&::-webkit-scrollbar": {
			height: "6px",
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: token.colorBorderSecondary,
			borderRadius: "3px",
		},
		"&::-webkit-scrollbar-track": {
			backgroundColor: token.colorBgContainer,
		},
	},
	"stepsContainer": {
		"minWidth": "max-content",
		"padding": "0 12px",
		"& .ant-steps-item-title": {
			lineHeight: "16px",
			fontSize: "14px",
			textAlign: "center",
		},
	},
	"stepIcon": {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "16px",
		height: "16px",
		borderRadius: "50%",
		margin: "9px 0px 4px 4px",
		boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
	},
	"pendingIcon": {
		backgroundColor: "#F5A623", // 橙色，对应图片中的Pending状态
		color: "#fff",
	},
	"@keyframes pulse": {
		"0%": {
			opacity: 1,
			boxShadow: "0 0 0 0 rgba(82, 196, 26, 0.7)",
		},
		"50%": {
			opacity: 0.8,
			boxShadow: "0 0 0 5px rgba(82, 196, 26, 0.3)",
		},
		"100%": {
			opacity: 1,
			boxShadow: "0 0 0 0 rgba(82, 196, 26, 0)",
		},
	},

	"runningIcon": {
		backgroundColor: "#52C41A", // 绿色，对应图片中的Running状态
		color: "#fff",
		animation: "$pulse 1.5s infinite ease-in-out",
	},
	"completedIcon": {
		backgroundColor: "#1677FF", // 蓝色，对应图片中的Completed状态
		color: "#fff",
	},
	"failedIcon": {
		backgroundColor: "#FF4D4F", // 红色，对应图片中的Failed状态
		color: "#fff",
	},
	"canceledIcon": {
		backgroundColor: "#8C8C8C", // 灰色，对应图片中的Canceled状态
		color: "#fff",
	},
	"skippedIcon": {
		backgroundColor: "#D9D9D9", // 浅灰色，对应图片中的Skipped状态
		color: "#fff",
	},
	"stepDetails": {
		marginTop: "16px",
		padding: "16px",
		backgroundColor: token.colorBgContainer,
		borderRadius: token.borderRadius,
		border: `1px solid ${token.colorBorderSecondary}`,
	},
	"stepTitle": {
		fontWeight: "bold",
		marginBottom: "8px",
		display: "flex",
		alignItems: "center",
		gap: "8px",
	},
	"statusLegend": {
		display: "flex",
		flexWrap: "wrap",
		gap: "16px",
		marginTop: "24px",
		paddingTop: "16px",
		borderTop: `1px solid ${token.colorBorderSecondary}`,
	},
	"legendItem": {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		fontSize: "14px",
	},
	"statusLegendSmall": {
		display: "flex",
		flexWrap: "wrap",
		gap: "8px",
		marginBottom: "16px",
		justifyContent: "flex-end",
	},
	"legendItemSmall": {
		display: "flex",
		alignItems: "center",
		gap: "4px",
		fontSize: "12px",
	},
	"stepIconSmall": {
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		margin: "2px",
		boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)",
	},
	"formContainer": {
		"marginBottom": "24px",
		"& .ant-form-item": {
			marginBottom: "16px",
		},
		"& .ant-form-item-label": {
			padding: "0 0 8px",
		},
		"& .ant-input, & .ant-select": {
			borderRadius: token.borderRadius,
		},
	},
	"submitButton": {
		"backgroundColor": token.colorPrimary,
		"color": "#fff",
		"border": "none",
		"borderRadius": "4px",
		"padding": "8px 20px",
		"cursor": "pointer",
		"fontWeight": "bold",
		"&:hover": {
			backgroundColor: token.colorPrimaryHover,
		},
		"&:disabled": {
			opacity: 0.6,
			cursor: "not-allowed",
		},
	},
	"cancelButton": {
		"backgroundColor": "#fff",
		"color": token.colorText,
		"border": `1px solid ${token.colorBorderSecondary}`,
		"borderRadius": "4px",
		"padding": "8px 20px",
		"cursor": "pointer",
		"&:hover": {
			borderColor: token.colorPrimary,
			color: token.colorPrimary,
		},
	},
}));
