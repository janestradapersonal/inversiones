import HeroCrecimiento from "@/components/HeroCrecimiento";
import InicioObjetivos from "@/components/InicioObjetivos";
import { BarraLectura, SiguientePaso, VerdadMentira } from "@/components/inicio/Ganchos";

// Inicio: entrada con contador en vivo, juego de «¿verdad o mentira?», objetivos, gráfico de ejemplo y siguiente paso.
export default function Home() {
  return (
    <div>
      <BarraLectura />
      <InicioObjetivos trasEntrada={<VerdadMentira />} />
      <HeroCrecimiento />
      <SiguientePaso />
    </div>
  );
}
