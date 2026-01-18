import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageService } from '../core/image.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnDestroy {
  imageUrl: string = '';
  isLoading: boolean = false;

  constructor(private imageService: ImageService) {
    this.imageService
      .getEnhancedBedroomImage()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (url) => {
          this.imageUrl = url;
        },
        error: (error) => {
          console.error('Error fetching image:', error);
          this.isLoading = false;
        },
      });
  }
  ngOnDestroy(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}
