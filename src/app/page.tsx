// src/app/page.tsx
"use client";

import Footer from "../components/footer/page";
import Navbar from "../components/header/page";
import Hero from "../components/hero/hero";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

const Home: React.FC<Props> = ({ session }) => {
  return (
    <SessionProvider session={session}>
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
