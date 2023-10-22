import {TProcessHtmlOpts} from "@GSC/types";


export const DefaultProcessHtmlOpts:TProcessHtmlOpts = {
  minify: {
    removeComments: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    collapseBooleanAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
  },
  parse: {
    interactiveElements: [
      `a`,
      `input`,
      `button`,
      `select`,
      `textarea`,
      `option`
    ],
    textElements: [
      `label`,
      `h1`,
      `h2`
    ],
    allowedAttrs: [
      `id`,
      `for`,
      `class`,
      `name`,
      `type`,
      `value`,
      `tabindex`,
      `aria-labelledby`,
      `aria-label`,
      `label`,
      `placeholder`,
      `title`,
      `alt`,
      `src`,
      `role`,
    ],
    allowedRoles: [
      `button`,
      `checkbox`,
      `search`,
      `textbox`,
      `tab`
    ],
  }
};
