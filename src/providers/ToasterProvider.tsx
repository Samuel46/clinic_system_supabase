"use client";
import React from "react";

import { Toaster } from "sonner";

const ToasterProvider = () => {
  return <Toaster closeButton visibleToasts={1000} />;
};

export default ToasterProvider;
