import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo() {
    return {
      message: 'E-commerce API is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register',
          health: 'GET /api/auth/health'
        },
        products: {
          list: 'GET /api/products',
          create: 'POST /api/products',
          get: 'GET /api/products/:id',
          update: 'PATCH /api/products/:id',
          delete: 'DELETE /api/products/:id',
          search: 'GET /api/products/search?q=query',
          addImage: 'POST /api/products/:id/images',
          removeImage: 'DELETE /api/products/:id/images',
          reorderImages: 'PATCH /api/products/:id/images/reorder'
        },
        categories: {
          list: 'GET /api/categories',
          create: 'POST /api/categories',
          get: 'GET /api/categories/:id',
          update: 'PATCH /api/categories/:id',
          delete: 'DELETE /api/categories/:id'
        }
      },
      database: 'Connected to PostgreSQL',
      features: [
        'JWT Authentication',
        'Multiple Image Support',
        'Product Categories',
        'User Management'
      ]
    };
  }

  @Get('api')
  getApiRoot() {
    return this.getApiInfo();
  }
}
