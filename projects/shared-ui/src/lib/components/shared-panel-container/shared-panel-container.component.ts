import { Component, input } from '@angular/core';

@Component({
  selector: 'shared-panel-container',
  imports: [],
  template: `
    <div novalidate [class]="class()">
      <div class="bg-white dark:bg-[#18181B] rounded-sm p-8">
        @if (titleLabel()) {
          <div class="mb-4">
            <h2 class="text-2xl font-semibold text-grey-600">{{ titleLabel() }}</h2>
          </div>
        }
        <ng-content></ng-content>
      </div>

      <div class="form-actions">
        <ng-content select="[formActions]"></ng-content>
      </div>
    </div>
  `,
})
export class SharedPanelContainerComponent {
  // Optional inputs for customization
  titleLabel = input<string>('');
  class = input<string>('md:px-[6rem] px-[0.5rem] py-[1rem]');
}
