import { buildSync } from 'esbuild';

buildSync({
  format: 'esm',
  entryPoints: ['./index.ts'],
  outdir: './dist',
})