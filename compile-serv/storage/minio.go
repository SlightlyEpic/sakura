package storage

import (
	"context"
	"fmt"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

const userFilesBucketName = "sakura-user-files"

// Will probably also contain the redis client in the future
type StorageClient struct {
	Client *minio.Client
}

func NewClient(endpoint, accessKeyId, secretAccessKey string) (StorageClient, error) {
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyId, secretAccessKey, ""),
		Secure: false,
	})

	return StorageClient{Client: minioClient}, err
}

func (s StorageClient) PullFileToLocal(ctx context.Context, objectName string) (localPath string, err error) {
	localPath = fmt.Sprintf("/tmp/user-files/%s", objectName)
	err = s.Client.FGetObject(ctx, userFilesBucketName, objectName, localPath, minio.GetObjectOptions{})
	return
}

// TODO: Add support for pulling entire directories, would require a database
