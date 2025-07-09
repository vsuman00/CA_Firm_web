import { ReactNode } from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface FullPageLoadingProps {
  message?: string;
}

export interface SectionLoadingProps {
  message?: string;
  height?: string;
}

export interface LoadingButtonProps {
  loading?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any; // Allow any other props to be passed
}

export function LoadingSpinner(props: LoadingSpinnerProps): JSX.Element;
export function FullPageLoading(props: FullPageLoadingProps): JSX.Element;
export function SectionLoading(props: SectionLoadingProps): JSX.Element;
export function LoadingButton(props: LoadingButtonProps): JSX.Element;

declare const LoadingState: {
  LoadingSpinner: typeof LoadingSpinner;
  FullPageLoading: typeof FullPageLoading;
  SectionLoading: typeof SectionLoading;
  LoadingButton: typeof LoadingButton;
};

export default LoadingState;