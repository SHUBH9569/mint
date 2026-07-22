import { db } from "@/db/drizzle";
import {
  users,
  orgs,
  memberships,
  contests,
  problems,
  contestProblems,
  groups,
  groupMemberships,
  sessionTable,
  testCases,
} from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { generateUsername } from "@/lib/username";
import Enquirer from "enquirer";
const prompt = Enquirer.prompt;

async function clearDatabase() {
  try {
    console.log("Clearing database...");

    // Delete tables in order to respect foreign key constraints
    await db.delete(groupMemberships);
    await db.delete(groups);
    await db.delete(contestProblems);
    await db.delete(testCases);
    await db.delete(problems);
    await db.delete(contests);
    await db.delete(memberships);
    await db.delete(sessionTable);
    await db.delete(orgs);
    await db.delete(users);

    console.log("Database cleared successfully!");
    return true;
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("\n=== Create Superuser ===\n");

    // First, clear the database
    const shouldClear = await prompt<{ shouldClear: boolean }>({
      type: "confirm",
      name: "shouldClear",
      message: "This will clear ALL data in the database. Continue? (y/n): ",
    });
    if (!shouldClear.shouldClear) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    await clearDatabase();
    console.log("Database cleared. Creating superuser...\n");

    // Get email
    const { email } = await prompt<{ email: string }>({
      type: "input",
      name: "email",
      message: "Enter email:",
      validate: (value) => value.includes("@") || "Invalid email address",
    });

    // Get password
    const { password } = await prompt<{ password: string }>({
      type: "password",
      name: "password",
      message: "Enter password (min 8 characters):",
      validate: (value) =>
        value.length >= 8 || "Password must be at least 8 characters long",
    });

    // Confirm password
    const { confirmPassword } = await prompt<{ confirmPassword: string }>({
      type: "password",
      name: "confirmPassword",
      message: "Confirm password:",
      validate: (value) => value === password || "Passwords do not match",
    });

    // Generate username from email
    const nameId = await generateUsername(email);

    // Create user
    const hashedPassword = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        nameId,
        name: email.split("@")[0], // Use part before @ as name
        email,
        hashedPassword,
        isSuperuser: true,
      })
      .returning();

    console.log("\nSuperuser created successfully!");
    console.log("Username:", nameId);
    console.log("Email:", email);

    process.exit(0);
  } catch (error) {
    console.error(
      "\nFailed to create superuser:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

main();
