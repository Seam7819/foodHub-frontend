import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import { AuthProvider } from "../context/AuthContext";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import ThemeProvider from "../providers/ThemeProvider";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <Navbar />
              <main className="min-h-screen bg-app-bg text-app-fg">
                {children}
              </main>
              <Footer />
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "OrgNest",
  description: "OrgNest helps organizations manage teams, services, and projects with modern workflows.",
  icons: {
    icon: "./favicon.png",
  },
};