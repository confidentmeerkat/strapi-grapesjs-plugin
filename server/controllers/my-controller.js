'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('grapesjs-editor')
      .service('myService')
      .getWelcomeMessage();
  },
});
