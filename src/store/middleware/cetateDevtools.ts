// src/utils/createDevtools.ts
import process from "node:process";
import { devtools } from "zustand/middleware";

export function createDevtools(name: string) {
	return (initializer: any) => {
		let showDevtools = process.env.NODE_ENV === "development";

		// 也可以通过 URL 参数控制
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			const debug = url.searchParams.get("debug");
			if (debug?.includes(name)) {
				showDevtools = true;
			}
		}

		return devtools(initializer, {
			enabled: showDevtools,
			name: `AppName_${name}`,
		});
	};
}
