export const metadata = {
  title: 'Helpera',
  description: 'Find og tilbyd småjobs i dit lokalområde',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
}
