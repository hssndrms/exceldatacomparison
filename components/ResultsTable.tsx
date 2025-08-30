import React, { useState, useMemo, useEffect } from 'react';
import type { ExcelRow } from '../types';
import { exportToExcel } from '../services/excelService';

interface ResultsTableProps {
  results: ExcelRow[];
  onReset: () => void;
  onBack: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, onReset, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const headers = useMemo(() => (results.length > 0 ? Object.keys(results[0]) : []), [results]);

  const filteredAndSortedResults = useMemo(() => {
    let processedData = [...results];

    // Status Filtering
    if (statusFilter !== 'all') {
      processedData = processedData.filter(row => row['Durum'] === statusFilter);
    }

    // Text Filtering
    if (filterText) {
        const lowercasedFilter = filterText.toLowerCase();
        processedData = processedData.filter(row =>
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(lowercasedFilter)
            )
        );
    }

    // Sorting
    if (sortConfig !== null) {
        processedData.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            
            const isNumeric = sortConfig.key !== 'Durum' && !isNaN(Number(aValue)) && !isNaN(Number(bValue)) && String(aValue).trim() !== '' && String(bValue).trim() !== '';

            if (isNumeric) {
                 if (Number(aValue) < Number(bValue)) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (Number(aValue) > Number(bValue)) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
            } else {
                 const comparison = String(aValue).localeCompare(String(bValue), 'tr', { sensitivity: 'base' });
                 return sortConfig.direction === 'ascending' ? comparison : -comparison;
            }
            
            return 0;
        });
    }

    return processedData;
  }, [results, filterText, sortConfig, statusFilter]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, sortConfig, rowsPerPage, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedResults.length / rowsPerPage);
  const paginatedResults = useMemo(() => {
      return filteredAndSortedResults.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredAndSortedResults, currentPage, rowsPerPage]);

  const handleExport = () => {
    exportToExcel(filteredAndSortedResults, 'karsilastirma_sonuclari');
  };
  
  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getStatusBadgeClass = (status: any) => {
    switch (status) {
        case 'Eşleşti':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Kısmen Karşılandı':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Kaynakta Bulunamadı':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1);
        if (currentPage > halfPages + 2) {
            pageNumbers.push('...');
        }

        const startPage = Math.max(2, currentPage - halfPages);
        const endPage = Math.min(totalPages - 1, currentPage + halfPages);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        if (currentPage < totalPages - halfPages - 1) {
            pageNumbers.push('...');
        }
        
        pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const statusOptions = [
    { value: 'all', label: 'Tümü' },
    { value: 'Eşleşti', label: 'Eşleşti' },
    { value: 'Kısmen Karşılandı', label: 'Kısmen Karşılandı' },
    { value: 'Kaynakta Bulunamadı', label: 'Kaynakta Bulunamadı' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full mt-4">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Adım 3: Karşılaştırma Sonuçları</h2>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>Geri
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <i className="fa-solid fa-rotate-right mr-2"></i>Baştan Başla
          </button>
          <button
            onClick={handleExport}
            disabled={filteredAndSortedResults.length === 0}
            className="px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-file-excel mr-2"></i>Excel Olarak İndir
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
            </div>
            <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder={`${filteredAndSortedResults.length} sonuç içinde ara...`}
                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Durum Filtresi:</span>
          {statusOptions.map(opt => (
            <button 
              key={opt.value} 
              onClick={() => setStatusFilter(opt.value)} 
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors shadow-sm ${statusFilter === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {headers.map(header => (
                <th key={header} scope="col" onClick={() => handleSort(header)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                  <div className="flex items-center">
                    <span>{header}</span>
                     {sortConfig?.key === header && (
                        <i className={`fa-solid ${sortConfig.direction === 'ascending' ? 'fa-arrow-up-short-wide' : 'fa-arrow-down-wide-short'} ml-2 text-gray-600 dark:text-gray-400`}></i>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedResults.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                     {header === 'Durum' ? (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(row[header])}`}>
                        {String(row[header])}
                      </span>
                    ) : (
                      String(row[header] ?? '')
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedResults.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              {filterText ? 'Arama kriterlerinize uygun sonuç bulunamadı.' : 'Seçilen filtreye uygun sonuç bulunamadı.'}
          </div>
      )}

      {totalPages > 0 && (
        <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <span>Satır:</span>
            <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="py-1 px-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
            >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
            </select>
            <span className="hidden sm:inline">| {filteredAndSortedResults.length} sonuç ({results.length} toplam)</span>
          </div>
          
          <nav className="flex items-center space-x-1" aria-label="Pagination">
             <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
            >
              Önceki
            </button>
            {getPageNumbers().map((page, index) => 
                typeof page === 'number' ? (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm border rounded-md ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="px-3 py-1 text-sm text-gray-500">...</span>
                )
            )}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
            >
              Sonraki
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
