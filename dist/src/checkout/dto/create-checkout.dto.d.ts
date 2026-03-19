export declare class CheckoutItemDto {
    title: string;
    quantity: number;
    unitPrice: number;
    currencyId?: string;
    description?: string;
    pictureUrl?: string;
}
export declare class CheckoutPayerDto {
    email?: string;
    name?: string;
    surname?: string;
}
export declare class CreateCheckoutDto {
    items: CheckoutItemDto[];
    payer?: CheckoutPayerDto;
    externalReference?: string;
    notificationUrl?: string;
}
