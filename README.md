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
npm test

# 6️⃣ Start development server
npm run dev

