"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { VendorPricing, PartnerPricing } from "@/types";
import { updateVendorPricing, updatePartnerPricing } from "@/lib/actions";
import { fmtNaira } from "@/lib/format";

export function AdminPricingClient({
  vendor,
  partner,
}: {
  vendor: VendorPricing;
  partner: PartnerPricing;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [vSingle, setVSingle] = useState(String(vendor.single));
  const [vMulti, setVMulti] = useState(String(vendor.multi));
  const [vFlagship, setVFlagship] = useState(String(vendor.flagship));

  const [pCommunity, setPCommunity] = useState(String(partner.community));
  const [pFestival, setPFestival] = useState(String(partner.festival));
  const [pTitle, setPTitle] = useState(partner.title);

  function saveVendor(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    startTransition(async () => {
      const result = await updateVendorPricing({
        single: parseInt(vSingle, 10) || 0,
        multi: parseInt(vMulti, 10) || 0,
        flagship: parseInt(vFlagship, 10) || 0,
      });
      if (result.ok) {
        setMsg(result.message || "Vendor pricing updated.");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function savePartner(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    startTransition(async () => {
      const result = await updatePartnerPricing({
        community: parseInt(pCommunity, 10) || 0,
        festival: parseInt(pFestival, 10) || 0,
        title: pTitle,
      });
      if (result.ok) {
        setMsg(result.message || "Partner pricing updated.");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      {msg && (
        <p style={{ color: "var(--green-ok)", fontWeight: 700, marginBottom: 16 }}>{msg}</p>
      )}
      {error && (
        <p style={{ color: "var(--red)", fontWeight: 700, marginBottom: 16 }}>{error}</p>
      )}

      <form className="form-card" style={{ marginBottom: 28 }} onSubmit={saveVendor}>
        <h3 style={{ fontSize: 18, marginBottom: 6 }}>Vendor packages</h3>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>
          Current: Single {fmtNaira(vendor.single)} · Multi {fmtNaira(vendor.multi)} · Flagship{" "}
          {fmtNaira(vendor.flagship)}
        </p>
        <div className="field-row">
          <div className="field">
            <label>Single Campus (₦)</label>
            <input type="number" min={0} value={vSingle} onChange={(e) => setVSingle(e.target.value)} />
          </div>
          <div className="field">
            <label>Multi-Campus /stall (₦)</label>
            <input type="number" min={0} value={vMulti} onChange={(e) => setVMulti(e.target.value)} />
          </div>
          <div className="field">
            <label>Flagship (₦)</label>
            <input
              type="number"
              min={0}
              value={vFlagship}
              onChange={(e) => setVFlagship(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save vendor pricing"}
        </button>
      </form>

      <form className="form-card" onSubmit={savePartner}>
        <h3 style={{ fontSize: 18, marginBottom: 6 }}>Partnership tiers</h3>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}>
          Current: Community {fmtNaira(partner.community)} · Festival {fmtNaira(partner.festival)} ·
          Title {partner.title}
        </p>
        <div className="field-row">
          <div className="field">
            <label>Community Partner (₦)</label>
            <input
              type="number"
              min={0}
              value={pCommunity}
              onChange={(e) => setPCommunity(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Festival Partner (₦)</label>
            <input
              type="number"
              min={0}
              value={pFestival}
              onChange={(e) => setPFestival(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Title Sponsor label</label>
            <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Custom" />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save partner pricing"}
        </button>
      </form>
    </>
  );
}
