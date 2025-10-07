"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateImageUrlToArray = migrateImageUrlToArray;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("../src/entities/product.entity");
async function migrateImageUrlToArray() {
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const dataSource = app.get(typeorm_1.DataSource);
        const productRepository = dataSource.getRepository(product_entity_1.Product);
        console.log('🚀 Iniciando migración de imageUrl a imageUrls...');
        console.log('📋 Creando columna imageUrls si no existe...');
        try {
            await dataSource.query(`
        ALTER TABLE products ADD COLUMN IF NOT EXISTS "imageUrls" text[] DEFAULT '{}'
      `);
            console.log('✅ Columna imageUrls verificada/creada');
        }
        catch (error) {
            console.log('⚠️ La columna imageUrls ya existe o hay un error:', error.message);
        }
        const products = await dataSource.query(`
      SELECT id, title, "imageUrl" 
      FROM products 
      WHERE "imageUrl" IS NOT NULL 
      AND "imageUrl" != ''
      AND ("imageUrls" IS NULL OR array_length("imageUrls", 1) IS NULL OR "imageUrls" = '{}')
    `);
        console.log(`📦 Encontrados ${products.length} productos para migrar`);
        let migratedCount = 0;
        for (const productData of products) {
            try {
                await dataSource.query(`
          UPDATE products 
          SET "imageUrls" = ARRAY[$1]
          WHERE id = $2
        `, [productData.imageUrl, productData.id]);
                console.log(`✅ Migrado: ${productData.title} (${productData.id})`);
                migratedCount++;
            }
            catch (error) {
                console.error(`❌ Error migrando producto ${productData.id}:`, error.message);
            }
        }
        console.log(`\n🎉 Migración completada!`);
        console.log(`📊 Productos migrados: ${migratedCount}/${products.length}`);
        const verification = await dataSource.query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN "imageUrls" IS NOT NULL AND array_length("imageUrls", 1) > 0 THEN 1 END) as products_with_images,
        COUNT(CASE WHEN "imageUrl" IS NOT NULL AND "imageUrl" != '' THEN 1 END) as products_with_old_imageurl
      FROM products
    `);
        console.log('\n📈 Estadísticas de verificación:');
        console.log(`- Total de productos: ${verification[0].total_products}`);
        console.log(`- Productos con imageUrls: ${verification[0].products_with_images}`);
        console.log(`- Productos con imageUrl antigua: ${verification[0].products_with_old_imageurl}`);
        await app.close();
        process.exit(0);
    }
    catch (error) {
        console.error('💥 Error durante la migración:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    migrateImageUrlToArray();
}
//# sourceMappingURL=migrate-image-urls.js.map