import { useState } from "react";
import WalletConnect from "../../Components/Shared/WalletConnect";
import AuditReportModal from "../../Components/Modal/AuditReportModal";
import AuditForm from "../../Components/Audit/AuditForm";
import AuditLoader from "../../Components/Loader/AuditLoader";
import { useCreateAudit } from "../../hooks/useCreateAudit";

const Audit = () => {
  const [report, setReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const auditMutation = useCreateAudit({
    onSuccess: (data) => {
      setReport(data);
      setShowModal(true);
    },
    onError: () => {
    },
    onSettled: () => {
      setShowLoader(false);
    },
  });

  return (
    <>
      <AuditLoader show={showLoader} />

      <div className="max-w-3xl mx-auto py-10 px-4 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            Submit Smart Contract for Audit
          </h2>
          <WalletConnect />
        </div>

        <AuditForm
          isLoading={showLoader}
          onSubmit={(contract) => {
            setShowLoader(true);
            auditMutation.mutate(contract);
          }}
        />

        <AuditReportModal
          open={showModal}
          report={report}
          onClose={() => setShowModal(false)}
        />
      </div>
    </>
  );
};

export default Audit;
