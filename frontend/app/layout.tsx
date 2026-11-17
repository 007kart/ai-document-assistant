import './globals.css';
export const metadata = { title: 'AI Document Assistant', description: 'Ask questions about your documents with RAG' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
