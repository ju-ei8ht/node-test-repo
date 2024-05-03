await Bun.build({
  entrypoints: ['./src/routes/index.ts'],
  outdir: './out',
  naming: {
    asset: '[name].[ext]'
  },
  target: 'bun'
});