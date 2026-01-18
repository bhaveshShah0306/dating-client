import { CloudinaryUploadResponse } from './CloudinaryUploadResponse.interface';

export interface UploadProgress {
  progress: number;
  response?: CloudinaryUploadResponse;
}
