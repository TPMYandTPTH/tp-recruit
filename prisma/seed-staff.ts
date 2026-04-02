import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const STAFF_USERS = [
  { email: "ahmed.director@tp.com", name: "Ahmed Hassan", role: "HOD", department: "Customer Experience" },
  { email: "sarah.recruiter@tp.com", name: "Sarah Lim", role: "RECRUITER", department: "Talent Acquisition" },
  { email: "mike.sourcing@tp.com", name: "Mike Tan", role: "SOURCING", department: "Talent Acquisition" },
  { email: "lisa.marketing@tp.com", name: "Lisa Wong", role: "MARKETING", department: "Employer Branding" },
  { email: "priya.hr@tp.com", name: "Priya Sharma", role: "HR", department: "Human Resources" },
  { email: "david.ops@tp.com", name: "David Kumar", role: "OPS", department: "Operations" },
  { email: "admin@tp.com", name: "System Admin", role: "ADMIN", department: "IT" },
  { email: "tarek@tp.com", name: "Tarek Ezzeldean", role: "ADMIN", department: "Management" },
];

async function main() {
  console.log("Seeding staff users...");
  for (const user of STAFF_USERS) {
    await prisma.staffUser.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
    console.log(`  ✓ ${user.name} (${user.role}) — ${user.email}`);
  }
  console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
