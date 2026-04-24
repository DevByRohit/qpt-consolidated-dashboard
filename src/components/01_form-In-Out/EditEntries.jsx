import { useState } from "react";
import EditHeader from "./edit/EditHeader";
import TransactionCard from "./edit/TransactionCard";
import useTransactions from "./edit/useTransactions";
import AlertModal from "../../alert-modal/AlertModal";
import Loader from "../../alert-modal/Loader";

const EditEntries = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { transactions, loading, fetchTransactions } =
    useTransactions(selectedDate);

  // Alert state
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  return (
    <>
      <div className="h-[calc(100vh-82px)] flex flex-col gap-2">
        {/* HEADER (FIXED) */}
        <EditHeader
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onRefresh={fetchTransactions}
        />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto relative">
          {/* LOADER OVERLAY (NEW) */}
          {loading && (
            <Loader
              message="Refreshing data..."
              subMessage="Fetching latest transactions"
            />
          )}

          {/* CONTENT */}
          {!loading && transactions.length === 0 ? (
            <p className="text-gray-500">No entries found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {transactions.map((txn) => (
                <TransactionCard
                  key={txn.transactionid}
                  txn={txn}
                  onRefresh={fetchTransactions}
                  setAlertConfig={setAlertConfig}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={() => {
          alertConfig.onConfirm?.();
          setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default EditEntries;
