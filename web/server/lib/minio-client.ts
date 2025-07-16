import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: (process.env.S3_ENDPOINT as string).split(':')[0],
    port: Number((process.env.S3_ENDPOINT as string).split(':')[1]),
    useSSL: false,
    accessKey: process.env.S3_ACCESS_KEY_ID,
    secretKey: process.env.S3_ACCESS_KEY_SECRET,
});
