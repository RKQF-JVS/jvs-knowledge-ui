import {Heading, FontSize} from 'element-tiptap'
import {convertToPX, headingToDOM, ParagraphNodeSpec, getAttrs} from './tiptapPlugin'

export class myHeading extends Heading {
  constructor(props,myAttribute) {
    super(props)
  }
  get schema () {
    return {
      ...ParagraphNodeSpec,
      attrs: {
        ...ParagraphNodeSpec.attrs,
        level: {
          default: 1,
        },
      },
      defining: true,
      draggable: false,
      parseDOM: this.options.levels.map((level) => ({
        tag: `h${level}`,
        getAttrs,
      })),
      toDOM(node) {
        const dom = headingToDOM(node);
        const level = node.attrs.level || 1;
        dom[0] = `h${level}`;
        return dom;
      },
    }
  }
}
export class myFontSize extends FontSize {
  constructor(props,myAttribute) {
    super(props)
  }
  get schema () {
    return {
      attrs: {
        px: '',
      },
      inline: true,
      group: 'inline',
      parseDOM: [
        {
          style: 'font-size',
          getAttrs: (fontSize) => {
            const attrs = {};
            if (!fontSize) return attrs;
            const px = convertToPX(fontSize);
            if (!px) return attrs;
            return {
              px,
            };
          },
        },
      ],
      toDOM (node) {
        const { px } = node.attrs;
        let attrs = {};
        if (px) {
          attrs.style = `font-size: ${px}px;line-height:100%;`;
        }
        return ['span', attrs, 0];
      },
    };
  }
}