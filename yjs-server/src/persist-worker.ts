import 'dotenv/config';
import type * as Y from 'yjs';
import * as yredis from '@y/redis';
import { S3Storage } from './storage-adapters/s3';

const redisPrefix = process.env.REDIS_PREFIX || 'y';
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
} catch (e) { }

const updateCallback = async (room: string, ydoc: Y.Doc) => {}

yredis.createWorker(store, redisPrefix, { updateCallback });
