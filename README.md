# 1️⃣ Create local MySQL databases
mysql -u root -p -e "CREATE DATABASE game_of_bones_app;"
mysql -u root -p -e "CREATE DATABASE game_of_bones_app_test;"

# 2️⃣ Configure environment variables
# Copy .env.example to .env and fill your MySQL credentials

# 3️⃣ Install dependencies
npm install

# 4️⃣ Initialize databases
npm run init:db      # Development DB
npm run init:test    # Test DB

# 5️⃣ Run tests (optional)
# This command runs all tests using Jest.
# Make sure you have initialized the test database (step 4) before running the tests.
npm test

-------------------------------------------------------------------
$ npm test

> server-game-of-bones@1.0.0 test
> jest

  console.log
    [dotenv@17.2.2] injecting env (13) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

      at _log (node_modules/dotenv/lib/main.js:139:11)

  console.log
    ✅ MySQL test connection successful

      at testConnection (src/config/database.test.ts:25:13)

 PASS  src/tests/database.test.ts
  Database Connection
    √ should connect to test database successfully (92 ms)
    √ should execute a simple query (6 ms)
    √ should show test database exists (12 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.212 s, estimated 3 s
Ran all test suites.
Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?
-------------------------------------------------------------------


# 6️⃣ Start development server
npm run dev

#test de pull request