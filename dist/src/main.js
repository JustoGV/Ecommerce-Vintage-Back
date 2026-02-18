"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function createApp() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    return app;
}
async function bootstrap() {
    const app = await createApp();
    const port = process.env.PORT || 4200;
    await app.listen(port);
    console.log(`Backend running on port ${port}`);
    return app;
}
if (require.main === module) {
    bootstrap();
}
let app;
exports.default = async (req, res) => {
    if (!app) {
        app = await createApp();
        await app.init();
    }
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
};
//# sourceMappingURL=main.js.map