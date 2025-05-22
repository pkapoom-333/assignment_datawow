import { CssBaseline } from "@mui/material";
import Navigation from "../components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <Navigation>{children}</Navigation>
      </body>
    </html>
  );
}
