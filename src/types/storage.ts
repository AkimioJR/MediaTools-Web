export interface StorageProviderInterface {
  storage_type: string;
  transfer_type: string[];
}

export interface FileInfo {
  storage_type: string;
  path: string;
  name: string;
  ext: string;
  size: number;
  is_dir: boolean;
  mod_time: string;
}
