# Query - Box 

## Introduction

<p>Query - Box is an intuitive and interactive web application that allows users to write, execute, and visualize SQL queries efficiently. Built using Next.js as my prime front-end framework and CSS for styling, the website provides a sleek and user-friendly data manipulation and analysis interface. It is especially useful for data analysts, database administrators, and developers who want to parse large data sets and explore table structures quickly.</p>

## Sections

### Editor Mode

- SQL Editor: A clean and intuitive interface to write SQL queries efficiently.
- Run Query Button : Instantly parses large datasets using the 'papaparse' library, providing quick results with minimal delay.
- Sample Queries with Copy-to-Editor Functionality: Pre-built sample queries to help users get started, with an easy option to copy them to the editor for quick modification.

<img width="1470" alt="Screenshot 2025-03-29 at 11 28 02 AM" src="https://github.com/user-attachments/assets/1ed26d5c-2629-4b01-b298-996dadb1bd31" />


### View Tables

- Complete overview of all available tables
- Row count and data preview for each table
- Quick links to visit the source of data tables

<img width="1470" alt="Screenshot 2025-03-29 at 11 28 27 AM" src="https://github.com/user-attachments/assets/142f7159-9d84-4fd2-a4b9-212831f0cc5e" />

### Explore

- Categorized Queries: Queries are organized into categories based on their functionality (e.g., data retrieval, aggregation, filtering), making it useful for beginners and learners to parse their data and get results easily.
- Detailed Descriptions: Each query is accompanied by a clear and concise explanation describing its purpose, how it works, and what kind of result it returns.
- Easily Copy and paste the SQL Queries back to the SQL editor to retrieve data in the desired format as given in the description of the Query

<img width="1470" alt="Screenshot 2025-03-29 at 11 28 56 AM" src="https://github.com/user-attachments/assets/7d16d737-13ae-4f4d-b09f-1b3402ee07b4" />


## Dependancies 

- PapaParse: A powerful CSV parser handling the heavy lifting of processing large datasets. It is used for parsing CSV data for query processing and enables handling of large datasets with minimal performance impact

## Usage

Usage

- Open your browser and navigate to https://query-box.vercel.app/
- Use the provided sample datasets
- Write your SQL query in the editor or select a sample query
- Click "Run Query" to execute and view the results
- Explore the "View Tables" section to understand available data
- Check out the "Explore" section for more query examples

