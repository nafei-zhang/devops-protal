import type React from "react";

declare module "react" {
	interface IframeHTMLAttributes<T> extends React.HTMLAttributes<T> {
		crossOrigin?: "anonymous" | "use-credentials" | "" | undefined
	}
}
