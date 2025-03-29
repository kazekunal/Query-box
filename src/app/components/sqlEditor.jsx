"use client"
import { useState, useMemo, useEffect, useCallback } from "react"
import { Play, Database, X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import Papa from "papaparse"
import "./editor.css"
import ReactCodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { githubLight } from '@uiw/codemirror-theme-github'

// Debounce function
const debounce = (func, delay) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Throttle function
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

const SqlEditor = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [csvData, setCsvData] = useState([])
  const [queryHistory, setQueryHistory] = useState([])
  const [tabs, setTabs] = useState([{ id: 1, name: "Query 1", query: "" }])
  const [activeTab, setActiveTab] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const itemsPerPage = 15

  const CSV_URL =
    "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/order_details.csv"

  useEffect(() => {
    const loadCsvFile = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(CSV_URL)
        const csvText = await response.text()

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setCsvData(results.data)
            setIsLoading(false)
          },
          error: (error) => {
            console.error("CSV Parsing Error:", error)
            setIsLoading(false)
          },
        })
      } catch (error) {
        console.error("Failed to fetch CSV:", error)
        setIsLoading(false)
      }
    }

    loadCsvFile()

    const savedHistory = localStorage.getItem("queryHistory")
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory))
    }
  }, [])

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery)

    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab ? { ...tab, query: newQuery } : tab
    )
    setTabs(updatedTabs)
    
    // debounced the save to storage function
    debouncedSaveToStorage(updatedTabs)
  }

  // Debounced function to save query to localStorage
  const debouncedSaveToStorage = useCallback(
    debounce((updatedTabs) => {
      localStorage.setItem("queryTabs", JSON.stringify(updatedTabs))
      console.log("Saved to local storage")
    }, 1000),
    []
  )

  const handleClearQuery = () => {
    setQuery("")
    
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab ? { ...tab, query: "" } : tab
    )
    setTabs(updatedTabs)
    debouncedSaveToStorage(updatedTabs)
  }

  // Throttled run query to prevent rapid executions
  const throttledRunQuery = useCallback(
    throttle(() => {
      if (!query.trim()) return

      setIsLoading(true)
      
      // Simulate a delay to show loading state (remove this in production)
      setTimeout(() => {
        setResults([
          {
            columns: Object.keys(csvData[0] || {}),
            data: csvData.map((row) => Object.values(row)),
          },
        ])
        setCurrentPage(1)
        setIsLoading(false)
        
        // Add to query history
        const newHistory = [
          { id: Date.now(), query, timestamp: new Date().toISOString() },
          ...queryHistory.slice(0, 9) // Keep only the last 10 queries
        ]
        setQueryHistory(newHistory)
        localStorage.setItem("queryHistory", JSON.stringify(newHistory))
      }, 500)
    }, 500), // Throttle to once per second
    [query, csvData, queryHistory]
  )

  const handleRunQuery = () => {
    throttledRunQuery()
  }

  const handleSampleQueryClick = (sampleQuery) => {
    setQuery(sampleQuery)
    
    // Update the query in the active tab
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab ? { ...tab, query: sampleQuery } : tab
    )
    setTabs(updatedTabs)
    debouncedSaveToStorage(updatedTabs)
  }


  // Debounced function to export results to CSV
  const debouncedExportToCsv = useCallback(
    debounce(() => {
      if (results.length === 0 || isExporting) return
      
      setIsExporting(true)
      
      try {
        const csv = Papa.unparse({
          fields: results[0].columns,
          data: results[0].data
        })
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `query_results_${new Date().toISOString().slice(0,10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        console.log("CSV exported successfully")
      } catch (error) {
        console.error("Failed to export CSV:", error)
      } finally {
        setIsExporting(false)
      }
    }, 800),
    [results, isExporting]
  )

  // Sample SQL Queries
  const sampleQueries = [
    "SELECT * FROM orders;",
    "SELECT OrderID, CustomerID FROM orders;",
    'SELECT * FROM orders WHERE OrderDate > "1997-01-01";',
    "SELECT CustomerID, COUNT(*) FROM orders GROUP BY CustomerID;",
    'DELETE FROM Orders WHERE OrderID = 10;',
    "SELECT Orders.OrderID, Customers.CustomerName FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;",
  ]

  // Pagination Logic
  const paginatedResults = useMemo(() => {
    if (results.length === 0) return []

    const resultSet = results[0]
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return {
      ...resultSet,
      data: resultSet.data.slice(startIndex, endIndex),
    }
  }, [results, currentPage])

  const totalPages = useMemo(() => {
    if (results.length === 0) return 0
    return Math.ceil(results[0].data.length / itemsPerPage)
  }, [results])

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const currentGroup = Math.ceil(currentPage / 5)
    const startPage = (currentGroup - 1) * 5 + 1
    const endPage = Math.min(startPage + 4, totalPages)

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }, [currentPage, totalPages])

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="sql-editor-container">
      <div className="sql-editor-wrapper">
        <div className="editor-header">
          <div className="editor-title">
            <Database size={16} />
            <span>Query Editor</span>
          </div>
        </div>

        <div className="editor-content">
          <div className="query-editor-body">
            <ReactCodeMirror
              value={query}
              onChange={handleQueryChange}
              extensions={[sql()]}
              theme={githubLight}
              placeholder="-- Write your SQL query here
-- Example: SELECT * FROM orders"
              className="codemirror-wrapper"
            />
          </div>

          <div className="editor-actions">
            <button className="clear-btn" onClick={handleClearQuery} disabled={!query.trim()}>
              <X size={16} /> Clear
            </button>
            <button className="run-btn" onClick={handleRunQuery} disabled={isLoading || !query.trim()}>
              <Play size={16} /> {isLoading ? "Loading..." : "Run"}
            </button>
            {results.length > 0 && (
              <button 
                className="export-btn" 
                onClick={debouncedExportToCsv}
                disabled={isExporting}
              >
                <Download size={16} /> {isExporting ? "Exporting..." : "Export CSV"}
              </button>
            )}
          </div>

          <div className="sample-queries-container">
            <h3 className="sample-queries-title">Sample Queries</h3>
            <div className="sample-queries-grid">
              {sampleQueries.map((sampleQuery, index) => (
                <div key={index} className="sample-query-block" onClick={() => handleSampleQueryClick(sampleQuery)}>
                  {sampleQuery}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="query-results-container">
        <div className="results-header">
          <div className="results-title-container">
            <span className="results-title">Query Results</span>
            <span className="results-subtitle">Table Name : Orders</span>
          </div>
          {results.length > 0 && <div className="results-stats">{results[0].data.length} rows found</div>}
        </div>
        <div className="results-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading data...</p>
            </div>
          ) : results.length > 0 ? (
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
                      <ChevronLeft size={16} />
                    </button>
                    <div className="pagination-pages">
                      {visiblePages.map((pageNumber) => (
                        <div
                          key={pageNumber}
                          className={`pagination-page-number ${currentPage === pageNumber ? "active" : ""}`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </div>
                      ))}
                      {totalPages > visiblePages[visiblePages.length - 1] && (
                        <>
                          {totalPages > visiblePages[visiblePages.length - 1] + 1 && (
                            <div className="pagination-ellipsis">...</div>
                          )}
                          <div
                            className={`pagination-page-number ${currentPage === totalPages ? "active" : ""}`}
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
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <h1>No Results Yet</h1>
              <p>
                Run a query to see results here.
                <br /> You can select from sample queries or write your own.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SqlEditor