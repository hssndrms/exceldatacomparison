import React, { useState } from 'react';
import type { ProcessedExcelData, ComparisonConfig, ExcelRow } from './types';
import FileUpload from './components/FileUpload';
import ConfigurationStep from './components/ConfigurationStep';
import ResultsTable from './components/ResultsTable';
import { v4 as uuidv4 } from 'uuid';

const initialConfig: ComparisonConfig = {
  keyPairs: [{id: uuidv4(), columnA: null, columnB: null }],
  compareColumnA: null,
  compareColumnB: null,
  outputColumns: [],
};

function App() {
  const [step, setStep] = useState(1);
  const [dataA, setDataA] = useState<ProcessedExcelData | null>(null);
  const [dataB, setDataB] = useState<ProcessedExcelData | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // To reset file inputs
  
  const [config, setConfig] = useState<ComparisonConfig>(initialConfig);

  const [results, setResults] = useState<ExcelRow[] | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setStep(1);
    setDataA(null);
    setDataB(null);
    setConfig(initialConfig);
    setResults(null);
    setIsComparing(false);
    setError(null);
    setFileInputKey(Date.now()); // Change key to force re-mount of FileUpload components
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
        const prefixedTargetKeyCols = keyPairs.map(p => p.columnB!).filter(Boolean).map(c => `Hedef: ${c}`);
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
                populateOutputColumns(resultRow, rowsA?.[0] || null);
                finalResults.push(resultRow);
                continue;
            }


            let targetRemaining = originalTargetValue;
            const generatedRowsForKey: ExcelRow[] = [];

            for (const rowA of rowsA) {
                if (targetRemaining <= 0) break;
                const sourceValue = Number(rowA[compareColumnA]) || 0;
                if (sourceValue <= 0) continue;

                const usedFromSource = Math.min(targetRemaining, sourceValue);
                const sourceRemaining = sourceValue - usedFromSource;
                
                const resultRow: ExcelRow = {
                    [keyColumnHeader]: keyColumnValue,
                    'Durum': '', // Will set later
                    'Hedef Miktar': originalTargetValue,
                    'Kullanılan Kaynak': usedFromSource,
                    'Hedef Kalan': targetRemaining - usedFromSource,
                    'Kaynak Kalan': sourceRemaining,
                };
                populateOutputColumns(resultRow, rowA);
                generatedRowsForKey.push(resultRow);
                targetRemaining -= usedFromSource;
            }

            const status = targetRemaining > 0 ? 'Kısmen Karşılandı' : 'Eşleşti';
            generatedRowsForKey.forEach(r => r['Durum'] = status);
            finalResults.push(...generatedRowsForKey);
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
                key={`file-a-${fileInputKey}`}
                id="file-upload-a"
                title="Kaynak (örn: Satış Faturaları)"
                onFilesProcessed={setDataA}
                setProcessingError={setError}
                disabled={isComparing}
              />
              <FileUpload
                key={`file-b-${fileInputKey}`}
                id="file-upload-b"
                title="Hedef (örn: İade İrsaliyeleri)"
                onFilesProcessed={setDataB}
                setProcessingError={setError}
                disabled={isComparing}
              />
            </div>
            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => setStep(2)}
                    disabled={!dataA?.data.length || !dataB?.data.length}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    İleri <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
            </div>
          </div>
        )}

        {step === 2 && dataA && dataB && (
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