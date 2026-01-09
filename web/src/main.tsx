import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/shared/components/ui/toaster";
import { router } from "@/app/router";
import { Providers } from "@/app/providers";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
      <SonnerToaster position="top-right" richColors />
      <Toaster />
    </Providers>
  </StrictMode>
);
