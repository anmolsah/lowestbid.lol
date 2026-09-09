import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Confirmed — lowestbid.lol',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
