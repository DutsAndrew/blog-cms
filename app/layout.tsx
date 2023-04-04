import './globals.css';

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
        <section className='section-container'>
          {children}
        </section>
      </body>
    </html>
  )
}