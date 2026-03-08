import TopBar from "../../components/TopBar";
import { Crimson_Text, Caveat, Afacad } from "next/font/google";

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ProtectedLayout({ children }) {
  return (
    <div style={{ backgroundColor: "#FFFEFA", minHeight: "100vh" }}>
      <TopBar showBack={true} />
      {children}
    </div>
  );
}
