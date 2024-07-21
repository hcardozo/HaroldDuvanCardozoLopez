export interface HttpApiResponse<T> {
    message?: string;
    data?: T;
}