import { defineFakeRoute } from "vite-plugin-fake-server/client";

// import { systemManagementRouter } from "./async-routes.fake";
import { ADMIN_TOKEN } from "./constants";
import { resultSuccess } from "./utils";

export default defineFakeRoute([
	{
		url: "/user-info",
		timeout: 1000,
		method: "get",
		response: ({ headers }) => {
			if (headers.authorization?.split?.(" ")?.[1] === ADMIN_TOKEN) {
				return resultSuccess({
					id: 1,
					avatar: "https://avatars.githubusercontent.com/u/47056890",
					username: "Admin",
					email: "admin@example.com",
					phoneNumber: "13800000000",
					description: "description",
					roles: ["admin"],
					// menus: [systemManagementRouter],
				});
			}
			else {
				return resultSuccess({
					id: 2,
					avatar: "https://avatar.vercel.sh/avatar.svg?text=Common",
					username: "Tom",
					email: "<EMAIL>",
					phoneNumber: "9876543210",
					description: "employee",
					roles: ["common"],
				});
			}
		},
	},
]);
