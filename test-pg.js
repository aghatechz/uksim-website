const { Client } = require("pg");

const passwordsToTry = [
  "postgres",
  "123456",
  "admin",
  "root",
  "password",
  "vodafone2026",
  "12345678",
  "1234",
  "123",
  "Postgres",
  "Postgres123",
  "postgres123",
  "Vodafone2026",
];

async function testConnections() {
  for (const pass of passwordsToTry) {
    const connectionString = `postgresql://postgres:${encodeURIComponent(pass)}@localhost:5432/postgres`;
    const client = new Client({ connectionString });
    try {
      await client.connect();
      console.log(`FOUND_MATCHING_PASSWORD:${pass}`);
      await client.end();
      return pass;
    } catch (err) {
      // Failed for this password
    }
  }
  console.log("NO_STANDARD_PASSWORD_MATCHED");
  return null;
}

testConnections();
