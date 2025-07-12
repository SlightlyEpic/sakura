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
        avra \
        git \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Includes for avra
RUN git clone --depth 1 https://github.com/Ro5bert/avra.git /tmp/avra && \
    mkdir -p /usr/local/share/avra/includes && \
    cp /tmp/avra/includes/*.inc /usr/local/share/avra/includes && \
    rm -rf /tmp/avra

COPY --from=builder /go-service /usr/local/bin/go-service
EXPOSE 4001

ENTRYPOINT ["go-service"]
