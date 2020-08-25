export interface getDocumentParamsType {
    Bucket: string,
    Key: string
}

export type uploadParamsType<T> = {
    [P in keyof T]: T[P];
} & { Body?: any }

export enum requestTypeValue {CREATE, UPDATE}

interface mappingType {
    file: string,
    file_path: string,
    sheet: number | Array<string>,
    owner_slug?: string,
    application_slug?: string,
    business_slug?: string,
    seller_slug?: string,
    notify_slug?: string,
    frontend_user_slug?: string,
    backend_user_slug?: string,
    identifier?: string,
    frontend_user_identifier?: string,
    backend_user_identifier?: string,
    slug_api_mapping?: any,
    owner?: any,
    frontend_user?: any,
    backend_user?: any,
    application?: any,
    seller?: any,
    notify?: any
}

export interface SampleFormatType {
    client: string,
    file_type: string,
    convert_to_json: boolean,
    mapping: mappingType
}

interface validationFormat {
    name: string,
    validation: string
}

export interface validationType {
    client: string,
    app_validation: Array<validationFormat>,
    seller_validation: Array<validationFormat>
}

export interface result {
    total: number,
    success: number,
    fail: number,
    duplicate: number,
    details: any
}