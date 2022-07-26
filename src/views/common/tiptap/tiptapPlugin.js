import { v4 as uuidv4 } from 'uuid';
const SIZE_PATTERN = /([\d.]+)(px || pt)/i;
export const Alignment = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify'
}
const ALIGN_PATTERN = new RegExp(`(${Alignment.left}|${Alignment.center}|${Alignment.right}|${Alignment.justify})`);
const DEFAULT_LINE_HEIGHT = '100%';
const NUMBER_VALUE_PATTERN = /^\d+(.\d+)?$/;


export function convertToPX (styleValue) {
  const matches = styleValue.match(SIZE_PATTERN);
  if (styleValue.indexOf('pt') > -1) {
    const value = matches[1] * 4 / 3;
    return value;
  } else {
    const value = matches[1];
    return value;
  }
}

export function headingToDOM (node) {
  const {
    textAlign,
    indent,
    lineHeight
  } = node.attrs;

  let style = '';
  const attrs = {};

  if (textAlign && textAlign !== 'left') {
    style += `text-align: ${textAlign};`;
  }

  if (indent) {
    attrs['data-indent'] = indent;
  }

  if (lineHeight) {
    const cssLineHeight = transformLineHeightToCSS(lineHeight);
    style += `line-height: ${cssLineHeight};`;
  }
  // 添加id
  attrs['id'] = uuidv4()

  style && (attrs.style = style);

  return ['p', attrs, 0];
}

export function getAttrs (dom) {
  const attrs = paragraphNodeSpecGetAttrs(dom);
  const level = dom.nodeName.match(/[H|h](\d)/)[1];
  attrs.level = Number(level);
  return attrs;
}


export const ParagraphNodeSpec = {
  attrs: {
    textAlign: { default: null },
    indent: { default: null },
    lineHeight: { default: null },
  },
  content: 'inline*',
  group: 'block',
  parseDOM: [{
    tag: 'p',
    paragraphNodeSpecGetAttrs,
  }],
  toDOM,
};

function paragraphNodeSpecGetAttrs (dom) {
  let {
    textAlign,
    lineHeight,
  } = dom.style;

  let align = dom.getAttribute('data-text-align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  const indent = parseInt(dom.getAttribute('data-indent'), 10) || 0;

  lineHeight = transformCSStoLineHeight(lineHeight) || null;

  return {
    textAlign: align,
    indent,
    lineHeight,
  };
}

function toDOM (node) {
  const {
    textAlign,
    indent,
    lineHeight,
  } = node.attrs;

  let style = '';
  const attrs = {};

  if (textAlign && textAlign !== 'left') {
    style += `text-align: ${textAlign};`;
  }

  if (indent) {
    attrs['data-indent'] = indent;
  }

  if (lineHeight) {
    const cssLineHeight = transformLineHeightToCSS(lineHeight);
    style += `line-height: ${cssLineHeight};`;
  }

  style && (attrs.style = style);

  return ['p', attrs, 0];
}

function transformCSStoLineHeight (value) {
  if (!value) return '';
  if (value === DEFAULT_LINE_HEIGHT) return '';

  let strValue = value;

  if (NUMBER_VALUE_PATTERN.test(value)) {
    const numValue = parseFloat(value);
    strValue = String(Math.round(numValue * 100)) + '%';
    if (strValue === DEFAULT_LINE_HEIGHT) return '';
  }

  return parseFloat(strValue) / LINE_HEIGHT_100 + '%';
}