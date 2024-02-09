FROM golang:1.22.0 as builder
COPY . .
RUN go build -o /bin/app .

FROM debian:bookworm
COPY --from=builder /bin/app /bin/app
CMD ["/bin/app"]
