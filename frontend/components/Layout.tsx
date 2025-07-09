import React, { ReactNode } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import RunningBanner from "./RunningBanner";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <RunningBanner />
      <Footer />
    </div>
  );
}