# Proposal: Add RichText Screen

## Summary
Add new screen "richText" to demo screenset. A universal content block that detects content type from API and renders accordingly:
- **Markdown (md)** -> Milkdown editor (reuses editor screen patterns)
- **Code (ts, py, json)** -> CodeViewer/CodeEditor (reuses git screen patterns)
- **Other** -> plain text editor fallback

All content is fetched/saved through a dedicated richtext API service.

## Details
- Screenset: demo
- Screen name: richText
- Add to menu: Y

## Component Plan
- REQUIRED: Use @hai3/uikit components first; local uikit only if missing.
- Reuse existing `CodeViewer` and `CodeEditor` from `uikit/composite/`.
- Reuse Milkdown integration pattern from editor screen (lazy-loaded).
- screens/richtext/components/:
  - `ContentBlock` - main orchestrator that receives content + type, delegates to renderer
  - `MdRenderer` - markdown mode using Milkdown (MilkdownProvider + editor setup)
  - `CodeRenderer` - code mode using CodeViewer (read) / CodeEditor (edit)
  - `PlainTextRenderer` - plain text textarea fallback
  - `ContentToolbar` - toolbar with content type indicator, edit/save controls

## Data Flow
- New domain: `richtext`
- API: `RichtextApiService` -> fetch content items, save content
- Events: richtextEvents.ts (contentLoaded, contentUpdated, contentSaved, contentLoadFailed)
- Slice: richtextSlice.ts (current content item, content string, contentType, loading, saving, error)
- Effects: richtextEffects.ts (bridge events -> slice)
- Actions: richtextActions.ts (loadContent, updateContent, saveContent)
- Screen dispatches actions, never direct slice updates
- Content type detection based on API response field `contentType: 'md' | 'ts' | 'py' | 'json' | 'plain'`
