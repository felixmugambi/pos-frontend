import AuthGuard from "@/components/auth/AuthGuard";
import POSHeader from "@/components/pos/POSHeader";
import CartTable from "@/components/pos/CartTable";
import PaymentPanel from "@/components/pos/PaymentPanel";
import ScanBarcode from "@/components/pos/ScanBarcode";

export default function POSPage() {
  return (
    <AuthGuard>
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">

        <POSHeader />

        {/* SCANNER */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <ScanBarcode />
        </div>

        {/* MAIN */}
        <div className="flex flex-1 flex-col lg:flex-row min-h-0">

          {/* CART */}
          <div className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto min-h-0">
            <CartTable />
          </div>

          {/* PAYMENT */}
          <div className="w-full lg:w-[350px] bg-white dark:bg-gray-900 border-t lg:border-l border-gray-200 dark:border-gray-700 p-4 shrink-0">
            <PaymentPanel />
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}