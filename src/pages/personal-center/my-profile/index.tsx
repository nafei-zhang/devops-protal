import { BasicContent, FormAvatarItem } from "#src/components";
import { useUserStore } from "#src/store";

import {
	ProForm,
	ProFormDigit,
	ProFormText,
	ProFormTextArea,
} from "@ant-design/pro-components";
import { Form, Input } from "antd";

export default function Profile() {
	const currentUser = useUserStore();
	const getAvatarURL = () => {
		if (currentUser) {
			// if (currentUser.avatar) {
			// 	return currentUser.avatar;
			// }
			const url = "https://avatar.vercel.sh/blur.svg?text=" + currentUser.username;
			return url;
		}
		return "";
	};

	const handleFinish = async () => {
		window.$message?.success("update profile success");
	};

	return (
		<BasicContent className="max-w-md ml-10">
			<h3>My Profile</h3>
			<ProForm
				layout="vertical"
				onFinish={handleFinish}
				initialValues={{
					...currentUser,
					avatar: getAvatarURL(),
				}}
				requiredMark
			>
				<Form.Item
					name="avatar"
					label="avatar"
					rules={[
						{
							required: true,
							message: "please upload avatar",
						},
					]}
				>
					<FormAvatarItem />
				</Form.Item>
				<ProFormText
					name="username"
					label="username"
					rules={[
						{
							required: true,
							message: "please input username",
						},
					]}
				/>
				<ProFormText
					name="email"
					label="email"
					rules={[
						{
							required: true,
							message: "please input email",
						},
					]}
				/>
				<ProFormDigit
					name="phoneNumber"
					label="phoneNumber"
					rules={[
						{
							required: true,
							message: "please input phoneNumber",
						},
					]}
				>
					<Input type="tel" allowClear />
				</ProFormDigit>
				<ProFormTextArea
					allowClear
					name="description"
					label="description"
					placeholder="description"
				/>
			</ProForm>
		</BasicContent>
	);
};
