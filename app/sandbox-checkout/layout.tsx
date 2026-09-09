import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sandbox Checkout — lowestbid.lol',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SandboxCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
