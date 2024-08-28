import React from "react";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen flex items-center w-full justify-center">
      <div className="mx-auto max-w-3xl">
        <div
          className="w-24 h-24 rounded-full animate-spin
    border-y-8 border-solid border-slate-500 border-t-transparent"
        ></div>
      </div>
    </div>
  );
}
