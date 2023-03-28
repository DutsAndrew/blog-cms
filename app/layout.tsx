import './globals.css';
import Header from './Header/Header';

export const metadata = {
  title: 'Blog CMS',
  description: 'Created using NextJS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Blog CMS</title>
      </head>
      <body>
        <Header />
        <section>
          {children}
        </section>
      </body>
    </html>
  )
}