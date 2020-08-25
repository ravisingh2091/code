export interface RequestResponseLogType {
    request_url: string,
    method: string,
    request_IP: string,
    request_header: object,
    request_body: object,
    response: object,
    status_code: number
}

export interface ResponseType {
    status: string,
    code: number,
    data?: object | string | null,
    error?: object | string | null
}