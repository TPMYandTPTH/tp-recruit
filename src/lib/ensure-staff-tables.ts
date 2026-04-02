import { prisma } from "./db";

let initialized = false;

export async function ensureStaffTables() {
  if (initialized) return;
  initialized = true;

  try {
    // Create StaffUser table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS StaffUser (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT NOT NULL DEFAULT 'Recruitment',
        isActive INTEGER NOT NULL DEFAULT 1,
        lastLoginAt TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create StaffOtp table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS StaffOtp (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expiresAt TEXT NOT NULL,
        verified INTEGER NOT NULL DEFAULT 0,
        attempts INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Seed default staff users if table is empty
    const count: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as cnt FROM StaffUser`);
    if (count[0]?.cnt === 0 || count[0]?.cnt === BigInt(0)) {
      const now = new Date().toISOString();
      const users = [
        ["clstaff_seed01", "ahmed.director@tp.com", "Ahmed Hassan", "HOD", "Customer Experience"],
        ["clstaff_seed02", "sarah.recruiter@tp.com", "Sarah Lim", "RECRUITER", "Talent Acquisition"],
        ["clstaff_seed03", "mike.sourcing@tp.com", "Mike Tan", "SOURCING", "Talent Acquisition"],
        ["clstaff_seed04", "lisa.marketing@tp.com", "Lisa Wong", "MARKETING", "Employer Branding"],
        ["clstaff_seed05", "priya.hr@tp.com", "Priya Sharma", "HR", "Human Resources"],
        ["clstaff_seed06", "david.ops@tp.com", "David Kumar", "OPS", "Operations"],
        ["clstaff_seed07", "admin@tp.com", "System Admin", "ADMIN", "IT"],
        ["clstaff_seed08", "tarek@tp.com", "Tarek Ezzeldean", "ADMIN", "Management"],
      ];

      for (const [id, email, name, role, dept] of users) {
        await prisma.$executeRawUnsafe(
          `INSERT OR IGNORE INTO StaffUser (id, email, name, role, department, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
          id, email, name, role, dept, now, now
        );
      }
      console.log("[TP] Seeded 8 staff users");
    }
  } catch (err) {
    console.error("[TP] Error ensuring staff tables:", err);
  }
}
