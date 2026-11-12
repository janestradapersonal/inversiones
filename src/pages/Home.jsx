import HeroCrecimiento from "@/components/HeroCrecimiento";
import InicioObjetivos from "@/components/InicioObjetivos";
import { BarraLectura } from "@/components/inicio/Ganchos";

// Inicio: entrada con contador en vivo y accesos a cada parte, lo que la web no hará y gráfico de ejemplo.
export default function Home() {
  return (
    <div>
      <BarraLectura />
      <InicioObjetivos />
      <HeroCrecimiento />
    </div>
  );
}
