import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { catchError, map, Observable } from 'rxjs';
import { UploadProgress } from '../../interfaces/CloudinaryUploadProgress.interface';
import { CloudinaryUploadResponse } from '../../interfaces/CloudinaryUploadResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = environment.cloudinary.cloudName;
  private uploadPreset: string = environment.cloudinary.uploadPreset;
  private uploadUrl: string = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(
    file: File,
    options?: {
      folder?: string;
      tags?: string[];
      transformation?: string;
    }
  ): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    if (options?.folder) {
      formData.append('folder', options.folder);
    }
    if (options?.tags) {
      formData.append('tags', options.tags.join(','));
    }
    if (options?.transformation) {
      formData.append('transformation', options.transformation);
    }
    formData.append('timestamp', Date.now().toString());
    return this.http
      .post<CloudinaryUploadResponse>(this.uploadUrl, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: HttpEvent<CloudinaryUploadResponse>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = event.total
              ? Math.round((100 * event.loaded) / event.total)
              : 0;
            return { progress };
          } else if (event.type === HttpEventType.Response) {
            return {
              progress: 100,
              response: event.body as CloudinaryUploadResponse,
            };
          }
          return { progress: 0 };
        }),
        catchError((error) => {
          console.error('Cloudinary upload error:', error);
          throw error;
        })
      );
  }
  getOptimizedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
      gravity?: 'face' | 'center' | 'auto';
      quality?: 'auto' | number;
      format?: 'auto' | 'jpg' | 'png' | 'webp';
    }
  ): string {
    const transformations: string[] = [];

    if (options?.width || options?.height) {
      const w = options.width ? `w_${options.width}` : '';
      const h = options.height ? `h_${options.height}` : '';
      const c = options.crop ? `c_${options.crop}` : 'c_fill';
      const g = options.gravity ? `g_${options.gravity}` : '';
      transformations.push([w, h, c, g].filter(Boolean).join(','));
    }

    if (options?.quality) {
      transformations.push(`q_${options.quality}`);
    }

    if (options?.format) {
      transformations.push(`f_${options.format}`);
    }

    const transformation =
      transformations.length > 0 ? transformations.join('/') + '/' : '';

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}${publicId}`;
  }

  /**
   * Delete image from Cloudinary (requires server-side for security)
   * This should be called through your .NET API
   */
  deleteImage(publicId: string): Observable<any> {
    // Note: Direct deletion requires authentication
    // Better to handle this through your .NET API
    return this.http.delete(
      `${environment.apiUrl}/users/delete-photo-by-public-id`,
      {
        params: { publicId },
      }
    );
  }
}
