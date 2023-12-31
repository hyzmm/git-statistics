module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "xo",
        "xo-react"
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                '.eslintrc.{js,cjs}',
            ],
            parserOptions: {
                sourceType: 'script',
            },
        },
        {
            extends: [
                'xo-typescript',
            ],
            files: [
                '*.ts',
                '*.tsx',
            ],
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        "react/button-has-type": "off",
        "react/react-in-jsx-scope": "off",
        "default-case": "off",
        "react/no-array-index-key": "off",
    },
};
