// src/store/middleware/logger.ts
function logger(config: (set: (...args: any[]) => void, get: () => any, api: any) => any) {
	return (set: any, get: () => any, api: any) =>
		config(
			(...args) => {
				console.warn("Previous state:", get());
				console.warn("应用的参数:", args);
				set(...args);
				console.warn("调用后的状态:", get());
			},
			get,
			api,
		);
}

export default logger;
