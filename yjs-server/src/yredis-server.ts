import 'dotenv/config';
import * as yredis from '@y/redis';
import { S3Storage } from './storage-adapters/s3';

const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT || '3002');
const redisPrefix = process.env.REDIS_PREFIX || 'y';
const checkPermCallbackUrl = process.env.AUTH_PERM_CALLBACK!;
const bucketName = 'ydocs';

const store = new S3Storage(bucketName, {
    endpoint: process.env.S3_ENDPOINT!,
    port: Number(process.env.S3_PORT!),
    accessKey: process.env.S3_ACCESS_KEY!,
    secretKey: process.env.S3_SECRET_KEY!,
    useSSL: false,
    region: '',
});
try {
    // make sure the bucket exists
    await store.client.makeBucket(bucketName);
} catch (_) { }

yredis.createYWebsocketServer({ host, port, store, checkPermCallbackUrl, redisPrefix })
