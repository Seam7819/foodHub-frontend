import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import { AuthProvider } from "../context/AuthContext";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <Navbar />

            <main>
              {children}
            </main>

            <Footer />

            <Toaster
              richColors
              position="top-right"
            />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "FoodHub",
  icons: {
    icon: "./favicon.png",
  },
};