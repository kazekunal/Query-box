'use client'
import React from "react";
import Navbar2 from "./components/navbar";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import SqlEditor from "./components/sqlEditor";

function Home() {
  return (
    <div>
      <Navbar2/>
    <SqlEditor/>
    </div>
    // <main style={{
    //   display: 'flex',
    //   height: '100vh',
    //   overflow: 'hidden'
    // }}>
    //   <div style={{
    //     width: '250px', 
    //     flexShrink: 0
    //   }}>
    //     {/* <Sidebar/>
    //      */}
    //      <Navbar/>
    //   </div>
    //   <div style={{
    //     flex: 1,
    //     width: 'calc(100% - 250px)'
    //   }}>
    //     <SqlEditor/>
    //   </div>
    // </main>
  );
}

export default Home;