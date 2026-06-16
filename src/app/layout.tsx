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
  

    <AuthProvider>
  <Navbar />

  <main>
    {children}
  </main>

  <Footer />
</AuthProvider>

    <Footer />

    <Toaster
      richColors
      position="top-right"
    />
  
</body>
    </html>
  );
}