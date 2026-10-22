import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';
import { setServers } from 'node:dns';

export interface SeedResult {
  status: 'created' | 'skipped' | 'failed';
  message: string;
}

export async function seedAdmin(overrides?: { email?: string; password?: string }): Promise<SeedResult> {
  const email = (overrides?.email ?? process.env.ADMIN_EMAIL ?? ENV.ADMIN_EMAIL ?? '').trim();
  const password = (overrides?.password ?? process.env.ADMIN_INITIAL_PASSWORD ?? ENV.ADMIN_INITIAL_PASSWORD ?? '').trim();

  if (!email) {
    const message = 'Error: ADMIN_EMAIL must be explicitly configured in your environment.';
    console.error(message);
    return { status: 'failed', message };
  }

  try {
    try {
      setServers(['8.8.8.8', '8.8.4.4']);
    } catch {
      // Ignore if setServers fails in constrained environments
    }

    console.log('Connecting to database...');
    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    // Idempotent safeguard: Never overwrite or reset existing admin password
    if (existingUser) {
      const message = `Admin user with email '${email}' already exists. Provisioning skipped.`;
      console.log(message);
      await disconnectDB();
      return { status: 'skipped', message };
    }

    if (!password || password.length < 8) {
      const message =
        'Error: ADMIN_INITIAL_PASSWORD must be explicitly configured in your environment (minimum 8 characters) to provision a new administrator.';
      console.error(message);
      await disconnectDB();
      return { status: 'failed', message };
    }

    console.log(`Creating initial administrator '${email}'...`);
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
    });

    const message = `Administrator account '${email}' created successfully.`;
    console.log(message);
    await disconnectDB();
    console.log('Admin provisioning complete.');
    return { status: 'created', message };
  } catch (error) {
    console.error('Failed to seed administrator account:', error);
    await disconnectDB();
    throw error;
  }
}

// CLI runner: only execute directly when invoked from terminal
const isDirectCliRun =
  process.argv[1] &&
  (process.argv[1].endsWith('seedAdmin.ts') || process.argv[1].endsWith('seedAdmin.js'));

if (isDirectCliRun) {
  seedAdmin()
    .then((result) => {
      if (result.status === 'failed') {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}
