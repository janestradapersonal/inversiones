import Navbar from "./Navbar";
import Footer from "./Footer";
import CursorGlow from "./CursorGlow";
import { Outlet } from "react-router-dom";

// Lienzo negro plano (DESIGN.md): sin manchas de luz de fondo.
export default function PageLayout() {
  return (
    <div className="bg-brand-onyx min-h-screen flex flex-col">
      <CursorGlow />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>);

}
