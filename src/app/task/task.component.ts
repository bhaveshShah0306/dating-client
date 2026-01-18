import { Component } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  template: `
    <section (mouseOver)="showSecretMessage()">
      There's a secret message for you, hover to reveal 👀
      {{ message }}
    </section>
  `,
})
export class TaskComponent {
  message = '';

  showSecretMessage() {
    this.message = 'Way to go 🚀';
  }
}
