import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const cookiesData: any = [
    {
      id: 1,
      text: 'reptile',
    },
    {
      id: 2,
      text: 'bird',
    }
];

async function main() {
    console.log(`Start seeding ...`);
    for (const p of cookiesData) {
        const elemento = await prisma.cookies.upsert({
            where: { id: p.id },
            create: p,
            update: {},
        });
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });