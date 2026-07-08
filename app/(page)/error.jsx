"use client";
import React from "react";
import { X } from 'lucide-react';
export default function Error({ error, reset }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-600 bg-opacity-50">
  <X className="text-error w-20 h-20"></X>
  <div className="text-4xl text-base-100 text-center mt-6">Error : {error.massage}</div>
</div>
  );
}
