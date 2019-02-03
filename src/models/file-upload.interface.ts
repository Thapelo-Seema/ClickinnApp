export interface FileUpload {
	file: any;
    url: string;
    name: string;
    progress: number;
    path: string;
    loaded?: boolean;
}