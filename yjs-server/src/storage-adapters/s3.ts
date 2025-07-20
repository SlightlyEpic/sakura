import * as Y from 'yjs'
import * as minio from 'minio'
import Stream from 'node:stream';
import { v4 as uuidv4 } from 'uuid';
import type { AbstractStorage } from '@y/redis/storage/s3';

export function encodeS3ObjectName(room: string, docid: string, r?: string) {
    if(!r) r = uuidv4();
    return `${encodeURIComponent(room)}/${encodeURIComponent(docid)}/${r}`;
}

export function decodeS3ObjectName(objectName: string) {
    const match = objectName.match(/(.*)\/(.*)\/(.*)$/);
    if (match === null) {
        throw new Error('Malformed y:room stream name!');
    }
    return {
        room: decodeURIComponent(match[1]),
        docid: decodeURIComponent(match[2]),
        r: match[3]
    };
}

function readStream<T extends ArrayLike<number>>(stream: Stream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer<ArrayBuffer>[] = [];
        stream.on('data', (chunk: T) => chunks.push(Buffer.from(chunk)));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

export type S3StorageOptions = {
    endpoint: string,
    port: number,
    useSSL: boolean,
    accessKey: string,
    secretKey: string,
    region?: string,
}

export class S3Storage implements AbstractStorage {
    private bucketName: string;
    public client: minio.Client;

    constructor(bucketName: string, opts: S3StorageOptions) {
        this.bucketName = bucketName
        this.client = new minio.Client({
            endPoint: opts.endpoint,
            port: opts.port,
            useSSL: opts.useSSL,
            accessKey: opts.accessKey,
            secretKey: opts.secretKey,
            region: opts.region,
        });
    }

    async persistDoc(room: string, docname: string, ydoc: Y.Doc) {
        const objectName = encodeS3ObjectName(room, docname)
        await this.client.putObject(this.bucketName, objectName, Buffer.from(Y.encodeStateAsUpdateV2(ydoc)))
    }

    async retrieveDoc(room: string, docname: string): Promise<{
        doc: Uint8Array,
        references: string[] | null,
    } | null> {
        console.log(`s3 adapter: retrieving doc room=${room} docname=${docname}`);
        const objNames = await this.client.listObjectsV2(this.bucketName, encodeS3ObjectName(room, docname), true).toArray();
        const references = objNames.map(obj => obj.name);
        console.log(`s3 adapter: retrieved doc room=${room} docname=${docname}`);

        if (references.length === 0) return null;

        let updates = await Promise.all(references.map(ref => this.client.getObject(this.bucketName, ref).then(readStream)));
        updates = updates.filter(update => update != null);
        console.log(`s3 adapter: retrieved doc room=${room} docname=${docname} updatesLen=${updates.length}`);
        return { doc: Y.mergeUpdatesV2(updates), references };
    }

    async retrieveStateVector(room: string, docname: string): Promise<Uint8Array | null> {
        const r = await this.retrieveDoc(room, docname);
        return r ? Y.encodeStateVectorFromUpdateV2(r.doc) : null;
    }

    async deleteReferences(_room: string, _docname: string, storeReferences: string[]) {
        await this.client.removeObjects(this.bucketName, storeReferences);
    }

    async destroy() { }
}
