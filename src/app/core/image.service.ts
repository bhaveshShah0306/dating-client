import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageService {
  imageUrl: string = 'https://localhost:5001/api/image/bedroom-enhanced';

  constructor(private http: HttpClient) {}

  getEnhancedBedroomImage(): Observable<string> {
    const url = 'https://localhost:5001/api/image/bedroom-enhanced';
    // Remove the generic type when using responseType: 'blob'
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((blob: Blob) => {
        console.log('Received blob:', blob);
        console.log('Blob size:', blob.size);
        console.log('Blob type:', blob.type);
        const objectUrl = URL.createObjectURL(blob); // Fix: 'constpos' -> 'const'
        this.imageUrl = objectUrl;
        console.log('Created object URL:', objectUrl);
        return objectUrl;
        +6;
      }),
    );
  }
}
