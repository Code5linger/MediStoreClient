import { Suspense } from 'react';
import SellerDashboardClient from './SellerDashboardClient';

export default function SellerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading dashboard...</div>}>
      <SellerDashboardClient />
    </Suspense>
  );
}
