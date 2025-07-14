import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, signal, computed } from '@angular/core';
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

  onContentInput(event: Event) {
    const content = this.editorContent.nativeElement;
    const text = content.innerText;
    this.text.set(text);
    this.wrapLongLines();
    this.updateCursorPosition(event);
  }

  onKeyDown(event: KeyboardEvent) {
    const content = this.editorContent.nativeElement;
    if (event.key === 'Enter') {
      event.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Get the current position before inserting the break
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(content);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const currentText = preSelectionRange.toString();
        const currentLines = currentText.split('\n');
        const newLineNumber = currentLines.length + 1;
        
        // Insert the line break
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);

        // Update line and column numbers
        this.cursorLine.set(newLineNumber);
        this.cursorCol.set(1);

        // Update content and trigger wrap
        this.text.set(content.innerText);
        this.wrapLongLines();
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
    const range = selection?.getRangeAt(0);
    const cursorOffset = range?.startOffset || 0;

    const lines = content.innerText.split('\n');
    const wrappedLines = lines.map((line: string) => {
      if (line.length <= this.maxCharsPerLine) return line;
      
      const wrappedParts = [];
      let currentLine = '';
      let currentWord = '';
      let spacePrefix = '';

      const commitCurrentWord = () => {
        if (currentWord) {
          if ((currentLine + (currentLine ? ' ' : '') + currentWord).length > this.maxCharsPerLine) {
            if (currentLine) wrappedParts.push(currentLine);
            currentLine = spacePrefix + currentWord;
          } else {
            currentLine += (currentLine ? ' ' : '') + currentWord;
          }
          currentWord = '';
          spacePrefix = '';
        }
      };

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === ' ') {
          if (currentLine.length === 0 && currentWord.length === 0) {
            spacePrefix += ' ';
          } else {
            commitCurrentWord();
            spacePrefix = ' ';
          }
        } else {
          currentWord += char;
        }
      }

      // Handle any remaining word
      commitCurrentWord();
      if (currentLine) {
        wrappedParts.push(currentLine);
      }
      
      return wrappedParts.join('\n');
    });

    // Store cursor position and original text
    let originalOffset = 0;
    const originalText = content.innerText;
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(content);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      originalOffset = preSelectionRange.toString().length;
    }

    // Update content while preserving formatting
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content.innerHTML;
    tempDiv.innerText = wrappedLines.join('\n');
    content.innerHTML = tempDiv.innerHTML;

    // Calculate new cursor position
    if (selection && originalOffset > 0) {
      const newText = wrappedLines.join('\n');
      
      // Find the actual word break position in wrapped text
      let lastWordBreakPos = 0;
      let lastLineBreakPos = -1;
      let cursorLineIndex = 0;
      let cursorColumnPos = 0;
      
      // Track both original and wrapped text positions
      for (let i = 0; i < newText.length; i++) {
        if (i >= originalOffset) {
          // Found our target position
          cursorLineIndex = newText.substring(0, i).split('\n').length - 1;
          const lastLineStart = lastLineBreakPos + 1;
          cursorColumnPos = i - lastLineStart;
          break;
        }
        
        if (newText[i] === '\n') {
          lastLineBreakPos = i;
          if (i < originalOffset) {
            lastWordBreakPos = i;
          }
        }
      }
      
      // If we're at a position where text was just wrapped
      if (originalOffset > lastWordBreakPos && lastWordBreakPos > lastLineBreakPos) {
        cursorLineIndex++;
        cursorColumnPos = originalOffset - lastWordBreakPos - 1;
      }

      // Set cursor position in the DOM
      const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        null
      );

      let node: Node | null = walker.nextNode();
      let currentLength = 0;
      const targetOffset = lastLineBreakPos + 1 + cursorColumnPos;
      
      while (node) {
        const nodeLength = node.textContent?.length || 0;
        if (currentLength + nodeLength >= targetOffset) {
          const range = document.createRange();
          range.setStart(node, targetOffset - currentLength);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Update line and column signals
          this.cursorLine.set(cursorLineIndex + 1);
          this.cursorCol.set(cursorColumnPos + 1);
          break;
        }
        currentLength += nodeLength;
        node = walker.nextNode();
      }
    }
  }

  onSelect(event: Event) {
    this.updateCursorPosition(event);
  }

  updateCursorPosition(event: Event) {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;

    const content = this.editorContent.nativeElement;
    const cursorOffset = this.findCursorOffset(selection);
    const text = content.innerText;
    
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
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(this.editorContent.nativeElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    return preSelectionRange.toString().length;
  }

  format(command: string) {
    document.execCommand(command, false);
    this.editorContent.nativeElement.focus();
  }
}
