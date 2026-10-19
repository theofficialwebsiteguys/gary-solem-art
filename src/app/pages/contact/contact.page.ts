import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { artworkById } from '../../content/artworks';
import { CONTACT, hasContactMethod } from '../../content/contact.config';
import { CONTACT_PAGE } from '../../content/page-copy';
import { ArtworkImageComponent } from '../../shared/artwork-image/artwork-image.component';
import { PageIntroComponent } from '../../shared/page-intro/page-intro.component';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact-page',
  imports: [PageIntroComponent, ReactiveFormsModule, ArtworkImageComponent],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  protected readonly copy = CONTACT_PAGE;
  protected readonly contact = CONTACT;
  protected readonly available = hasContactMethod();
  protected readonly image = artworkById(CONTACT_PAGE.image.artworkId);
  protected readonly telHref = CONTACT.phone ? 'tel:' + CONTACT.phone.replace(/[^\d+]/g, '') : null;

  protected readonly state = signal<SubmitState>('idle');
  protected readonly showErrors = signal(false);
  private readonly statusMessage = viewChild<ElementRef<HTMLElement>>('status');
  private readonly formElement = viewChild<ElementRef<HTMLFormElement>>('formEl');
  private readonly injector = inject(Injector);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(200)] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(5000)] }),
  });

  protected invalid(name: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.showErrors());
  }

  protected async submit(): Promise<void> {
    if (!CONTACT.formEndpoint || this.state() === 'submitting') return;
    if (this.form.invalid) {
      this.showErrors.set(true);
      this.form.markAllAsTouched();
      // Move focus to the first field that needs attention once errors are rendered.
      this.afterRender(() => this.formElement()?.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    this.state.set('submitting');
    try {
      const response = await fetch(CONTACT.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(this.form.getRawValue()),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.state.set('success');
      this.form.reset();
      this.showErrors.set(false);
    } catch {
      this.state.set('error');
    }
    this.afterRender(() => this.statusMessage()?.nativeElement.focus());
  }

  private afterRender(fn: () => void): void {
    afterNextRender(fn, { injector: this.injector });
  }
}
