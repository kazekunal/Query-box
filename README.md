# Query - Box 

## Introduction

<p>Query - Box is an intuitive and interactive web application that allows users to write, execute, and visualize SQL queries efficiently. Built using Next.js as my prime front-end framework and CSS for styling, the website provides a sleek and user-friendly data manipulation and analysis interface. It is especially useful for data analysts, database administrators, and developers who want to parse large data sets and explore table structures quickly.</p>

## Sections

### Editor Mode

- Feature-Rich SQL Query Editor: The app includes a feature-rich SQL query editor powered by the react-code mirror library. It provides syntax highlighting, SQL suggestions, and a modern theme for an enhanced editing experience. The query editor has a convenient "Reset Code" button, allowing users to reset the current query to the Initial Query quickly.

- Run Query Button: Instantly parses large datasets using the 'papaparse' library, providing quick results with minimal delay.

- Sample Queries with Copy-to-Editor Functionality: Pre-built sample queries to help users get started, with an easy option to copy them to the editor for quick modification.

- Results Table display: Automatically paginates the data when displaying large tables, making it easy to navigate through rows. The row count for each page is displayed, allowing users to keep track of their position within the dataset.

- Export CSV Button: Users can export the query results data to a CSV file using the "Export CSV" button. The exported CSV file contains the data displayed in the query results table, making it easy to save and share the results.

<img width="1470" alt="Screenshot 2025-03-30 at 11 12 43 AM" src="https://github.com/user-attachments/assets/95e11843-f913-403a-8c68-bfe00d1a1534" />


### View Tables

- Complete overview of all available tables
- Row count and data preview for each table
- Quick links to visit the source of data tables

<img width="1470" alt="Screenshot 2025-03-29 at 11 28 27 AM" src="https://github.com/user-attachments/assets/142f7159-9d84-4fd2-a4b9-212831f0cc5e" />

### Explore

- Categorized Queries: Queries are organized into categories based on their functionality (e.g., data retrieval, aggregation, filtering), making it useful for beginners and learners to parse their data and get results easily.
- Detailed Descriptions: Each query is accompanied by a clear and concise explanation describing its purpose, how it works, and what kind of result it returns.
- Copy to clipboard button: Easily copy to the clipboard and redirect back to the editor page to paste it in the editor and see how it works.

<img width="1470" alt="Screenshot 2025-03-30 at 11 15 46 AM" src="https://github.com/user-attachments/assets/21bc1d9b-db9d-4104-abff-ec73c1009f99" />

## Dependancies 

- PapaParse: A powerful CSV parser handling the heavy lifting of processing large datasets. It is used for parsing CSV data for query processing and enables handling of large datasets with minimal performance impact

- React Code Mirror: A modern and feature-rich code editor library integrated into the SQL editor. It provides syntax highlighting, intelligent autocomplete suggestions, and a clean, customizable interface. The library enhances the editing experience with a professional look and feel, enabling users to write SQL queries efficiently and accurately.

## Optimizations for Performance

- Pagination for Query Results: Pagination for query results was implemented to avoid rendering a large number of table rows at once. This ensures that only a limited number of rows are displayed at a time, improving page load and rendering performance.

- Debounced and Throttled Function Calls: To optimize performance, Implemented both debouncing and throttling mechanisms for certain actions. For instance, when exporting data to CSV, used debouncing to ensure that the export function is called only once within a specified time period, preventing unnecessary repeated calls. Additionally, when running the SQL queries, used throttling to limit the frequency of query runs, ensuring a smoother user experience.

- Memoization with useMemo: The useMemo hook is employed to cache the results of expensive calculations or computations, such as pagination logic and total page calculations. This ensures that the same data is not recalculated unnecessarily, reducing computation time and improving responsiveness.

- useCallback for Debounced and Throttled Functions: The useCallback hook is used to memoize debounced and throttled functions, such as running queries. This ensures that the same instance of these functions is returned on subsequent renders, preventing unnecessary re-renders of child components.

- Local State Management: State variables like query, results, currentPage, isLoading, csvData, queryHistory, and isExporting are kept local within the SqlEditor component. This minimizes re-renders and ensures that only affected parts of the UI are updated, enhancing performance.

## Page Load Time Measurement

Lighthouse report - 
<img width="1470" alt="Screenshot 2025-03-30 at 11 33 08 AM" src="https://github.com/user-attachments/assets/23ecb19b-a87c-4a55-8fcf-8f65bf1c6835" />



<img width="1470" alt="Screenshot 2025-03-30 at 11 32 40 AM" src="https://github.com/user-attachments/assets/4d054654-7047-4d1a-9017-2495c52407de" />


## Usage

Usage

- Open your browser and navigate to https://query-box.vercel.app/
- Use the provided sample datasets
- Write your SQL query in the editor or select a sample query
- Click "Run Query" to execute and view the results
- Explore the "View Tables" section to understand available data
- Check out the "Explore" section for more query examples

