# Phase 1

Write an HTTP server which exposes two routes:

- `/slow`: Returns an object containing a single `hash` property, which is obtained by computing the SHA256 hash of a buffer 100 MB random bytes.
- `/fast`: Returns an object containing a single `time` property, which the current epoch time (elapsed time since midnight of Jan 1st 1970) in milliseconds.
