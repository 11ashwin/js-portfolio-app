require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');

// Simple interactive prompt so the plaintext password never has to live in
// shell history, a .env file, or source code.
function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    if (!hidden) {
      rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); });
      return;
    }
    // Mask input for the password prompt.
    const stdin = process.stdin;
    process.stdout.write(question);
    let input = '';
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (char) => {
      char = char.toString();
      if (char === '\n' || char === '\r' || char === '\u0004') {
        stdin.setRawMode(false);
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        rl.close();
        resolve(input);
        return;
      }
      if (char === '\u0003') process.exit(1); // Ctrl+C
      if (char === '\u007f') { input = input.slice(0, -1); return; } // backspace
      input += char;
    };
    stdin.on('data', onData);
  });
}

async function seed() {
  const email = await ask('Admin email: ');
  const password = await ask('Admin password (min 10 chars): ', { hidden: true });

  if (!email.includes('@') || password.length < 10) {
    console.error('✖ Invalid email or password too short (min 10 characters).');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admin_users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email.toLowerCase(), passwordHash]
  );

  console.log(`✔ Admin user "${email}" is ready. You can now log in at /admin.html`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Failed to seed admin user:', err.message);
  process.exit(1);
});
