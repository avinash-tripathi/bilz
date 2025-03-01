export interface APIResponse<T = any> {
    result: string;
    obj: T;
    message: string;
    innermessage: string;
    code: string;
}
