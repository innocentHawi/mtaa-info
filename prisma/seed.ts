import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.faq.createMany({
    data: [
      { question: "Where is the county office?", answer: "The county office is at Kenyatta Avenue, Nairobi." },
      { question: "How do I pay land rates?", answer: "You can pay land rates via eCitizen portal or at the county revenue office." }
    ]
  });
}

main().finally(() => prisma.$disconnect());
