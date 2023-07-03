import './globals.css';
import styles from  './page.module.css';

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
        <link rel='icon' type='image/png' href='/favicon.png' />
      </head>
      <body>
        <section className={styles.pageContainer}>
          {children}
        </section>
      </body>
    </html>
  )
}