package util

import "fmt"

type CliOptions struct {
	Debug             bool   `doc:"Enable debug logging" default:"false"`
	Host              string `doc:"Hostname to listen on." default:"127.0.0.1"`
	Port              int    `doc:"Port to listen on." short:"p" default:"4001"`
	S3EndpointUrl     string `doc:"S3 endpoint to fetch files from"`
	S3AccessKeyId     string `doc:"S3 access credentials"`
	S3SecretAccessKey string `doc:"S3 access credentials"`
}

func (o *CliOptions) String() string {
	return fmt.Sprintf(
		"{Debug:%v Host:%s Port:%d S3EndpointUrl:%s S3AccessKeyId:*** S3SecretAccessKey:***}",
		o.Debug, o.Host, o.Port, o.S3EndpointUrl,
	)
}

func (o *CliOptions) Validate() map[string]string {
	problems := make(map[string]string)

	if len(o.S3EndpointUrl) == 0 {
		problems["S3EndpointUrl"] = "missing value"
	}
	if len(o.S3AccessKeyId) == 0 {
		problems["S3AccessKeyId"] = "missing value"
	}
	if len(o.S3SecretAccessKey) == 0 {
		problems["S3SecretAccessKey"] = "missing value"
	}

	return problems
}
