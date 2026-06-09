import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/ui/Providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Bappaditya Maity — Analytics Engineer & AI Builder",
  description:
    "Production-grade ETL pipelines, LLM-assisted analytics, RAG applications, dbt modeling. Available for freelance — national & international clients.",
  keywords: [
    "Analytics Engineer", "ETL Pipeline", "dbt", "BigQuery", "LLM",
    "RAG", "AI Agent", "Data Engineer", "Python", "Airflow",
  ],
  authors: [{ name: "Bappaditya Maity" }],
  openGraph: {
    title: "Bappaditya Maity — Analytics Engineer & AI Builder",
    description: "Turning raw data into intelligent systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#060e1c",
                border: "0.5px solid #0d2a3a",
                color: "#e8f4f0",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
