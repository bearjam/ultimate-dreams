const withPlugins = require("next-compose-plugins")

const conf = {
  webpack: (config) => {
    config.module.rules.push({
      test: /react-spring/,
      sideEffects: true,
    })

    return config
  },
  images: {
    domains: ["source.unsplash.com", "images.unsplash.com"],
  },
}

module.exports = withPlugins(
  [],
  // [require("next-transpile-modules")(["three", "@react-three/drei"])],
  conf
)
