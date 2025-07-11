import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Limpiar datos existentes
    await this.productsRepository.delete({});
    await this.categoriesRepository.delete({});
    await this.usersRepository.delete({});

    // Crear usuarios
    const adminUser = await this.createUser({
      email: 'admin@ecommerce.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    });

    const regularUser = await this.createUser({
      email: 'user@ecommerce.com',
      password: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
    });

    console.log('✅ Usuarios creados');

    // Crear categorías
    const categories = await this.createCategories();
    console.log('✅ Categorías creadas');

    // Crear productos
    await this.createProducts(categories);
    console.log('✅ Productos creados');

    console.log('🎉 Seed completado exitosamente!');
    console.log('📧 Admin: admin@ecommerce.com / admin123');
    console.log('📧 User: user@ecommerce.com / user123');
  }

  private async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }): Promise<User> {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  private async createCategories(): Promise<Category[]> {
    const categoriesData = [
      {
        name: 'Ropa Masculina',
        description: 'Ropa y accesorios para hombres',
      },
      {
        name: 'Ropa Femenina',
        description: 'Ropa y accesorios para mujeres',
      },
      {
        name: 'Electrónicos',
        description: 'Dispositivos electrónicos y gadgets',
      },
      {
        name: 'Deportes',
        description: 'Artículos deportivos y fitness',
      },
      {
        name: 'Hogar',
        description: 'Artículos para el hogar y decoración',
      },
    ];

    const categories = [];
    for (const categoryData of categoriesData) {
      const category = this.categoriesRepository.create(categoryData);
      const savedCategory = await this.categoriesRepository.save(category);
      categories.push(savedCategory);
    }

    return categories;
  }

  private async createProducts(categories: Category[]): Promise<void> {
    const productsData = [
      // Ropa Masculina
      {
        title: 'Camisa Casual Azul',
        description: 'Camisa casual de algodón 100% en color azul marino. Perfecta para uso diario y ocasiones informales.',
        price: 45.99,
        stock: 25,
        imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[0], // Ropa Masculina
      },
      {
        title: 'Jeans Clásicos',
        description: 'Jeans de corte clásico en denim de alta calidad. Cómodos y duraderos para el uso diario.',
        price: 79.99,
        stock: 30,
        imageUrl: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[0],
      },
      {
        title: 'Chaqueta de Cuero',
        description: 'Chaqueta de cuero genuino con diseño moderno. Ideal para looks casuales y elegantes.',
        price: 199.99,
        stock: 15,
        imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[0],
      },

      // Ropa Femenina
      {
        title: 'Vestido Floral',
        description: 'Hermoso vestido con estampado floral, perfecto para ocasiones especiales y salidas casuales.',
        price: 89.99,
        stock: 20,
        imageUrl: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[1], // Ropa Femenina
      },
      {
        title: 'Blusa Elegante',
        description: 'Blusa elegante de seda con diseño sofisticado. Ideal para el trabajo y eventos formales.',
        price: 65.99,
        stock: 18,
        imageUrl: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[1],
      },
      {
        title: 'Falda Midi',
        description: 'Falda midi versátil que se adapta a diferentes estilos. Cómoda y elegante.',
        price: 55.99,
        stock: 22,
        imageUrl: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[1],
      },

      // Electrónicos
      {
        title: 'Auriculares Bluetooth',
        description: 'Auriculares inalámbricos con cancelación de ruido y excelente calidad de sonido.',
        price: 129.99,
        stock: 35,
        imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[2], // Electrónicos
      },
      {
        title: 'Smartphone Pro',
        description: 'Smartphone de última generación con cámara profesional y procesador de alto rendimiento.',
        price: 899.99,
        stock: 12,
        imageUrl: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[2],
      },
      {
        title: 'Laptop Gaming',
        description: 'Laptop para gaming con tarjeta gráfica dedicada y procesador de alta velocidad.',
        price: 1299.99,
        stock: 8,
        imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
        category: categories[2],
      },

      // Deportes
      {
        title: 'Zapatillas Running',
        description: 'Zapatillas especializadas para running con tecnología de amortiguación avanzada.',
        price: 119.99,
        stock: 40,
        imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[3], // Deportes
      },
      {
        title: 'Mancuernas Ajustables',
        description: 'Set de mancuernas ajustables para entrenamiento en casa. Peso variable de 5-25kg.',
        price: 159.99,
        stock: 15,
        imageUrl: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[3],
      },
      {
        title: 'Yoga Mat Premium',
        description: 'Esterilla de yoga antideslizante de alta calidad. Perfecta para yoga y ejercicios.',
        price: 39.99,
        stock: 50,
        imageUrl: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[3],
      },

      // Hogar
      {
        title: 'Lámpara Moderna',
        description: 'Lámpara de mesa con diseño moderno y minimalista. Iluminación LED eficiente.',
        price: 75.99,
        stock: 25,
        imageUrl: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[4], // Hogar
      },
      {
        title: 'Cojines Decorativos',
        description: 'Set de cojines decorativos con diseños elegantes para sala y dormitorio.',
        price: 29.99,
        stock: 60,
        imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[4],
      },
      {
        title: 'Espejo Decorativo',
        description: 'Espejo decorativo con marco dorado. Perfecto para agregar elegancia a cualquier espacio.',
        price: 89.99,
        stock: 20,
        imageUrl: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[4],
      },
      {
        title: 'Planta Decorativa',
        description: 'Planta artificial de alta calidad que no requiere mantenimiento. Ideal para decoración.',
        price: 24.99,
        stock: 45,
        imageUrl: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: categories[4],
      },
    ];

    for (const productData of productsData) {
      const product = this.productsRepository.create(productData);
      await this.productsRepository.save(product);
    }
  }
}