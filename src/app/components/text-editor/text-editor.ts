import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class TextEditorComponent {
  // --- Signals and DOM reference ---
  maxCharsPerLine = 79;
  text = signal('');
  cursorLine = signal(1);
  cursorCol = signal(1);
  editorContentEl = signal<HTMLElement | null>(null);
  @ViewChild('editorContentDiv', { static: true, read: ElementRef })
  set editorContentDivRef(ref: ElementRef<HTMLElement> | null) {
    this.editorContentEl.set(ref?.nativeElement ?? null);
  }

  // --- Computed for remaining chars ---
  charsRemaining = computed(() => {
    const lines = this.text().split('\n');
    const currentLine = lines[this.cursorLine() - 1] || '';
    return Math.max(0, this.maxCharsPerLine - currentLine.length);
  });

  // --- Input, Keydown, and Formatting ---
  onContentInput() {
    const content = this.editorContentEl();
    if (!content) return;
    this.text.set(content.textContent || '');
    this.updateCursorPosition();
    setTimeout(() => this.applyLineWrapping(), 10);
  }

  onKeyDown(event: KeyboardEvent) {
    const content = this.editorContentEl();
    if (!content) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      this.insertLineBreak();
      return;
    }
    if (event.ctrlKey) {
      const key = event.key.toLowerCase();
      if (['b', 'i', 'u'].includes(key)) {
        event.preventDefault();
        const cmd = { b: 'bold', i: 'italic', u: 'underline' }[key] || 'bold';
        this.format(cmd);
      }
    }
  }

  // --- Word wrapping logic ---
  wrapLongLines() {
    const content = this.editorContentEl();
    if (!content) return;
    const selection = window.getSelection();
    const text = content.textContent || '';
    const lines = text.split('\n');
    // Track cursor position and word before wrapping
    let originalOffset = 0, wordAtCursor = '', wordStartOffset = 0;
    if (selection && selection.rangeCount > 0) {
      originalOffset = this.findCursorOffset(selection);
      const textBefore = text.substring(0, originalOffset);
      const textAfter = text.substring(originalOffset);
      const startMatch = textBefore.match(/(\w+)$/);
      wordStartOffset = startMatch ? originalOffset - startMatch[1].length : originalOffset;
      const endMatch = textAfter.match(/^(\w+)/);
      wordAtCursor = (startMatch ? startMatch[1] : '') + (endMatch ? endMatch[1] : '');
    }
    let wrappedLines: string[] = [], wrappedWordLineIndex = -1, wrappedWordCol = -1, charCount = 0;
    lines.forEach(line => {
      if (line.length <= this.maxCharsPerLine) {
        wrappedLines.push(line);
        charCount += line.length + 1;
        return;
      }
      const wrappedParts = [];
      const match = line.match(/^(\s*)/);
      const leadingSpaces = match ? match[1] : '';
      const contentWithoutSpaces = line.substring(leadingSpaces.length);
      const words = contentWithoutSpaces.split(/(\s+)/);
      let currentLine = leadingSpaces;
      for (const word of words) {
        if (!word) continue;
        if (/^\s+$/.test(word)) {
          if (currentLine.length + word.length <= this.maxCharsPerLine) currentLine += word;
        } else {
          const potentialLine = currentLine + word;
          if (potentialLine.length > this.maxCharsPerLine) {
            if (currentLine.length > leadingSpaces.length) {
              wrappedParts.push(currentLine);
              currentLine = leadingSpaces + word;
            } else {
              currentLine = potentialLine;
            }
          } else {
            currentLine = potentialLine;
          }
        }
        // Track new cursor position if wrapping the word at the cursor
        if (
          wordAtCursor &&
          originalOffset >= charCount &&
          originalOffset <= charCount + word.length &&
          word.replace(/\W/g, '') === wordAtCursor.replace(/\W/g, '')
        ) {
          wrappedWordLineIndex = wrappedLines.length + wrappedParts.length;
          wrappedWordCol = currentLine.length;
        }
        charCount += word.length;
      }
      if (currentLine.length > 0) wrappedParts.push(currentLine);
      wrappedLines = wrappedLines.concat(wrappedParts);
      charCount += 1;
    });
    const newText = wrappedLines.join('\n');
    content.textContent = newText;
    // Restore cursor position after wrapping
    if (selection && originalOffset > 0) {
      if (wrappedWordLineIndex !== -1 && wrappedWordCol !== -1) {
        this.restoreCursorPositionByLineCol(selection, newText, wrappedWordLineIndex + 1, wrappedWordCol);
      } else {
        this.restoreCursorPositionByOffset(selection, newText, originalOffset);
      }
    }
    this.text.set(newText);
    this.updateCursorPositionDisplay();
  }

  // --- Cursor restoration helpers ---
  private restoreCursorPositionByLineCol(selection: Selection, newText: string, line: number, col: number) {
    const content = this.editorContentEl();
    if (!content) return;
    const lines = newText.split('\n');
    const targetLine = Math.min(line, lines.length);
    const targetCol = Math.min(col, lines[targetLine - 1]?.length || 0);
    let targetOffset = 0;
    for (let i = 0; i < targetLine - 1; i++) targetOffset += lines[i].length + 1;
    targetOffset += targetCol;
    this.restoreCursorPositionByOffset(selection, newText, targetOffset);
  }

  private restoreCursorPositionByOffset(selection: Selection, newText: string, originalOffset: number) {
    const content = this.editorContentEl();
    if (!content) return;
    let targetOffset = Math.min(originalOffset, newText.length);
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
    let node: Node | null = walker.nextNode(), currentLength = 0;
    while (node) {
      const nodeLength = node.textContent?.length || 0;
      if (currentLength + nodeLength >= targetOffset) {
        const range = document.createRange();
        range.setStart(node, Math.min(targetOffset - currentLength, nodeLength));
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      currentLength += nodeLength;
      node = walker.nextNode();
    }
    // Fallback: place cursor at end
    const lastNode = content.lastChild;
    if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
      const range = document.createRange();
      range.setStart(lastNode, lastNode.textContent?.length || 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  // --- Selection/cursor update helpers ---
  onSelect() { this.updateCursorPosition(); }
  onEditorClick() { this.ensureFocus(); this.updateCursorPosition(); }

  updateCursorPosition() {
    // Fix: Adjust line count if cursor is at start of new line after Enter (last line is empty)
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    const content = this.editorContentEl();
    if (!content) return;
    const cursorOffset = this.findCursorOffset(selection);
    const text = content.textContent || '';
    const textBeforeCursor = text.substring(0, cursorOffset);
    const lines = textBeforeCursor.split('\n');
    const isAfterLineBreak = textBeforeCursor.endsWith('\n');
    let lineCount = lines.length;
    if (isAfterLineBreak && lines[lines.length - 1] === '') {
      lineCount -= 1;
    }
    const colCount = isAfterLineBreak ? 1 : lines[lines.length - 1].length + 1;
    this.cursorLine.set(lineCount);
    this.cursorCol.set(colCount);
  }

  private findCursorOffset(selection: Selection): number {
    const content = this.editorContentEl();
    if (!content) return 0;
    const range = selection.getRangeAt(0);
    let offset = 0;
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
    let node: Node | null = walker.nextNode();
    while (node) {
      if (node === range.startContainer) {
        offset += range.startOffset;
        break;
      }
      if (node.nodeType === Node.TEXT_NODE) offset += (node as Text).length;
      node = walker.nextNode();
    }
    return offset;
  }

  // --- Formatting and focus helpers ---
  format(command: string) {
    document.execCommand(command, false);
    const content = this.editorContentEl();
    if (content) content.focus();
  }

  private ensureFocus() {
    const content = this.editorContentEl();
    if (content && document.activeElement !== content) content.focus();
  }

  // --- Wrapping and line break helpers ---
  private applyLineWrapping() { setTimeout(() => this.wrapLongLines(), 0); }
  manualWrapLines() { this.wrapLongLines(); }

  insertLineBreak() {
    const content = this.editorContentEl();
    if (!content) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = document.createTextNode('\n');
      range.deleteContents();
      range.insertNode(textNode);
      const newRange = document.createRange();
      newRange.setStartAfter(textNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      this.text.set(content.textContent || '');
      this.updateCursorPositionDisplay();
    }
    content.focus();
  }

  private moveCursorToEndOfLine() {
    const content = this.editorContentEl();
    if (!content) return;
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(content);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    this.updateCursorPositionDisplay();
  }

  // --- Update cursor position display without event ---
  private updateCursorPositionDisplay() {
    // Fix: Adjust line count if cursor is at start of new line after Enter (last line is empty)
    const content = this.editorContentEl();
    if (!content) return;
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;
    const text = content.textContent || '';
    const cursorOffset = this.findCursorOffset(selection);
    const textBeforeCursor = text.substring(0, cursorOffset);
    const lines = textBeforeCursor.split('\n');
    const isAfterLineBreak = textBeforeCursor.endsWith('\n');
    let lineCount = lines.length;
    if (isAfterLineBreak && lines[lines.length - 1] === '') {
      lineCount -= 1;
    }
    const colCount = isAfterLineBreak ? 1 : lines[lines.length - 1].length + 1;
    this.cursorLine.set(lineCount);
    this.cursorCol.set(colCount);
  }
}
