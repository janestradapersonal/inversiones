import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Estilo1 from "./Estilo1";
import Estilo2 from "./Estilo2";
import Estilo3 from "./Estilo3";
import Estilo4 from "./Estilo4";

// Pruebas de estilo de la portada (/estilos/1 … /estilos/4). No cambian la web real.
const PRUEBAS = { 1: Estilo1, 2: Estilo2, 3: Estilo3, 4: Estilo4 };

export default function Estilos() {
  const { n } = useParams();
  useEffect(() => window.scrollTo(0, 0), [n]);
  const P = PRUEBAS[n];
  return P ? <P /> : <Navigate to="/estilos/1" replace />;
}
