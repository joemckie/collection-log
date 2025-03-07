import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@radix-ui/themes/styles.css';
import './globals.css';
import { Flex, TextField, Theme, ThemePanel } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Collection Log',
  description: 'Collection Log viewer for Old School RuneScape',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Theme appearance="dark" accentColor="gray">
          <Flex align="center" justify="center" p="2" mb="2">
            <TextField.Root>
              <TextField.Slot>
                <MagnifyingGlassIcon />
              </TextField.Slot>
            </TextField.Root>
          </Flex>
          {children}
          <ThemePanel defaultOpen={false} />
        </Theme>
      </body>
    </html>
  );
}
