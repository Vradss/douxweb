import Image from "next/image";
import ComingSoon from "./components/ComingSoon";

export default function Home() {
  return (
    <main className="stage">
      <Image
        className="logo"
        src="/logo_doux.png"
        alt="Doux Bébé"
        width={2160}
        height={1234}
        priority
      />
      <ComingSoon />
    </main>
  );
}
