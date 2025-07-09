import React, { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

declare function Layout(props: LayoutProps): React.ReactElement;

export default Layout;
