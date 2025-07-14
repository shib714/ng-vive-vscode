import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, signal, computed, OnInit } from '@angular/core';
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
export class TextEditorComponent implements OnInit {

  @ViewChild('editorContent', { static: true }) editorContent!: ElementRef;

  protected readonly maxCharsPerLine = 79;
  protected readonly text = signal('');
  protected readonly cursorLine = signal(1);
  protected readonly cursorCol = signal(1);


  protected readonly charsRemaining = computed(() => {
    const lines = this.text().split('\n');
    const currentLine = lines[this.cursorLine() - 1] || '';
    return Math.max(0, this.maxCharsPerLine - currentLine.length);
  });

  ngOnInit() {
    // Initialize the editor with some content to ensure it's properly set up
    if (this.editorContent && this.editorContent.nativeElement) {
      this.editorContent.nativeElement.textContent = '';
      this.editorContent.nativeElement.focus();
    }
  }

  onContentInput(event: Event) {
    const content = this.editorContent.nativeElement;
    const text = content.textContent || '';
    this.text.set(text);
    this.updateCursorPosition(event);
    
    // Always apply line wrapping after content changes
    setTimeout(() => {
      this.applyLineWrapping();
    }, 10);
  }

  onKeyDown(event: KeyboardEvent) {
    const content = this.editorContent.nativeElement;
    if (event.key === 'Enter') {
      event.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        // Save offset before inserting newline
        const offsetBefore = this.findCursorOffset(selection);
        const range = selection.getRangeAt(0);
        // Insert a newline character
        const textNode = document.createTextNode('\n');
        range.deleteContents();
        range.insertNode(textNode);
        // Normalize the DOM to merge text nodes
        content.normalize();
        // Restore cursor to offset+1 (after the inserted newline)
        this.restoreCursorPositionByOffset(selection, content.textContent || '', offsetBefore + 1);
        // Update text and cursor position
        this.text.set(content.textContent || '');
        this.updateCursorPositionDisplay();
      }
      return;
    }
    // Handle formatting keyboard shortcuts
    if (event.ctrlKey) {
      switch(event.key.toLowerCase()) {
        case 'b':
          event.preventDefault();
          this.format('bold');
          break;
        case 'i':
          event.preventDefault();
          this.format('italic');
          break;
        case 'u':
          event.preventDefault();
          this.format('underline');
          break;
      }
    }
  }

  wrapLongLines() {
    const content = this.editorContent.nativeElement;
    const selection = window.getSelection();
    
    // Get the current text content
    const text = content.textContent || '';
    const lines = text.split('\n');
    
    // Store absolute character offset and word info before wrapping
    let originalOffset = 0;
    let wordAtCursor = '';
    let wordStartOffset = 0;
    if (selection && selection.rangeCount > 0) {
      originalOffset = this.findCursorOffset(selection);
      // Find the word at the cursor
      const textBeforeCursor = text.substring(0, originalOffset);
      const textAfterCursor = text.substring(originalOffset);
      // Find start of word
      const startMatch = textBeforeCursor.match(/(\w+)$/);
      wordStartOffset = startMatch ? originalOffset - startMatch[1].length : originalOffset;
      // Find end of word
      const endMatch = textAfterCursor.match(/^(\w+)/);
      wordAtCursor = (startMatch ? startMatch[1] : '') + (endMatch ? endMatch[1] : '');
    }
    
    let wrappedLines: string[] = [];
    let wrappedWordLineIndex = -1;
    let wrappedWordCol = -1;
    let charCount = 0;
    
    lines.forEach((line: string) => {
      if (line.length <= this.maxCharsPerLine) {
        wrappedLines.push(line);
        charCount += line.length + 1; // +1 for newline
        return;
      }
      const wrappedParts = [];
      const match = line.match(/^(\s*)/);
      const leadingSpaces = match ? match[1] : '';
      const contentWithoutSpaces = line.substring(leadingSpaces.length);
      const words = contentWithoutSpaces.split(/(\s+)/);
      let currentLine = leadingSpaces;
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.length === 0) continue;
        const isSpace = /^\s+$/.test(word);
        if (isSpace) {
          if (currentLine.length + word.length <= this.maxCharsPerLine) {
            currentLine += word;
          }
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
        // If the cursor was in this word before wrapping, record its new position
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
      if (currentLine.length > 0) {
        wrappedParts.push(currentLine);
      }
      wrappedLines = wrappedLines.concat(wrappedParts);
      charCount += 1; // for the newline
    });
    const newText = wrappedLines.join('\n');
    content.textContent = newText;
    // Restore cursor position
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

  // Restore cursor position after wrapping using line and column
  private restoreCursorPositionByLineCol(selection: Selection, newText: string, line: number, col: number) {
    const content = this.editorContent.nativeElement;
    const lines = newText.split('\n');
    const targetLine = Math.min(line, lines.length);
    const targetCol = Math.min(col, lines[targetLine - 1]?.length || 0);
    let targetOffset = 0;
    for (let i = 0; i < targetLine - 1; i++) {
      targetOffset += lines[i].length + 1;
    }
    targetOffset += targetCol;
    const walker = document.createTreeWalker(
      content,
      NodeFilter.SHOW_TEXT,
      null
    );
    let node: Node | null = walker.nextNode();
    let currentLength = 0;
    while (node) {
      const nodeLength = node.textContent?.length || 0;
      if (currentLength + nodeLength >= targetOffset) {
        const range = document.createRange();
        const nodeOffset = targetOffset - currentLength;
        const finalOffset = Math.min(nodeOffset, nodeLength);
        range.setStart(node, finalOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        break;
      }
      currentLength += nodeLength;
      node = walker.nextNode();
    }
    if (!node) {
      const lastNode = content.lastChild;
      if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        range.setStart(lastNode, lastNode.textContent?.length || 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  // Restore cursor position after wrapping using absolute offset
  private restoreCursorPositionByOffset(selection: Selection, newText: string, originalOffset: number) {
    const content = this.editorContent.nativeElement;
    // Clamp offset to new text length
    let targetOffset = Math.min(originalOffset, newText.length);
    // Walk through text nodes to find the target position
    const walker = document.createTreeWalker(
      content,
      NodeFilter.SHOW_TEXT,
      null
    );
    let node: Node | null = walker.nextNode();
    let currentLength = 0;
    while (node) {
      const nodeLength = node.textContent?.length || 0;
      if (currentLength + nodeLength >= targetOffset) {
        const range = document.createRange();
        const nodeOffset = targetOffset - currentLength;
        const finalOffset = Math.min(nodeOffset, nodeLength);
        range.setStart(node, finalOffset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        break;
      }
      currentLength += nodeLength;
      node = walker.nextNode();
    }
    // If we didn't find a suitable position, place cursor at the end
    if (!node) {
      const lastNode = content.lastChild;
      if (lastNode && lastNode.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        range.setStart(lastNode, lastNode.textContent?.length || 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  onSelect(event: Event) {
    this.updateCursorPosition(event);
  }

  onEditorClick(event: Event) {
    this.ensureFocus();
    this.updateCursorPosition(event);
  }

  updateCursorPosition(event: Event) {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;

    const content = this.editorContent.nativeElement;
    const cursorOffset = this.findCursorOffset(selection);
    const text = content.textContent || '';
    
    // Split the text at cursor position and count lines
    const textBeforeCursor = text.substring(0, cursorOffset);
    const lines = textBeforeCursor.split('\n');
    const lineCount = lines.length;
    
    // Handle the case where cursor is right after a line break
    const isAfterLineBreak = textBeforeCursor.endsWith('\n');
    const colCount = isAfterLineBreak ? 1 : lines[lines.length - 1].length + 1;

    // Update line and column numbers
    this.cursorLine.set(lineCount);
    this.cursorCol.set(colCount);
  }

  private findCursorOffset(selection: Selection): number {
    const content = this.editorContent.nativeElement;
    const range = selection.getRangeAt(0);
    
    let offset = 0;
    
    // Walk through all text nodes to calculate the offset
    const walker = document.createTreeWalker(
      content,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node: Node | null = walker.nextNode();
    
    while (node) {
      if (node === range.startContainer) {
        // Found the target node
        offset += range.startOffset;
        break;
      }
      
      if (node.nodeType === Node.TEXT_NODE) {
        offset += (node as Text).length;
      }
      
      node = walker.nextNode();
    }
    
    return offset;
  }

  format(command: string) {
    document.execCommand(command, false);
    this.editorContent.nativeElement.focus();
  }

  // Ensure the editor maintains focus after operations
  private ensureFocus() {
    if (document.activeElement !== this.editorContent.nativeElement) {
      this.editorContent.nativeElement.focus();
    }
  }



  // Apply line wrapping
  private applyLineWrapping() {
    // Use a small delay to ensure the content is fully updated
    setTimeout(() => {
      this.wrapLongLines();
    }, 0);
  }

  // Manual line wrapping trigger
  manualWrapLines() {
    this.wrapLongLines();
  }

  // Manual line break insertion
  insertLineBreak() {
    const content = this.editorContent.nativeElement;
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      // Insert a newline character
      const textNode = document.createTextNode('\n');
      range.deleteContents();
      range.insertNode(textNode);
      
      // Move cursor after the newline
      const newRange = document.createRange();
      newRange.setStartAfter(textNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      // Update text and cursor position
      this.text.set(content.textContent || '');
      this.updateCursorPositionDisplay();
    }
    
    this.editorContent.nativeElement.focus();
  }

  // Move cursor to the end of the current line
  private moveCursorToEndOfLine() {
    const content = this.editorContent.nativeElement;
    const selection = window.getSelection();
    
    if (!selection) return;
    
    // Create a new range at the end of the content
    const range = document.createRange();
    range.selectNodeContents(content);
    range.collapse(false); // false means collapse to end
    
    // Set the selection to this range
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Update cursor position display
    this.updateCursorPositionDisplay();
  }



  // Update cursor position display without event
  private updateCursorPositionDisplay() {
    const content = this.editorContent.nativeElement;
    const selection = window.getSelection();
    
    if (!selection || !selection.anchorNode) return;
    
    // Get text content directly (newlines are preserved)
    const text = content.textContent || '';
    
    // Calculate cursor offset
    const cursorOffset = this.findCursorOffset(selection);
    
    // Count lines and columns
    const textBeforeCursor = text.substring(0, cursorOffset);
    const lines = textBeforeCursor.split('\n');
    const lineCount = lines.length;
    const colCount = lines[lines.length - 1].length + 1;
    
    // Update line and column numbers
    this.cursorLine.set(lineCount);
    this.cursorCol.set(colCount);
  }
}
