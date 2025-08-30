import React, { useState, useCallback } from 'react';
import type { UploadedFileState } from '../types';

interface FileUploadProps {
  id: string;
  title: string;
  disabled: boolean;
  uploadedFiles: UploadedFileState[];
  isProcessing: boolean;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onSheetChange: (index: number, newSheet: string) => void;
  invalidFileNames?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  title,
  disabled,
  uploadedFiles,
  isProcessing,
  onAddFiles,
  onRemoveFile,
  onSheetChange,
  invalidFileNames = [],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAddFiles(Array.from(e.target.files));
      e.target.value = '';
    }
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
      onAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
      <label
        htmlFor={id}
        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {isProcessing && (
           <div className="absolute inset-0 bg-gray-500/30 dark:bg-gray-900/50 flex flex-col items-center justify-center rounded-lg z-10">
              <i className="fa-solid fa-spinner fa-spin fa-2x text-white"></i>
              <span className="mt-2 text-white font-medium">Dosyalar işleniyor...</span>
          </div>
        )}
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <i className="fa-solid fa-cloud-arrow-up fa-2x mb-4 text-gray-500 dark:text-gray-400"></i>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Excel dosyaları (.xlsx, .xls)</p>
        </div>
        <input id={id} type="file" className="hidden" multiple onChange={handleFileChange} accept=".xlsx, .xls, .csv" disabled={disabled || isProcessing} />
      </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
            {uploadedFiles.map((uploadedFile, index) => {
                const isInvalid = invalidFileNames.includes(uploadedFile.file.name);
                return (
                <div key={`${uploadedFile.file.name}-${index}`} className={`bg-gray-100 dark:bg-gray-700 p-3 rounded-md transition-all ${isInvalid ? 'ring-2 ring-red-500' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                            <i className="fa-solid fa-file-excel w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"></i>
                            <span className="text-gray-800 dark:text-gray-200 truncate font-medium text-sm">{uploadedFile.file.name}</span>
                        </div>
                        <button onClick={() => onRemoveFile(index)} disabled={disabled || isProcessing} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            <i className="fa-solid fa-trash w-4 h-4"></i>
                        </button>
                    </div>
                     {isInvalid && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1.5 font-semibold">
                            <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                            Kolon başlıkları uyumsuz!
                        </p>
                    )}
                    {uploadedFile.sheetNames.length > 0 && !isInvalid && (
                        <div className="mt-2">
                            <label htmlFor={`sheet-select-${id}-${index}`} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Çalışma Sayfası:</label>
                            <select
                                id={`sheet-select-${id}-${index}`}
                                value={uploadedFile.selectedSheet}
                                onChange={(e) => onSheetChange(index, e.target.value)}
                                disabled={disabled || isProcessing}
                                className="block w-full pl-3 pr-10 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            >
                                {uploadedFile.sheetNames.length > 1 && <option value="__ALL__">Tüm Sayfalar</option>}
                                {uploadedFile.sheetNames.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            )})}
        </div>
      )}
    </div>
  );
};

export default FileUpload;