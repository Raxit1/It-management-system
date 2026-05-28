import { useState, isValidElement, cloneElement } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {

  const [searchQuery, setSearchQuery] = useState("");

  return (

    <div className="layout">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <div className="main">

        {/* NAVBAR */}

        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* PAGE */}

        <div className="page">

          {isValidElement(children)
            ? cloneElement(children, { searchQuery })
            : children}

        </div>

      </div>

    </div>
  );
}