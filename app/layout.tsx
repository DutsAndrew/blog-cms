import './globals.css'

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
        <section>
          <nav>
            <p>Sign Up</p>
            <p>Login</p>
          </nav>
        </section>
        <section>
          {children}
        </section>
      </body>
    </html>
  )
}
