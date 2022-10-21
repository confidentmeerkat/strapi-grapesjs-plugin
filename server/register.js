"use strict";

module.exports = ({ strapi }) => {
  // registeration phase
  strapi.customFields.register({
    name: "GrapesjsEditor",
    plugin: "grapesjs-editor",
    type: "json",
  });
};
