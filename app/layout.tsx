import "./globals.css";

export const metadata = {
  title: "Helpera",
  description: "Local gigs in Denmark"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
