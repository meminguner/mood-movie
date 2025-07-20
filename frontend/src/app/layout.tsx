import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Film Robotu',
  description: 'Film önerileri ve değerlendirmeleri',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
