"use client"
import { useState, useEffect } from "react"
import Navbar2 from "./navbar"
import { Database, ExternalLink, Search } from "lucide-react"
import Papa from "papaparse"
import "./tables.css"

export default function TablesPage() {
  const [tables, setTables] = useState([])
  const [selectedTable, setSelectedTable] = useState(null)
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Sample tables data
  const availableTables = [
    {
      id: "orders",
      name: "Orders",
      description: "Customer orders information",
      url: "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/orders.csv",
    },
    {
      id: "order_details",
      name: "Order Details",
      description: "Details of each order",
      url: "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/order_details.csv",
    },
    {
      id: "products",
      name: "Products",
      description: "Product catalog information",
      url: "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/products.csv",
    },
    {
      id: "customers",
      name: "Customers",
      description: "Customer information and details",
      url: "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/customers.csv",
    },
    {
      id: "employees",
      name: "Employees",
      description: "Employee records and information",
      url: "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/employees.csv",
    }
  ]

  useEffect(() => {
    setTables(availableTables)
  }, [])

  const loadTableData = async (table) => {
    setIsLoading(true)
    setSelectedTable(table)

    try {
      const response = await fetch(table.url)
      const csvText = await response.text()

      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          setTableData(results.data)
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


  const filteredTables = tables.filter(
    (table) =>
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="app-container">
      <Navbar2/>
      <main className="main-content">
        <div className="tables-container">
          <div className="tables-sidebar">

            <div className="tables-list">
              <h3 className="tables-heading">Available Tables</h3>
              <ul className="table-items">
                {filteredTables.map((table) => (
                  <li
                    key={table.id}
                    className={`table-item ${selectedTable?.id === table.id ? "active" : ""}`}
                    onClick={() => loadTableData(table)}
                  >
                    <div className="table-item-icon">
                      <Database size={16} />
                    </div>
                    <div className="table-item-content">
                      <div className="table-item-name">{table.name}</div>
                      <div className="table-item-description">{table.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="table-content">
            {selectedTable ? (
              <>
                <div className="table-header">
                  <div className="table-title">
                    <h2>{selectedTable.name}</h2>
                    <p className="table-description">{selectedTable.description}</p>
                  </div>
                  <a href={selectedTable.url} target="_blank" rel="noopener noreferrer" className="view-source-btn">
                    <ExternalLink size={14} />
                    View Source
                  </a>
                </div>

                {isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading table data...</p>
                  </div>
                ) : (
                  <div className="table-data-container">
                    {tableData.length > 0 ? (
                      <table className="data-table">
                        <thead>
                          <tr>
                            {Object.keys(tableData[0]).map((column, index) => (
                              <th key={index}>{column}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.slice(0, 100).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="no-data">No data available for this table</div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="no-table-selected">
                <Database size={48} className="no-table-icon" />
                <h2>No Table Selected</h2>
                <p>Select a table from the sidebar to view its data</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}