FROM golang:1.24.4 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /go-service cmd/main.go

FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        avr-libc \
        gcc-avr \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /go-service /usr/local/bin/go-service
EXPOSE 4001

ENTRYPOINT ["go-service"]
