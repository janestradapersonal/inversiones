import HeroCrecimiento from "@/components/HeroCrecimiento";
import InicioObjetivos from "@/components/InicioObjetivos";
import { BarraLectura, SiguientePaso } from "@/components/inicio/Ganchos";

// Inicio: entrada con contador en vivo, objetivos, gráfico de ejemplo y siguiente paso.
export default function Home() {
  return (
    <div>
      <BarraLectura />
      <InicioObjetivos />
      <HeroCrecimiento />
      <SiguientePaso />
    </div>
  );
}
