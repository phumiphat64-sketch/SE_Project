import "./globals.css";
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

import "./globals.css";
import TopBar from "./components/TopBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}
