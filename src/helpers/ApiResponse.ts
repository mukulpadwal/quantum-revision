class ApiResponse {
    success: boolean;
    statusCode: number;
    data: {};
    message: string;

    constructor(success: boolean, statusCode: number, data: {}, message: string) {
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export default ApiResponse;
