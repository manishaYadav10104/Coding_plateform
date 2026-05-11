const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// FORCE DNS to use Google's servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log('🔍 Testing MongoDB connection...');
console.log('Connection string:', process.env.DB_CONNECT_STRING?.replace(/:[^:@]*@/, ':****@'));

async function test() {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });
        console.log('✅ SUCCESS! Connected to MongoDB');
        console.log('Database:', mongoose.connection.name);
        await mongoose.disconnect();
        console.log('✅ Test complete');
    } catch (err) {
        console.error('❌ FAILED:', err.message);
    }
}

test();