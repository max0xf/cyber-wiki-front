/**
 * activeBlockPlugin - Highlights the innermost block node containing the cursor
 * Adds a CSS class to the active block for subtle Obsidian-style background styling.
 */

import { $prose } from '@milkdown/kit/utils';
import { Plugin, PluginKey } from '@milkdown/kit/prose/state';
import { Decoration, DecorationSet } from '@milkdown/kit/prose/view';

const activeBlockKey = new PluginKey('active-block');

export const activeBlockPlugin = $prose(() => {
  return new Plugin({
    key: activeBlockKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, oldSet, _oldState, newState) {
        if (!tr.docChanged && !tr.selectionSet) return oldSet;

        const { selection, doc } = newState;
        const { $from } = selection;

        if ($from.depth < 1) return DecorationSet.empty;

        // Find the innermost block node (e.g. paragraph, list_item, heading)
        let depth = $from.depth;
        while (depth > 0 && $from.node(depth).isInline) {
          depth--;
        }
        if (depth < 1) return DecorationSet.empty;

        const blockPos = $from.before(depth);
        const blockNode = doc.nodeAt(blockPos);
        if (!blockNode) return DecorationSet.empty;

        const deco = Decoration.node(
          blockPos,
          blockPos + blockNode.nodeSize,
          { class: 'milkdown-active-block' },
        );

        return DecorationSet.create(doc, [deco]);
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });
});
