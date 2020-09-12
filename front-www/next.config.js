const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL || '';

module.exports = {
  assetPrefix: ASSET_URL,
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
};
