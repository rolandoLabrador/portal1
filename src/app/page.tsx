// src/app/page.tsx
"use client";

import Footer from "../components/footer/page";
import Navbar from "../components/header/page";
import Hero from "../components/hero/hero";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SessionProvider } from "next-auth/react";

const Home: React.FC = () => {
  return (
    <SessionProvider>
      <ProtectedRoute>
        <div>
          <Navbar />
          <Hero />
          <Footer />
        </div>
      </ProtectedRoute>
    </SessionProvider>
  );
};

export default Home;
