module.exports = {
  plugins: [
    "tailwindcss",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "system-ui-font-family": true,
          "custom-selectors": true,
          "nesting-rules": true,
        },
      },
    ],
  ],
};
