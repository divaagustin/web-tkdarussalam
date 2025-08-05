import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "TK Darussalam Asahan - Taman Kanak-Kanak Islami",
  description: "TK Darussalam Asahan adalah lembaga pendidikan anak usia dini yang berkomitmen memberikan pendidikan berkualitas dengan nilai-nilai islami.",
  keywords: "TK Darussalam, Taman Kanak-Kanak, Asahan, Pendidikan Anak, Islami",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
