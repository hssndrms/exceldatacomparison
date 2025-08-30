
export type ExcelRow = Record<string, string | number | boolean | Date>;

export interface ProcessedExcelData {
  data: ExcelRow[];
  headers: string[];
}

export interface KeyPair {
  id: string; // React key prop için
  columnA: string | null;
  columnB: string | null;
}

export interface ComparisonConfig {
  keyPairs: KeyPair[];
  compareColumnA: string | null;
  compareColumnB: string | null;
  outputColumns: string[];
}

export interface UploadedFileState {
    file: File;
    sheetNames: string[];
    selectedSheet: string; // Sayfa adı veya tüm sayfalar için '__ALL__'
}
