// landing-page.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../core/image.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements OnDestroy, AfterViewInit {
  @ViewChild('heroImage') heroImage?: ElementRef<HTMLImageElement>;
  @ViewChild('heroContent') heroContent?: ElementRef<HTMLDivElement>;
  @ViewChild('heroOverlay') heroOverlay?: ElementRef<HTMLDivElement>;

  imageUrl = signal<string>('');
  isLoading = signal<boolean>(true);
  scrollY = signal<number>(0);

  // Cloudinary optimized image URL
  cloudinaryImageUrl =
    'https://res.cloudinary.com/dgooj7git/image/upload/e_improve:indoor:50/q_auto:best,f_auto,w_1920,h_1080,c_fill,g_auto/bedroom_a6l7g8.jpg';

  features: FeatureCard[] = [
    {
      icon: '✨',
      title: 'Premium Venues',
      description:
        'Curated selection of 5-star hotels and exclusive locations for sophisticated encounters',
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description:
        'Discreet, secure platform designed for professionals seeking meaningful connections',
    },
    {
      icon: '💎',
      title: 'Verified Members',
      description:
        'Exclusive community of verified individuals who value quality and authenticity',
    },
  ];

  constructor(
    private imageService: ImageService,
    private cdr: ChangeDetectorRef,
  ) {
    // Load image from your API if needed
    this.imageService
      .getEnhancedBedroomImage()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (url) => {
          this.imageUrl.set(url);
          this.isLoading.set(false);
          console.log('Enhanced image URL set:', url);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching image:', error);
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
      });
  }

  ngAfterViewInit(): void {
    // Trigger initial animation
    setTimeout(() => {
      this.checkFeatureVisibility();
    }, 100);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrolled = window.pageYOffset;
    this.scrollY.set(scrolled);

    this.applyParallaxEffects(scrolled);
    this.checkFeatureVisibility();
  }

  private applyParallaxEffects(scrolled: number): void {
    if (!this.heroImage || !this.heroContent || !this.heroOverlay) return;

    const heroHeight = window.innerHeight;

    // Parallax effect on image (moves slower than scroll)
    if (scrolled < heroHeight) {
      const imageEl = this.heroImage.nativeElement;
      const contentEl = this.heroContent.nativeElement;
      const overlayEl = this.heroOverlay.nativeElement;

      // Image parallax
      const parallaxSpeed = 0.5;
      const scale = 1 + scrolled * 0.0002;
      imageEl.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(${scale})`;

      // Overlay opacity increase
      const overlayOpacity = 0.7 + (scrolled / heroHeight) * 0.3;
      overlayEl.style.opacity = overlayOpacity.toString();

      // Content fade out
      const fadeStart = heroHeight * 0.3;
      if (scrolled > fadeStart) {
        const fadeProgress = (scrolled - fadeStart) / (heroHeight - fadeStart);
        contentEl.style.opacity = (1 - fadeProgress).toString();
        contentEl.style.transform = `translateY(-${fadeProgress * 50}px)`;
      } else {
        contentEl.style.opacity = '1';
        contentEl.style.transform = 'translateY(0)';
      }
    }
  }

  private checkFeatureVisibility(): void {
    const featureCards = document.querySelectorAll('.feature-card');
    const windowHeight = window.innerHeight;

    featureCards.forEach((card, index) => {
      const cardTop = card.getBoundingClientRect().top;

      if (cardTop < windowHeight * 0.8) {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 150);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.imageUrl()) {
      URL.revokeObjectURL(this.imageUrl());
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
