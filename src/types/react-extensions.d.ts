type CrossOriginType = "anonymous" | "use-credentials" | "" | undefined;

declare module "react" {
	interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
		crossOrigin?: CrossOriginType
	}
}
