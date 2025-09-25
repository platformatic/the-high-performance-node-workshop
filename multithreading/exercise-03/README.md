# Phase 2

Pick the server written in Phase 2 and modify it such that:

- It uses a pool of five workers instead of just one. Workers are used in a round-robin fashion.
- The responses are received by using `Atomics.waitAsync` and `SharedArrayBuffer`.
