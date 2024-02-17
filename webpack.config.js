const { createBasicConfig } = require('./config/create-basic-config');
const { loadStyles } = require('./config/modules');

module.exports = environments => {
    const { dev, prod } = environments || {};
    const { NODE_ENV = 'development' } = process.env;

    const isDev = !!dev && NODE_ENV === 'development';
    const isProd = !!prod && NODE_ENV === 'production';

    return loadStyles(
        createBasicConfig({
            isDev,
            isProd,
            lang: 'zh-cn',
            title: 'React Experiments',
        }),
        {
            isDev,
            styleType: 'less',
        }
    ).toConfig();
};
