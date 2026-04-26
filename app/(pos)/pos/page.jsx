import AuthGuard from "@/components/auth/AuthGuard";
import POSHeader from "@/components/pos/POSHeader";
import CartTable from "@/components/pos/CartTable";
import PaymentPanel from "@/components/pos/PaymentPanel";
import ScanBarcode from "@/components/pos/ScanBarcode";

export default function POSPage() {
  return (
    <AuthGuard>
      <div className="h-screen flex flex-col bg-gray-100">

        <POSHeader />

        <div className="bg-white border-b p-3 sm:p-4">
          <ScanBarcode />
        </div>

        <div className="flex flex-1 flex-col lg:flex-row min-h-0">

          <div className="flex-1 bg-white overflow-y-auto min-h-0">
            <CartTable />
          </div>

          <div className="w-full lg:w-[350px] bg-white border-t lg:border-l p-4 shrink-0">
            <PaymentPanel />
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}