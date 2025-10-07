require('dotenv').config();
const { Client } = require('pg');

async function migrateImageUrls() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('🚀 Iniciando migración de imageUrl a imageUrls...');

    // Paso 1: Crear la columna imageUrls si no existe
    console.log('📋 Creando columna imageUrls si no existe...');
    await client.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS "imageUrls" text[] DEFAULT '{}'
    `);
    console.log('✅ Columna imageUrls verificada/creada');

    // Paso 2: Obtener productos con imageUrl pero sin imageUrls
    const result = await client.query(`
      SELECT id, title, "imageUrl" 
      FROM products 
      WHERE "imageUrl" IS NOT NULL 
      AND "imageUrl" != ''
      AND ("imageUrls" IS NULL OR array_length("imageUrls", 1) IS NULL OR "imageUrls" = '{}')
    `);

    const products = result.rows;
    console.log(`📦 Encontrados ${products.length} productos para migrar`);

    let migratedCount = 0;

    // Paso 3: Migrar cada producto
    for (const product of products) {
      try {
        await client.query(`
          UPDATE products 
          SET "imageUrls" = ARRAY[$1]
          WHERE id = $2
        `, [product.imageUrl, product.id]);

        console.log(`✅ Migrado: ${product.title} (${product.id})`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrando producto ${product.id}:`, error.message);
      }
    }

    console.log(`\n🎉 Migración completada!`);
    console.log(`📊 Productos migrados: ${migratedCount}/${products.length}`);

    // Paso 4: Verificar la migración
    const verification = await client.query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN "imageUrls" IS NOT NULL AND array_length("imageUrls", 1) > 0 THEN 1 END) as products_with_images,
        COUNT(CASE WHEN "imageUrl" IS NOT NULL AND "imageUrl" != '' THEN 1 END) as products_with_old_imageurl
      FROM products
    `);

    const stats = verification.rows[0];
    console.log('\n📈 Estadísticas de verificación:');
    console.log(`- Total de productos: ${stats.total_products}`);
    console.log(`- Productos con imageUrls: ${stats.products_with_images}`);
    console.log(`- Productos con imageUrl antigua: ${stats.products_with_old_imageurl}`);

    // Paso 5: Crear índice para mejorar rendimiento
    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_products_image_urls ON products USING GIN("imageUrls")
      `);
      console.log('✅ Índice GIN creado para imageUrls');
    } catch (error) {
      console.log('⚠️ Error creando índice:', error.message);
    }

  } catch (error) {
    console.error('💥 Error durante la migración:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Conexión cerrada');
  }
}

migrateImageUrls();
