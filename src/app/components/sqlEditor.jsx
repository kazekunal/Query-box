'use client';
import React, { useState, useMemo } from 'react';
import { Play, Database, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './SqlEditor.css';

const SqlEditor = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of rows per page

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClearQuery = () => {
    setQuery('');
  };

  const handleRunQuery = () => {
    // Simulated query results for demonstration
    const mockResults = [
      { 
        columns: ['productID', 'productName', 'unitsInStock'], 
        data: [
          [1, 'Product A', 5],
          [2, 'Product B', 3],
          [3, 'Product C', 8],
          [4, 'Product D', 12],
          [5, 'Product E', 6],
          [6, 'Product F', 9],
          [7, 'Product G', 4],
          [8, 'Product H', 7],
          [9, 'Product I', 11],
          [10, 'Product J', 2],
          [11, 'Product K', 15],
          [12, 'Product L', 5],
          [13, 'Product M', 8],
          [14, 'Product N', 3],
          [15, 'Product O', 6],
          [16, 'Product P', 10],
          [17, 'Product Q', 7],
          [18, 'Product R', 4],
          [19, 'Product S', 9],
          [20, 'Product T', 12],
          [21, 'Product U', 5],
          [22, 'Product V', 8],
          [23, 'Product W', 3],
          [24, 'Product X', 6],
          [25, 'Product Y', 11],
          [26, 'Product Z', 7]
        ]
      }
    ];
    setResults(mockResults);
    setCurrentPage(1); // Reset to first page when new results are loaded
    console.log('Running query:', query);
  };

  const handleSampleQueryClick = (sampleQuery) => {
    setQuery(sampleQuery);
  };

  const sampleQueries = [
    'select * from product;',
    'select * from product where supplierID = 2;',
    'select * from product where productID = 9;',
    'select * from product where unitsInStock < 10;',
    'select * from product;',
    'select * from product where supplierID = 2;',
    'select * from product where productID = 9;',
    'select * from product where unitsInStock < 10;',
    
  ];

  // Pagination Logic
  const paginatedResults = useMemo(() => {
    if (results.length === 0) return [];

    const resultSet = results[0];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      ...resultSet,
      data: resultSet.data.slice(startIndex, endIndex)
    };
  }, [results, currentPage]);

  const totalPages = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.ceil(results[0].data.length / itemsPerPage);
  }, [results]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="sql-editor-container">
      <div className="sql-editor-wrapper">
        <div className="editor-header">
          <span className="editor-title">
            <Database size={16} />
            <span>Query Editor</span>
          </span>
        </div>

        <div className="editor-content">
          <div className="query-editor-body">
            <div className="line-numbers">
              {Array.from({ length: 16 }, (_, i) => i + 1).map((number) => (
                <div key={number} className="line-number">{number}</div>
              ))}
            </div>
            <textarea
              className="query-input"
              value={query}
              onChange={handleQueryChange}
              placeholder={`-- Write your SQL query here`}
              spellCheck="false"
            />
          </div>

          <div className="editor-actions">
            <button 
              className="clear-btn" 
              onClick={handleClearQuery}
            >
              <X size={16} /> Clear
            </button>
            <button 
              className="run-btn" 
              onClick={handleRunQuery}
            >
              <Play size={16} /> Run
            </button>
          </div>

          <div className="sample-queries-horizontal">
            {sampleQueries.map((sampleQuery, index) => (
              <div
                key={index}
                className="sample-query-block"
                onClick={() => handleSampleQueryClick(sampleQuery)}
              >
                {sampleQuery}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="query-results-container">
        <div className="results-header">
          <span className="results-title">Query Results</span>
        </div>
        <div className="results-content">
          {results.length > 0 ? (
            <>
              <div className="result-table">
                <table>
                  <thead>
                    <tr>
                      {paginatedResults.columns.map((column, colIndex) => (
                        <th key={colIndex}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedResults.data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-wrapper">
                    <button 
                      className="pagination-button" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft color='black' size={16} />
                    </button>
                    <div className="pagination-pages">
                      {[...Array(Math.min(totalPages, 5)).keys()].map((page) => {
                        const pageNumber = page + 1;
                        return (
                          <div 
                            key={pageNumber}
                            className={`pagination-page-number ${currentPage === pageNumber ? 'active' : ''}`}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </div>
                        );
                      })}
                      {totalPages > 5 && (
                        <>
                          <div className="pagination-ellipsis">...</div>
                          <div 
                            className={`pagination-page-number ${currentPage === totalPages ? 'active' : ''}`}
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </div>
                        </>
                      )}
                    </div>
                    <button 
                      className="pagination-button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight color='black' size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <h1>No Results yet</h1>
              <br/>
             <p>Run a query to see results here.<br/> You can select from sample queries or write your own.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SqlEditor;