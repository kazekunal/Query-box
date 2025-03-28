"use client"
import { useState, useEffect } from "react"
import Navbar2 from "./navbar"
import { Database, Code, Search, Info } from "lucide-react"
import "./explore.css"

export default function SQLQueriesPage() {
  const [queries, setQueries] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Comprehensive SQL Queries Data
  const sqlQueries = [
    {
      id: "select-basic",
      category: "SELECT",
      name: "Select All Query",
      description: "Retrieve all columns from a table",
      query: "SELECT * FROM Customers;"
    },
    {
      id: "select-specific-columns",
      category: "SELECT",
      name: "Select Specific Columns",
      description: "Retrieve only specific columns from a table",
      query: "SELECT FirstName FROM Employees;"
    },
    {
      id: "where-clause",
      category: "SELECT",
      name: "Filtering select Query with WHERE",
      description: "Filter rows based on a condition",
      query: "SELECT * FROM Products WHERE Price > 50;",
    },
    {
      id: "update-basic",
      category: "UPDATE",
      name: "UPDATE Query",
      description: "Update values in a specific row",
      query: "UPDATE Customers SET City = 'London' WHERE CustomerID = 1;",
    },
    {
      id: "delete-basic",
      category: "DELETE",
      name: "DELETE Query",
      description: "Remove specific rows from a table",
      query: "DELETE FROM Orders WHERE OrderID = 10;",
    },
    {
      id: "join-inner",
      category: "JOIN",
      name: "INNER JOIN",
      description: "Combine rows from two tables based on a related column",
      query: "SELECT Orders.OrderID, Customers.CustomerName FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;"
    },
    {
      id: "aggregate-count",
      category: "AGGREGATE",
      name: "COUNT Function",
      description: "Count the number of rows matching a condition",
      query: "SELECT COUNT(*) FROM Products WHERE Price < 20;",
    },
    {
      id: "group-by",
      category: "AGGREGATE",
      name: "GROUP BY Clause",
      description: "Group rows that have the same values",
      query: "SELECT Category, COUNT(*) FROM Products GROUP BY Category;"
    }
  ]

  const categories = [
    ...new Set(sqlQueries.map(query => query.category))
  ]

  useEffect(() => {
    setQueries(sqlQueries)
  }, [])

  const filteredQueries = queries.filter(query => 
    (selectedCategory ? query.category === selectedCategory : true) &&
    (query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     query.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="app-container">
      <Navbar2 />
      <main className="main-content">
        <div className="sql-queries-container">
          <div className="sql-queries-sidebar">
            <div className="mobile-category-tabs">
              <div 
                className={`mobile-category-tab ${selectedCategory === null ? "active" : ""}`}
                onClick={() => setSelectedCategory(null)}
              >
                <Database size={16} />
                All Queries
              </div>
              {categories.map((category) => (
                <div
                  key={category}
                  className={`mobile-category-tab ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <Code size={16} />
                  {category}
                </div>
              ))}
            </div>

            <div className="categories-list">
              <h3 className="categories-heading">Categories</h3>
              <ul className="category-items">
                <li 
                  className={`category-item ${selectedCategory === null ? "active" : ""}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  <Database size={16} />
                  <span style={{color:'#000000'}}>All Queries</span>
                </li>
                {categories.map((category) => (
                  <li
                    key={category}
                    className={`category-item ${selectedCategory === category ? "active" : ""}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <Code size={16} />
                    <span style={{color:'#000000'}}>{category}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="queries-content">
            {filteredQueries.length > 0 ? (
              <div className="queries-grid">
                {filteredQueries.map((query) => (
                  <div key={query.id} className="query-card">
                    <div className="query-card-header">
                      <h3 style={{color:'#000000'}}>{query.name}</h3>
                    </div>
                    <div className="query-card-category">
                      <Code size={14} />
                      <span>{query.category}</span>
                    </div>
                    <div className="query-card-description">
                      <Info size={14} />
                      <p>{query.description}</p>
                    </div>
                    <pre className="query-code">
                      <code style={{color:'#000000'}}>{query.query}</code>
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-queries">
                <Database size={48} className="no-queries-icon" />
                <h2>No Queries Found</h2>
                <p>Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}