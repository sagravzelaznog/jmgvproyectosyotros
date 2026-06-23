import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Element, Text } from 'hast';

// Plugin to find $...$ and $$...$$ in text nodes and convert them to math elements
// This solves the problem of remark-math ignoring text inside HTML blocks
const rehypeInlineMath: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (parent.type === 'element' && (parent.tagName === 'code' || parent.tagName === 'pre')) return;

      const value = node.value;
      // Regex to find $$...$$ or $...$
      // We need to match $$ first so it doesn't get confused by $
      const regex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;
      const parts = value.split(regex);

      if (parts.length === 1) return; // no math found

      const newNodes: (Text | Element)[] = parts.map((part) => {
        if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['math', 'math-display'] },
            children: [{ type: 'text', value: part.slice(2, -2) }],
          };
        } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          return {
            type: 'element',
            tagName: 'span',
            properties: { className: ['math', 'math-inline'] },
            children: [{ type: 'text', value: part.slice(1, -1) }],
          };
        } else {
          return { type: 'text', value: part };
        }
      });

      // Replace the current text node with the new nodes
      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length;
    });
  };
};

export default rehypeInlineMath;
