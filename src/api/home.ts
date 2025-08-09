import { request } from "#src/utils";

export interface PieDataType {
	value: number
	code: string
}

export interface TeamPodDataType {
	value: number
	code: string
}

export function fetchPie(data: { by: string | number }) {
	return request
		.get("home/pie", { searchParams: data })
		.json<ApiResponse<PieDataType[]>>();
}

export function fetchTeamPods(data: { by: string | number }) {
	return request
		.get("home/team-pods", { searchParams: data })
		.json<ApiResponse<TeamPodDataType[]>>();
}

export function fetchLine(data: { range: string }) {
	return request
		.post("home/line", { json: data })
		.json<ApiResponse<string[]>>();
}
