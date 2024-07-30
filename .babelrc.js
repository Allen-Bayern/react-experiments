const basicBabelConfig = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.36',
            },
        ],
        [
            '@babel/preset-react',
            {
                automatic: true,
            },
        ],
        '@babel/preset-typescript',
    ],
};

module.exports = basicBabelConfig;
