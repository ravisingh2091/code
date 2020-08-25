export interface applicationData {
    user_id: string,
    product_type?: string
}

export interface applicationStatusData {
    status_id: string,
    app_id: string
}

export interface addOnData {
    app_id: string,
    user_id: string,
    slug?: string,
    orch_url?: string,
    action_type?: string
}