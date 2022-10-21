"use strict";

module.exports = ({ strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: "GrapesjsEditor",
    plugin: "strapi-grapesjs-plugin",
    type: "json",
  });
};
