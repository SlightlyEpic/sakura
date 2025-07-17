import 'dotenv/config';
import * as yredis from '@y/redis';
import { createS3Storage } from '@y/redis/storage/s3';

const port = Number(process.env.PORT || '3002');
const redisPrefix = process.env.REDIS_PREFIX || 'y';
const checkPermCallbackUrl = process.env.AUTH_PERM_CALLBACK;

const bucketName = 'ydocs';
const store = createS3Storage(bucketName);
try {
    // make sure the bucket exists
    await store.client.makeBucket(bucketName);
} catch (_) { }

yredis.createYWebsocketServer({ port, store, checkPermCallbackUrl, redisPrefix })
