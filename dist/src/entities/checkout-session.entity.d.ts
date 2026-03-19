export type CheckoutSessionStatus = 'pending' | 'approved';
export declare class CheckoutSession {
    id: string;
    preferenceId: string;
    items: Array<{
        productId: string;
        quantity: number;
    }>;
    status: CheckoutSessionStatus;
    paymentId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
