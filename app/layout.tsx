import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nkasire & Emmanuel | #Bawaseverafter',
  description: 'Celebrate the wedding of Nkasire and Emmanuel. 12 December 2026 · Jos, Nigeria.',
  openGraph: {
    title: 'Nkasire & Emmanuel | #Bawaseverafter',
    description: 'His purpose. His timing. Our forever. Join us in Jos on 12 December 2026.',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
