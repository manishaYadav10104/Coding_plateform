const {createClient}=require ('redis');

const redisclient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19160.c74.us-east-1-4.ec2.cloud.redislabs.com',
        port: 19160
    }
});

module.exports = redisclient;