import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/yredis-server.ts', 'src/persist-worker.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    format: 'esm',
})
