import type { Configuration } from "webpack"

import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin"

import { rules } from "./webpack.rules"

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
}
