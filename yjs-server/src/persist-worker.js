import 'dotenv/config';
import * as yredis from '@y/redis';
import { createS3Storage } from '@y/redis/storage/s3';

const redisPrefix = process.env.REDIS_PREFIX || 'y'

const bucketName = 'ydocs'
const store = createS3Storage(bucketName)
try {
    // make sure the bucket exists
    await store.client.makeBucket(bucketName)
} catch (e) { }

let ydocUpdateCallback = null;
if (ydocUpdateCallback != null && ydocUpdateCallback.slice(-1) !== '/') {
    ydocUpdateCallback += '/'
}

/**
 * @type {(room: string, ydoc: import('yjs').Doc) => Promise<void>}
 */
const updateCallback = async (room, ydoc) => {
    if (ydocUpdateCallback != null) {
        // call YDOC_UPDATE_CALLBACK here
        const formData = new FormData()
        // @todo only convert ydoc to updatev2 once
        formData.append('ydoc', new Blob([Y.encodeStateAsUpdateV2(ydoc)]))
        // @todo should add a timeout to fetch (see fetch signal abortcontroller)
        const res = await fetch(new URL(room, ydocUpdateCallback), { body: formData, method: 'PUT' })
        if (!res.ok) {
            console.error(`Issue sending data to YDOC_UPDATE_CALLBACK. status="${res.status}" statusText="${res.statusText}"`)
        }
    }
}

yredis.createWorker(store, redisPrefix, {
    updateCallback
})
