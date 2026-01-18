import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { ImageService } from '../core/image.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements OnDestroy {
  imageUrl: string = '';
  isLoading: boolean = false;

  constructor(
    private imageService: ImageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.imageService
      .getEnhancedBedroomImage()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (url) => {
          this.imageUrl = url;
          console.log('Enhanced image URL set in component:', url);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching image:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}
