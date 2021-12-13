

export interface Result<T = {}> {
    success: boolean;
    data?: T;
    // error message
    message?: string;
}
