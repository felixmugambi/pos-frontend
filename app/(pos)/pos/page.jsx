import AuthGuard from "@/components/auth/AuthGuard";
import POSHeader from "@/components/pos/POSHeader";
import CartTable from "@/components/pos/CartTable";
import PaymentPanel from "@/components/pos/PaymentPanel";
import CashierScannerInput from "@/components/pos/CashierScannerInput";

export default function POSPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 overflow-hidden">

        <POSHeader />

        {/* SCANNER */}
        <div className="bg-white dark:bg-gray-900 border-b p-2 sm:p-4 sticky top-0 z-20">
          <CashierScannerInput />
        </div>

        {/* MAIN AREA */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

          {/* CART */}
          <div className="flex-1 min-h-[50vh] lg:min-h-0 overflow-y-auto bg-white dark:bg-gray-900">
            <CartTable />
          </div>

          {/* PAYMENT */}
          <div className="w-full lg:w-[350px] border-t lg:border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <PaymentPanel />
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
