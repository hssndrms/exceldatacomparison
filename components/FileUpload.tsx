import React, { useState, useCallback, useEffect } from 'react';
import { getExcelSheetNames, readExcelFiles } from '../services/excelService';
import type { ProcessedExcelData, UploadedFileState } from '../types';

interface FileUploadProps {
  id: string;
  title: string;
  onFilesProcessed: (data: ProcessedExcelData) => void;
  setProcessingError: (error: string | null) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, title, onFilesProcessed, setProcessingError, disabled }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const processAllFiles = useCallback(async (filesToProcess: UploadedFileState[]) => {
      if (disabled) return;
      setProcessingError(null);
      if (filesToProcess.length > 0) {
          try {
              const processedData = await readExcelFiles(filesToProcess);
              onFilesProcessed(processedData);
          } catch (err) {
              const errorMsg = err instanceof Error ? err.message : String(err);
              setProcessingError(`Dosya okunurken hata: ${errorMsg}`);
              onFilesProcessed({ data: [], headers: [] });
          }
      } else {
          onFilesProcessed({ data: [], headers: [] });
      }
  }, [onFilesProcessed, setProcessingError, disabled]);
  
  const handleNewFiles = useCallback(async (newFiles: File[]) => {
      if (disabled) return;
      const newUploadedFiles: UploadedFileState[] = [];
      let firstFileHeaders: string[] | null = null;

      for (const file of newFiles) {
          try {
              const sheetNames = await getExcelSheetNames(file);
              newUploadedFiles.push({ file, sheetNames, selectedSheet: sheetNames.length > 0 ? sheetNames[0] : '' });
          } catch (err) {
              const errorMsg = err instanceof Error ? err.message : String(err);
              setProcessingError(`Excel sayfa adları okunurken hata: ${errorMsg}`);
          }
      }
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      // Process all files together
      processAllFiles([...uploadedFiles, ...newUploadedFiles]);
  }, [disabled, setProcessingError, processAllFiles, uploadedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleNewFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset input for re-uploading the same file
    }
  };

  const handleSheetChange = (index: number, sheet: string) => {
    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles[index].selectedSheet = sheet;
    setUploadedFiles(newUploadedFiles);
    processAllFiles(newUploadedFiles);
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    processAllFiles(newFiles);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
      <label
        htmlFor={id}
        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <i className="fa-solid fa-cloud-arrow-up fa-2x mb-4 text-gray-500 dark:text-gray-400"></i>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Excel dosyaları (.xlsx, .xls)</p>
        </div>
        <input id={id} type="file" className="hidden" multiple onChange={handleFileChange} accept=".xlsx, .xls, .csv" disabled={disabled} />
      </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
            {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                            <i className="fa-solid fa-file-excel w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"></i>
                            <span className="text-gray-800 dark:text-gray-200 truncate font-medium text-sm">{uploadedFile.file.name}</span>
                        </div>
                        <button onClick={() => removeFile(index)} disabled={disabled} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            <i className="fa-solid fa-trash w-4 h-4"></i>
                        </button>
                    </div>
                    {uploadedFile.sheetNames.length > 0 && (
                        <div className="mt-2">
                            <label htmlFor={`sheet-select-${id}-${index}`} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Çalışma Sayfası:</label>
                            <select
                                id={`sheet-select-${id}-${index}`}
                                value={uploadedFile.selectedSheet}
                                onChange={(e) => handleSheetChange(index, e.target.value)}
                                disabled={disabled}
                                className="block w-full pl-3 pr-10 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            >
                                {uploadedFile.sheetNames.length > 1 && <option value="__ALL__">Tüm Sayfalar</option>}
                                {uploadedFile.sheetNames.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;