// Base File interface
export interface File {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  object: 'file';
  status: 'indexed' | 'not_indexed';
  name?: string;
  originalName?: string;
  bytes?: number;
  purpose?: string;
  mimetype?: string;
  key?: string;
  path?: string;
  bucket?: string;
  url?: string;
  metadata?: Record<string, any>;
}

// List options
export interface ListFilesOptions {
  limit?: number;
  createdAtGt?: string;
  createdAtLt?: string;
  createdAtGe?: string;
  createdAtLe?: string;
  updatedAtGt?: string;
  updatedAtLt?: string;
  updatedAtGe?: string;
  updatedAtLe?: string;
}

// Response types
export interface FileResponse {
  success: boolean;
  data?: File;
  error?: string;
}

export interface FileListResponse {
  success: boolean;
  data?: File[];
  error?: string;
}

// Upload types
export interface FileUploadOptions {
  name?: string;
  purpose?: string;
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  success: boolean;
  data?: File;
  error?: string;
}

// Delete response
export interface DeleteFileResponse {
  success: boolean;
  data?: File;
  error?: string;
}

// Update types
export interface UpdateFileDto {
  name?: string;
}

export interface UpdateFileResponse {
  success: boolean;
  data?: File;
  error?: string;
} 