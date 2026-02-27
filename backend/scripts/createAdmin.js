require('dotenv').config();
const bcrypt = require('bcrypt');
const readline = require('readline');
const db = require('../src/config/database');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
    try {
        console.log('🎈 Balloons Galore - Admin User Setup\n');
        
        const username = await question('Username: ');
        const email = await question('Email: ');
        const password = await question('Password (min 6 chars): ');
        
        if (!username || !email || !password) {
            console.error('❌ All fields are required!');
            process.exit(1);
        }
        
        if (password.length < 6) {
            console.error('❌ Password must be at least 6 characters!');
            process.exit(1);
        }
        
        console.log('\n⏳ Creating admin user...');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.execute(
            `INSERT INTO admin_users (username, email, password_hash, role, status) 
             VALUES (?, ?, ?, 'admin', 'active')`,
            [username, email, hashedPassword]
        );
        
        console.log('\n✅ Admin user created successfully!');
        console.log('\n📝 Login credentials:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log('\n🔗 Login at: http://localhost:5000/admin-login.html\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();