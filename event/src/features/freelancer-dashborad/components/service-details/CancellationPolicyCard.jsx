import React from "react";
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import InfoCard from "./InfoCard";

const POLICY_ITEMS = [
  { key: "beforeAcceptance", label: "Cancel before acceptance" },
  { key: "afterAcceptance", label: "Cancel after acceptance" },
  { key: "beforePayment", label: "Cancel before payment" },
];

export default function CancellationPolicyCard({ policy = {} }) {
  return (
    <InfoCard icon={ShieldCheck} title="Cancellation Policy">
      <div className="flex flex-col gap-3">
        {POLICY_ITEMS.map((item) => {
          const allowed = Boolean(policy[item.key]);
          return (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{item.label}</span>
              {allowed ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
                  <CheckCircle2 size={14} /> Allowed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
                  <XCircle size={14} /> Not allowed
                </span>
              )}
            </div>
          );
        })}
      </div>
    </InfoCard>
  );
}
