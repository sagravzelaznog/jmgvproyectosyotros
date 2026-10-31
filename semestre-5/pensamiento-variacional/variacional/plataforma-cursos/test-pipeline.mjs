import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

import { visit } from 'unist-util-visit';
const rehypeInlineMath = () => (tree) => {
  visit(tree, 'text', (node, index, parent) => {
    if (!parent || typeof index !== 'number') return;
    if (parent.type === 'element' && (parent.tagName === 'code' || parent.tagName === 'pre')) return;
    const regex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;
    const parts = node.value.split(regex);
    if (parts.length === 1) return;
    const newNodes = parts.map((part) => {
      if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
        return { type: 'element', tagName: 'div', properties: { className: ['math', 'math-display'] }, children: [{ type: 'text', value: part.slice(2, -2) }] };
      } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        return { type: 'element', tagName: 'span', properties: { className: ['math', 'math-inline'] }, children: [{ type: 'text', value: part.slice(1, -1) }] };
      } else {
        return { type: 'text', value: part };
      }
    });
    parent.children.splice(index, 1, ...newNodes);
    return index + newNodes.length;
  });
};

const markdown = '<div>Las grúas torre soportan toneladas de acero gracias al equilibrio dinámico entre la <strong>fuerza de Tensión ($\\vec{F}_T$)</strong> en los cables y la <strong>Gravedad/Peso ($\\vec{F}_W$)</strong> jalando hacia abajo.</div>';

unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeInlineMath)
  .use(rehypeKatex)
  .use(rehypeStringify)
  .process(markdown)
  .then(file => console.log(String(file)))
  .catch(console.error);
