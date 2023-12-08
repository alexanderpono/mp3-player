module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                debug: false,
                useBuiltIns: 'entry',
                corejs: '2.6.11'
            }
        ],
        '@babel/preset-react',
        '@babel/preset-typescript'
    ],
    plugins: [
        // [
        //     '@babel/plugin-proposal-decorators',
        //     {
        //         legacy: true
        //     }
        // ],
        '@babel/plugin-proposal-class-properties',
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@src': './src',
                    '@ui-src': './ui-src',
                    '@config': '../mp3-player-config'
                }
            }
        ]
    ]
};
