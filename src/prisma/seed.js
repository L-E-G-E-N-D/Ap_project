const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Jones',
      email: 'bob@example.com',
      password: hashedPassword,
    },
  });

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 5);

  await prisma.task.createMany({
    data: [
      {
        title: 'Complete Lab Report',
        description: 'Finish writing the database viva report',
        priority: 'HIGH',
        status: 'PENDING',
        dueDate: futureDate,
        userId: user1.id,
      },
      {
        title: 'Buy Groceries',
        description: 'Milk, eggs, and bread',
        priority: 'LOW',
        status: 'COMPLETED',
        dueDate: pastDate,
        userId: user1.id,
      },
      {
        title: 'Math Assignment',
        description: 'Submit algebra exercises',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: pastDate,
        userId: user1.id,
      },
      {
        title: 'Bob project task',
        description: 'Bob private project checklist',
        priority: 'HIGH',
        status: 'PENDING',
        dueDate: futureDate,
        userId: user2.id,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
