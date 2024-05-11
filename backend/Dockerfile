FROM rust:1.78-buster as builder
COPY . .
RUN cargo build --release

FROM debian:bookworm
COPY --from=builder /target/release/backend /usr/local/bin/backend
CMD ["/usr/local/bin/backend"]
