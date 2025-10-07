export declare class AppController {
    getApiInfo(): {
        message: string;
        version: string;
        timestamp: string;
        endpoints: {
            auth: {
                login: string;
                register: string;
                health: string;
            };
            products: {
                list: string;
                create: string;
                get: string;
                update: string;
                delete: string;
                search: string;
                addImage: string;
                removeImage: string;
                reorderImages: string;
            };
            categories: {
                list: string;
                create: string;
                get: string;
                update: string;
                delete: string;
            };
        };
        database: string;
        features: string[];
    };
    getApiRoot(): {
        message: string;
        version: string;
        timestamp: string;
        endpoints: {
            auth: {
                login: string;
                register: string;
                health: string;
            };
            products: {
                list: string;
                create: string;
                get: string;
                update: string;
                delete: string;
                search: string;
                addImage: string;
                removeImage: string;
                reorderImages: string;
            };
            categories: {
                list: string;
                create: string;
                get: string;
                update: string;
                delete: string;
            };
        };
        database: string;
        features: string[];
    };
}
