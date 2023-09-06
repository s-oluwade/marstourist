import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  //   await prisma.cart.deleteMany({});
  //   await prisma.cartItem.deleteMany({});
  //   await prisma.post.deleteMany({});
  //   await prisma.product.deleteMany({});
  //   await prisma.user.deleteMany({});

  //   const passwordHashed = await bcrypt.hash('john', 10);

  //   await prisma.user.create({
  //     data: {
  //       name: 'John Doe',
  //       username: 'johndoe',
  //       email: 'johndoe@example.com',
  //       password: passwordHashed,
  //     },
  //   });

  //   await prisma.product.create({
  //     data: {
  //       name: 'Surface laptop',
  //       description: 'Style and speed. Stand out on HD video calls backed by Studio Mics.',
  //       category: 'laptops',
  //       brand: 'Microsoft Surface',
  //       imageUrl: 'https://blogs.windows.com/wp-content/uploads/prod/sites/43/2021/04/hero-scaled.jpg',
  //       price: 1499,
  //     },
  //   });

  await prisma.$transaction(async (tx) => {
    await tx.product.createMany({
      data: [
        {
          name: 'iPhone',
          brand: 'Apple',
          category: 'smartphones',
          description:
            "The all new iPhone with the latest Abionic chip. Better than all previous models... Yeah that's right.",
          imageUrl:
            'https://images.unsplash.com/photo-1617997455403-41f333d44d5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          price: 89999,
        },
        {
          name: 'Samsung Galaxy Book',
          brand: 'Samsung',
          category: 'laptops',
          description: 'Samsung Galaxy Book S Laptop With Intel Lakefield Chip, with a whopping 64GB of RAM!',
          imageUrl: 'https://www.sammobile.com/wp-content/uploads/2022/02/Samsung-Galaxy-Book-2-Pro-360-4.jpg',
          price: 149999,
        },
        {
          name: 'Mars Trekker',
          brand: 'Nike',
          category: 'Shoes',
          description: 'You can literally moon walk with these shoes on.',
          imageUrl: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
          price: 9999,
        },
        {
          name: 'Olympus Sneaker',
          brand: 'Puma',
          category: 'Shoes',
          description: 'Specifically designed for hiking on Olympus Mons craters, sick.',
          price: 7999,
          imageUrl: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
        },
        {
          name: 'Smart Watch',
          brand: 'Nike',
          category: 'Watch',
          description:
            'Detect seismic activities on the martian surface and avoid the volcanoes that want to turn you into dust.',
          imageUrl: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
          price: 5999,
        },
        {
          name: 'Martian Backpack/Lunchbox',
          brand: 'Atelle',
          category: 'Bag',
          description: 'Pack your lunch yet? Ahh.. buy this.',
          price: 4999,
          imageUrl: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg',
        },
        {
          name: 'Money Pouch',
          brand: 'No name',
          category: 'Bag',
          description: "Keep your earnings away from martian bandits, or don't, your choice.",
          imageUrl: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
          price: 1999,
        },
      ],
    });
  });
}

main().then(() => {
  console.log('Data seeded...');
});
