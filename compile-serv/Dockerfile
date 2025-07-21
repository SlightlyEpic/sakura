FROM rust:1.88-slim AS ycrdt-builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        pkg-config \
        git \
        clang \
        libc-dev \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
RUN git clone --depth 1 https://github.com/y-crdt/y-crdt.git

WORKDIR /src/y-crdt/yffi
RUN cargo build --release

# Copy out the shared library and header to an output directory
RUN mkdir -p /out/include && \
    mkdir -p /out/lib && \
    cp /src/y-crdt/target/release/libyrs.* /out/lib && \
    cp /src/y-crdt/tests-ffi/include/libyrs.h /out/include

# ---------------------------------------------------------------------------------------------
FROM golang:1.24.4 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

# Copy y-crdt shared library and header from ycrdt-builder
COPY --from=ycrdt-builder /out/lib/libyrs.* /usr/local/lib/
COPY --from=ycrdt-builder /out/include/libyrs.h /usr/local/include/

ENV CGO_ENABLED=1
ENV LD_LIBRARY_PATH=/usr/local/lib

COPY . .

RUN go build -o /go-service cmd/main.go

# ---------------------------------------------------------------------------------------------
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
