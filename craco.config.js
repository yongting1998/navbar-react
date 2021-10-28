const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#62c2d3',
                          '@link-color': '#62c2d3',
                          '@body-background' : '#f9f9fb'},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};