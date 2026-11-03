import Navbar from "./Navbar";
import Footer from "./Footer";
import CursorGlow from "./CursorGlow";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
  return (
    <div className="bg-brand-onyx min-h-screen flex flex-col">
      {/* Luces índigo de fondo, como en la entrada */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20vh] -right-[15vw] w-[55vw] h-[55vw] rounded-full bg-[#3B1FB0]/35 blur-[80px]" />
        <div className="absolute top-[45vh] -left-[20vw] w-[50vw] h-[50vw] rounded-full bg-[#3B1FB0]/25 blur-[80px]" />
      </div>
      <CursorGlow />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>);

}