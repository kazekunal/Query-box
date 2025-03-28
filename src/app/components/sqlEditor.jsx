"use client"
import { useState, useMemo, useEffect } from "react"
import { Play, Database, X, ChevronLeft, ChevronRight } from "lucide-react"
import Papa from "papaparse"
import "./sqlEditor.css"

const SqlEditor = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [csvData, setCsvData] = useState([])
  const [queryHistory, setQueryHistory] = useState([])
  const itemsPerPage = 15

  const CSV_URL =
    "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/order_details.csv"

  useEffect(() => {
    const loadCsvFile = async () => {
      setIsLoading(true) // loading so that the csv file can be fetched
      try {
        const response = await fetch(CSV_URL)
        const csvText = await response.text()

        // Important - Using Papaparse as it is the fastest CSV parser for web browsers
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setCsvData(results.data) //fetching data from here -->
            setIsLoading(false)
          },
          error: (error) => {
            console.error("CSV Parsing Error:", error) //placed checks here and logged the errors
            setIsLoading(false)
          },
        })
      } catch (error) {
        console.error("Failed to fetch CSV:", error) //placed checks here and logged the errors
        setIsLoading(false)
      }
    }

    loadCsvFile()

    const savedHistory = localStorage.getItem("queryHistory")
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory))
    }
  }, []) //empty array useEffect which runs it only once at the first render

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }

  const handleClearQuery = () => {
    setQuery("")
  }

  const handleRunQuery = () => {
    if (!query.trim()) return

    setResults([
      {
        columns: Object.keys(csvData[0] || {}),
        data: csvData.map((row) => Object.values(row)),
      },
    ])
    setCurrentPage(1) 
  }

  const handleSampleQueryClick = (sampleQuery) => {
    setQuery(sampleQuery)
  }

  //sample SQL Queries mentioned
  const sampleQueries = [
    "SELECT * FROM orders;",
    "SELECT OrderID, CustomerID FROM orders;",
    'SELECT * FROM orders WHERE OrderDate > "1997-01-01";',
    "SELECT CustomerID, COUNT(*) FROM orders GROUP BY CustomerID;",
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
            <div className="line-numbers">
              {Array.from({ length: 16 }, (_, i) => i + 1).map((number) => (
                <div key={number} className="line-number">
                  {number}
                </div>
              ))}
            </div>
            <textarea
              className="query-input"
              value={query}
              onChange={handleQueryChange}
              placeholder={`-- Write your SQL query here\n-- Example: SELECT * FROM orders`}
              spellCheck="false"
            />
          </div>

          <div className="editor-actions">
            <button className="clear-btn" onClick={handleClearQuery} disabled={!query.trim()}>
              <X size={16} /> Clear
            </button>
            <button className="run-btn" onClick={handleRunQuery} disabled={isLoading || !query.trim()}>
              <Play size={16} /> {isLoading ? "Loading..." : "Run"}
            </button>
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
