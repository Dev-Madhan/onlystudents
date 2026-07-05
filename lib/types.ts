export type ApiResponse = {
    status: 'success' | 'error';
    message?: string;
    checkoutUrl?: string;
};