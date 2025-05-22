import { CssBaseline } from "@mui/material";
import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
