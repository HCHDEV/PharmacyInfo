"use client"
// import Drawer from "../components/layout/drawer";
import { Providers } from "../store/provider";
import Navbar from "../components/layout/navbar";
import Link from "next/link";
import { useState } from "react";


export default function layout({ children }) {

  return (
    <div>
 <Providers>
        <div className="flex flex-col h-screen">
            <Navbar />  
          <div className="flex flex-1">
            {/* <Drawer /> */}
            <main className="bg-white flex-1">{children}</main>
          </div>
        </div>
 </Providers>




    </div>

  );
}
