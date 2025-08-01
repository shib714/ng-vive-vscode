import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Widget } from './widget';
import { By } from '@angular/platform-browser';
import { Component, inputBinding, outputBinding, signal, twoWayBinding } from '@angular/core';

//For details, please watch this video: https://www.youtube.com/watch?v=1GsUUP4A52E
//This test file is a comprehensive test suite for the Widget component, covering inputs, outputs, and two-way binding.
//It also demonstrates various testing patterns such as:
//Test Host Pattern, setInput() API, inputBinding(), outputBinding(), and twoWayBinding() APIs.

describe('Widget', () => {
  describe(`Testing Inputs`, () => {
    it(`Example with Test Host Pattern`, async () => {
      @Component({
        imports: [Widget],
        template: `<widget [title]="title()" [description]="description()"/>`,
      })
      class Wrapper {
        title = signal('Test Title');
        description = signal('Test Description.');
      }

      const fixture = TestBed.createComponent(Wrapper);
      fixture.detectChanges();

      const displayedTitle = fixture.debugElement.query(
        By.css('[data-testId="title"]')
      );
      const displayedDescription = fixture.debugElement.query(
        By.css('[data-testId="description"]')
      );
      expect(displayedTitle.nativeElement.innerText).toBe('Test Title');
      expect(displayedDescription.nativeElement.innerText).toBe('Test Description.');
    });

    it(`Example with setInput() API`, async () => {
      const fixture = TestBed.createComponent(Widget);

      fixture.componentRef.setInput('title', 'Test Title');
      fixture.componentRef.setInput('description', 'Test Description.');
      fixture.detectChanges();

      const displayedTitle = fixture.debugElement.query(
        By.css('[data-testId="title"]')
      );
      const displayedDescription = fixture.debugElement.query(
        By.css('[data-testId="description"]')
      );
      expect(displayedTitle.nativeElement.innerText).toBe('Test Title');
      expect(displayedDescription.nativeElement.innerText).toBe('Test Description.');
    });
    it(`Example with inputBinding() API`, async () => {
      const fixture = TestBed.createComponent(Widget,
        {
          bindings: [
            inputBinding('title', () => 'Test Title'),
            inputBinding('description', () => "Test Description."),
          ]
        }
      );
      fixture.detectChanges();

      const displayedTitle = fixture.debugElement.query(
        By.css('[data-testId="title"]')
      );
      const displayedDescription = fixture.debugElement.query(
        By.css('[data-testId="description"]')
      );
      expect(displayedTitle.nativeElement.innerText).toBe('Test Title');
      expect(displayedDescription.nativeElement.innerText).toBe('Test Description.');
    });

  })


  describe(`Testing Outputs`, () => {
    it(`Example with Test Host Pattern`, async () => {
      @Component({
        imports: [Widget],
        template: `<widget (closed)="isClosed.set(true)"/>`,
      })
      class Wrapper {
        isClosed = signal(false);
      }

      const fixture = TestBed.createComponent(Wrapper);
      expect(fixture.componentInstance.isClosed()).toBeFalse();

      const closeButton = fixture.debugElement.query(
        By.css('[data-testId="close-btn"]')
      );
      closeButton.nativeElement.click();
      expect(fixture.componentInstance.isClosed()).toBe(true);
    });

    it(`Example with a spy`, async () => {
      const fixture = TestBed.createComponent(Widget);
      const outputSpy = spyOn(fixture.componentInstance.closed, 'emit');

      const closeButton = fixture.debugElement.query(
        By.css('[data-testId="close-btn"]')
      );
      closeButton.nativeElement.click();
      expect(outputSpy).toHaveBeenCalled();

    });
    it(`Example with outputBinding() API`, async () => {
      const expectedOutput = signal(false);
      const fixture = TestBed.createComponent(Widget, {
        bindings: [
          outputBinding('closed', () => expectedOutput.set(true))
        ]
      });

      const closeButton = fixture.debugElement.query(
        By.css('[data-testId="close-btn"]')
      );
      //simulate a click on the close button
      closeButton.nativeElement.click();
      expect(expectedOutput()).toBe(true);
    });

  });

  describe(`Testing 2-Way-Binding`, () => {
    it(`Example with Test Host Pattern`, async () => {
      @Component({
        imports: [Widget],
        template: `<widget [(collapsed)]="isCollapsed" />`,
      })
      class Wrapper {
        isCollapsed = signal(false);
      }

      const fixture = TestBed.createComponent(Wrapper);
      fixture.detectChanges();

      const collapseButton = fixture.debugElement.query(
        By.css('[data-testId="collapse-btn"]')
      );
      collapseButton.nativeElement.click();
      expect(fixture.componentInstance.isCollapsed()).toBe(true);
    });

    it(`Should handle 2-way-binding`, async () => {
      @Component({
        imports: [Widget],
        template: `<widget [(collapsed)]="collapsed" />`,
      })
      class Wrapper {
        collapsed = signal(false);
      }
      const fixture = TestBed.createComponent(Wrapper);
      const wrapper = fixture.componentInstance;
      const widget: Widget = fixture.debugElement.query(By.directive(Widget)).componentInstance;

      //Wrapper.isCollapsed <- widget.collapsed synchronization
      widget.collapsed.set(true);
      fixture.detectChanges();
      expect(wrapper.collapsed()).toBe(true);


      //Wrapper.isCollapsed -> widget.collapsed synchronization
      wrapper.collapsed.set(false);
      fixture.detectChanges();
      expect(widget.collapsed()).toBe(false);
    });
    it(`Example with twoWayBinding() API`, async () => {
      const isCollapsed = signal(false);
      const fixture = TestBed.createComponent(Widget, {
        bindings: [
          twoWayBinding('collapsed', isCollapsed),
        ]
      });
      fixture.detectChanges();

      const collapseButton = fixture.debugElement.query(
        By.css('[data-testId="collapse-btn"]')
      );
      collapseButton.nativeElement.click();
      expect(fixture.componentInstance.collapsed()).toBe(true);
    });
  });
})


//Auto generated test for Widget component
// describe('Widget', () => {
//   let component: Widget;
//   let fixture: ComponentFixture<Widget>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [Widget]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(Widget);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
