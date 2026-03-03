import TopBar from "../components/TopBar";
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

export default function AuthLayout({ children }) {
  return (
    <>
      <TopBar />
      {children}
    </>
  );
}
