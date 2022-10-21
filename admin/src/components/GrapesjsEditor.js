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
  const [editor, setEditor] = useState();
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
    });

    setEditor(editor);
  }, []);

  useEffect(() => {
    if (editor) {
      editor.on("update", () => {
        setHtml(editor.getHtml());
        setStyle(editor.getCss());
      });
    }

    return function cleanup() {
      if (editor) {
        const index = Grapesjs.editors.findIndex(
          (e) => e.Config.container === editor.Config.container
        );
        if (typeof index === "number" && index >= 0) {
          Grapesjs.editors.splice(index, 1);
        }
        editor.destroy();
      }
    };
  }, [editor]);

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
