import React, { useState, useEffect, useCallback } from 'react';
import type { ProcessedExcelData, ComparisonConfig, ExcelRow, UploadedFileState } from './types';
import FileUpload from './components/FileUpload';
import ConfigurationStep from './components/ConfigurationStep';
import ResultsTable from './components/ResultsTable';
import Toast, { ToastData } from './components/Toast';
import { getExcelSheetNames, readExcelFiles, validateFileHeaders } from './services/excelService';
import { v4 as uuidv4 } from 'uuid';

const initialConfig: ComparisonConfig = {
  keyPairs: [{id: uuidv4(), columnA: null, columnB: null }],
  compareColumnA: null,
  compareColumnB: null,
  outputColumns: [],
};

function App() {
  const [step, setStep] = useState(1);
  const [dataA, setDataA] = useState<ProcessedExcelData>({ data: [], headers: [] });
  const [dataB, setDataB] = useState<ProcessedExcelData>({ data: [], headers: [] });
  
  const [sourceFiles, setSourceFiles] = useState<UploadedFileState[]>([]);
  const [targetFiles, setTargetFiles] = useState<UploadedFileState[]>([]);
  
  const [invalidSourceFiles, setInvalidSourceFiles] = useState<string[]>([]);
  const [invalidTargetFiles, setInvalidTargetFiles] = useState<string[]>([]);

  const [isProcessingSource, setIsProcessingSource] = useState(false);
  const [isProcessingTarget, setIsProcessingTarget] = useState(false);

  const [config, setConfig] = useState<ComparisonConfig>(initialConfig);

  const [results, setResults] = useState<ExcelRow[] | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: 'error' | 'info' = 'error') => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const handleReset = () => {
    setStep(1);
    setDataA({ data: [], headers: [] });
    setDataB({ data: [], headers: [] });
    setSourceFiles([]);
    setTargetFiles([]);
    setInvalidSourceFiles([]);
    setInvalidTargetFiles([]);
    setConfig(initialConfig);
    setResults(null);
    setIsComparing(false);
    setError(null);
  };

  const handleAddFiles = async (files: File[], type: 'source' | 'target') => {
    const setFileList = type === 'source' ? setSourceFiles : setTargetFiles;
    const setInvalidList = type === 'source' ? setInvalidSourceFiles : setInvalidTargetFiles;
    const setIsProcessing = type === 'source' ? setIsProcessingSource : setIsProcessingTarget;

    setIsProcessing(true);
    setInvalidList([]);
    const newUploadedFiles: UploadedFileState[] = [];
    for (const file of files) {
        try {
            const sheetNames = await getExcelSheetNames(file);
            newUploadedFiles.push({ file, sheetNames, selectedSheet: sheetNames.length > 1 ? '__ALL__' : (sheetNames[0] || '') });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            addToast(`Excel sayfa adları okunurken hata: ${errorMsg}`);
        }
    }
    setFileList(prev => [...prev, ...newUploadedFiles]);
    setIsProcessing(false);
  };

  const handleRemoveFile = (index: number, type: 'source' | 'target') => {
      const setFileList = type === 'source' ? setSourceFiles : setTargetFiles;
      const setInvalidList = type === 'source' ? setInvalidSourceFiles : setInvalidTargetFiles;
      setFileList(prev => prev.filter((_, i) => i !== index));
      setInvalidList([]);
  };

  const handleSheetChange = (index: number, newSheet: string, type: 'source' | 'target') => {
      const setFileList = type === 'source' ? setSourceFiles : setTargetFiles;
      const setInvalidList = type === 'source' ? setInvalidSourceFiles : setInvalidTargetFiles;
      setFileList(prev => prev.map((file, i) => i === index ? { ...file, selectedSheet: newSheet } : file));
      setInvalidList([]);
  };
  
  const handleValidateAndProceed = async () => {
    setInvalidSourceFiles([]);
    setInvalidTargetFiles([]);
    setError(null);

    setIsProcessingSource(true);
    setIsProcessingTarget(true);

    const [invalidSource, invalidTarget] = await Promise.all([
        validateFileHeaders(sourceFiles),
        validateFileHeaders(targetFiles)
    ]);
    
    let hasError = false;
    if (invalidSource.length > 0) {
        setInvalidSourceFiles(invalidSource);
        hasError = true;
    }
    if (invalidTarget.length > 0) {
        setInvalidTargetFiles(invalidTarget);
        hasError = true;
    }

    if (hasError) {
        addToast("Devam etmeden önce lütfen kolon başlıkları uyumsuz olan dosyaları düzeltin veya kaldırın.", "error");
        setIsProcessingSource(false);
        setIsProcessingTarget(false);
        return;
    }

    try {
        const [sourceResult, targetResult] = await Promise.all([
            readExcelFiles(sourceFiles),
            readExcelFiles(targetFiles)
        ]);
        setDataA(sourceResult);
        setDataB(targetResult);
        setStep(2);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Dosya okunurken hata: ${errorMsg}`);
    } finally {
      setIsProcessingSource(false);
      setIsProcessingTarget(false);
    }
  };
  
  const handleCompare = () => {
    if (!dataA || !dataB || !config.compareColumnA || !config.compareColumnB || config.keyPairs.length === 0 || config.keyPairs.some(p => !p.columnA || !p.columnB)) {
      setError("Lütfen karşılaştırma için tüm gerekli alanları seçtiğinizden emin olun.");
      return;
    }
    setError(null);
    setIsComparing(true);

    setTimeout(() => {
      try {
        const { keyPairs, compareColumnA, compareColumnB, outputColumns } = config;

        const sourceKeyColNames = keyPairs.map(p => p.columnA!).filter(Boolean);
        const prefixedSourceKeyCols = sourceKeyColNames.map(c => `Kaynak: ${c}`);
        const targetKeyColNames = keyPairs.map(p => p.columnB!).filter(Boolean);
        const prefixedTargetKeyCols = targetKeyColNames.map(c => `Hedef: ${c}`);
        
        const allPrefixedKeyCols = [...prefixedSourceKeyCols, ...prefixedTargetKeyCols];
        const keyColumnHeader = `Anahtar (${sourceKeyColNames.join(' - ')})`;
        
        const mapB = new Map<string, { total: number, originalRow: ExcelRow }>();
        dataB.data.forEach(rowB => {
            const key = keyPairs.map(p => rowB[p.columnB!]).join('||');
            const compareValue = Number(rowB[compareColumnB]) || 0;
            const existing = mapB.get(key);
            if (existing) {
                existing.total += compareValue;
            } else {
                mapB.set(key, { total: compareValue, originalRow: rowB });
            }
        });

        const mapA = new Map<string, ExcelRow[]>();
        dataA.data.forEach(rowA => {
            const key = keyPairs.map(p => rowA[p.columnA!]).join('||');
            if (!mapA.has(key)) mapA.set(key, []);
            mapA.get(key)!.push(rowA);
        });

        const finalResults: ExcelRow[] = [];
        const otherOutputColumns = outputColumns.filter(col => !allPrefixedKeyCols.includes(col));

        for (const [key, bData] of mapB.entries()) {
            const rowsA = mapA.get(key);
            const originalTargetValue = bData.total;
            const keyColumnValue = key.split('||').join(' - ');
            
            const populateOutputColumns = (targetRow: ExcelRow, sourceRow: ExcelRow | null) => {
                otherOutputColumns.forEach(col => {
                    const [prefix, ...colNameParts] = col.split(': ');
                    const colName = colNameParts.join(': ');
                    const outputColName = `${prefix}: ${colName}`;
                    if (prefix === 'Kaynak' && sourceRow) {
                        targetRow[outputColName] = sourceRow[colName] ?? '';
                    } else if (prefix === 'Hedef') {
                        targetRow[outputColName] = bData.originalRow[colName] ?? '';
                    }
                });
            };

            const totalSourceAvailable = rowsA ? rowsA.reduce((sum, row) => sum + (Number(row[compareColumnA]) || 0), 0) : 0;

            if (!rowsA || totalSourceAvailable <= 0) {
                const resultRow: ExcelRow = {
                    [keyColumnHeader]: keyColumnValue,
                    'Durum': 'Kaynakta Bulunamadı',
                    'Hedef Miktar': originalTargetValue,
                    'Kullanılan Kaynak': 0,
                    'Hedef Kalan': originalTargetValue,
                    'Kaynak Kalan': totalSourceAvailable,
                };
                populateOutputColumns(resultRow, bData.originalRow);
                finalResults.push(resultRow);
                continue;
            }

            let targetRemaining = originalTargetValue;
            let sourceAvailable = totalSourceAvailable;
            let firstRowA = rowsA[0];

            if (targetRemaining <= sourceAvailable) {
                const resultRow: ExcelRow = {
                    [keyColumnHeader]: keyColumnValue,
                    'Durum': 'Eşleşti',
                    'Hedef Miktar': originalTargetValue,
                    'Kullanılan Kaynak': originalTargetValue,
                    'Hedef Kalan': 0,
                    'Kaynak Kalan': sourceAvailable - originalTargetValue,
                };
                populateOutputColumns(resultRow, firstRowA);
                finalResults.push(resultRow);
            } else {
                const resultRow: ExcelRow = {
                    [keyColumnHeader]: keyColumnValue,
                    'Durum': 'Kısmen Karşılandı',
                    'Hedef Miktar': originalTargetValue,
                    'Kullanılan Kaynak': sourceAvailable,
                    'Hedef Kalan': originalTargetValue - sourceAvailable,
                    'Kaynak Kalan': 0,
                };
                populateOutputColumns(resultRow, firstRowA);
                finalResults.push(resultRow);
            }
        }

        const reorderedResults = finalResults.map(row => {
            const { [keyColumnHeader]: keyCol, Durum, ...rest } = row;
            return {
                Durum,
                [keyColumnHeader]: keyCol,
                ...rest
            };
        });

        setResults(reorderedResults);
        setStep(3);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Karşılaştırma sırasında bilinmeyen bir hata oluştu.');
      } finally {
        setIsComparing(false);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Excel Veri Karşılaştırma Aracı</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">İki farklı Excel setindeki verileri zahmetsizce karşılaştırın.</p>
        </header>

        <Toast toasts={toasts} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Hata: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Adım 1: Excel Dosyalarınızı Yükleyin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FileUpload
                id="file-upload-a"
                title="Kaynak (örn: Satış Faturaları)"
                disabled={isComparing}
                uploadedFiles={sourceFiles}
                isProcessing={isProcessingSource}
                onAddFiles={(files) => handleAddFiles(files, 'source')}
                onRemoveFile={(index) => handleRemoveFile(index, 'source')}
                onSheetChange={(index, sheet) => handleSheetChange(index, sheet, 'source')}
                invalidFileNames={invalidSourceFiles}
              />
              <FileUpload
                id="file-upload-b"
                title="Hedef (örn: İade İrsaliyeleri)"
                disabled={isComparing}
                uploadedFiles={targetFiles}
                isProcessing={isProcessingTarget}
                onAddFiles={(files) => handleAddFiles(files, 'target')}
                onRemoveFile={(index) => handleRemoveFile(index, 'target')}
                onSheetChange={(index, sheet) => handleSheetChange(index, sheet, 'target')}
                invalidFileNames={invalidTargetFiles}
              />
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleValidateAndProceed}
                    disabled={sourceFiles.length === 0 || targetFiles.length === 0 || isProcessingSource || isProcessingTarget}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {(isProcessingSource || isProcessingTarget) ? 'Doğrulanıyor...' : 'İleri'}
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <ConfigurationStep
            dataA={dataA}
            dataB={dataB}
            config={config}
            setConfig={setConfig}
            onCompare={handleCompare}
            isComparing={isComparing}
            onBack={() => setStep(1)}
          />
        )}
        
        {step === 3 && results && (
          <ResultsTable results={results} onReset={handleReset} onBack={() => setStep(2)} />
        )}
      </div>
    </div>
  );
}

export default App;