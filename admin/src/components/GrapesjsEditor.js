import React, { useEffect, useState } from "react";
import Grapesjs from "grapesjs/dist/grapes.min";
import plugin from "grapesjs-preset-webpage";
import blocksBasic from "grapesjs-blocks-basic";
import {
  Field,
  FieldHint,
  FieldError,
  FieldLabel,
} from "@strapi/design-system/Field";
import { Stack } from "@strapi/design-system/Stack";
import { useIntl } from "react-intl";
import "grapesjs/dist/css/grapes.min.css";
import Axios from "axios";
import FormData from "form-data";
import de from "grapesjs/locale/de";

const GrapesjsEditor = ({
  value = JSON.stringify({}),
  onChange,
  name,
  error,
  description,
  required,
  labelAction,
  intlLabel,
} = {}) => {
  const parsedValue = JSON.parse(value);

  const [html, setHtml] = useState(parsedValue.html);
  const [style, setStyle] = useState(parsedValue.style);

  const { formatMessage } = useIntl();


  useEffect(() => {
    const editor = Grapesjs.init({
      container: "#gjs",
      storageManager: false,
      plugins: [plugin, blocksBasic],
      pluginsOpts: [plugin, blocksBasic],
      components: parsedValue.html,
      style: parsedValue.style,
      assetManager: {
        upload: "/api/upload",
        uploadName: "files",
        async uploadFile(event) {
          const formData = new FormData();
          for (let file of event.target.files) {
            formData.append("files", file);
          }
          this.em.trigger("asset:upload:start");

          const { data } = await Axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          this.em.trigger("asset:upload:response", {
            data: data.map(({ url }) => url),
          });

          return "success";
        },
      },
      i18n: {},
    });

    editor.I18n.addMessages({ de });
    editor.I18n.setLocale(
      window.localStorage.getItem("strapi-admin-language") ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        "en"
    );

    editor.on("asset:upload:response", (response) => {
      editor.AssetManager.add(response.data);
    });

    editor.on("update", () => {
      setHtml(editor.getHtml());
      setStyle(editor.getCss());
    });

    return function cleanup() {
      const index = Grapesjs.editors.findIndex(
        (e) => e.Config.container === editor.Config.container
      );
      if (typeof index === "number" && index >= 0) {
        Grapesjs.editors.splice(index, 1);
      }
      editor.destroy();
    };
  }, []);

  useEffect(() => {
    onChange({ target: { name, value: JSON.stringify({ html, style }) } });
  }, [html, style]);

  return (
    <Field
      name={name}
      id={name}
      // GenericInput calls formatMessage and returns a string for the error
      error={error}
      hint={description && formatMessage(description)}
    >
      <Stack spacing={1}>
        <FieldLabel action={labelAction} required={required}>
          {formatMessage(intlLabel)}
        </FieldLabel>
        <div id="gjs"></div> <FieldHint />
        <FieldError />
      </Stack>
    </Field>
  );
};

export default GrapesjsEditor;
