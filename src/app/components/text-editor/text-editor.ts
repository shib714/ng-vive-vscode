import { ChangeDetectionStrategy, Component, signal, computed, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
})
export class TextEditorComponent {
  protected readonly maxLineLength = 79;
  protected readonly text = signal('');
  protected readonly cursorLine = signal(1);
  protected readonly cursorCol = signal(1);

  protected readonly charsRemaining = computed(() => {
    const lines = this.text().split('\n');
    const currentLine = lines[this.cursorLine() -1 ] || '';
    return this.maxLineLength - (currentLine.length ) ;
  });

  onInput(event: Event) {
   const textarea = event.target as HTMLTextAreaElement;

     
  this.text.set(textarea.value);
  this.updateCursorPosition(textarea);
  /**
  const lines = textarea.value.split('\n');
  const wrappedLines: string[] = [];
  for (const line of lines) {
    let currentLine = '';
    for (const word of line.split(/(\\s+)/)) { // keep spaces
      if (currentLine.replace(/\\s+$/, '').length + word.length > this.maxLineLength) {
        if (currentLine.trim().length > 0) {
          wrappedLines.push(currentLine.trimEnd());
          currentLine = '';
        }
      }
      currentLine += word;
    }
    if (currentLine.trim().length > 0 || line === '') {
      wrappedLines.push(currentLine.trimEnd());
    }
  }
  const wrapped = wrappedLines.join('\n');
  if (wrapped !== textarea.value) {
    textarea.value = wrapped;
  }
  this.text.set(wrapped);
  this.updateCursorPosition(textarea);
  **/
  }

  onSelect(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.updateCursorPosition(textarea);
  }

  updateCursorPosition(textarea: HTMLTextAreaElement) {
    const pos = textarea.selectionStart;
    const textUptoCursor = textarea.value.slice(0, pos);
    const lines = textUptoCursor.split('\n');
    this.cursorLine.set(lines.length);
    this.cursorCol.set(lines[lines.length - 1].length  + 1);
  }

  onClick(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  this.updateCursorPosition(textarea);
}

  format(command: string) {
    document.execCommand(command, false);
  }
}
