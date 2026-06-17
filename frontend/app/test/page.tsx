"use client";

import React, { useState } from "react";
import { AddressInput, AddressValue } from "@/components/address-input";
import { AddressSelection } from "@/components/address-selection";

export default function TestPage() {
  const [address, setAddress] = useState<AddressValue>({
    address: "",
    city: "",
    postalCode: "",
    area_id: "",
    patokan: ""
  });

  const [shippingData, setShippingData] = useState({
    name: "Test User",
    phone: "08123456789"
  });

  const savedAddresses = [
    { label: "Alamat Utama", address: "Jalan Contoh No. 1, Cirebon" },
    { label: "Kantor", address: "Gedung Lab Fermion, Jakarta" }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-10 space-y-20">
      <section className="space-y-4">
        <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900">1. AddressInput (Atom)</h1>
        <div className="bg-white p-10 border border-black/5 rounded-sm">
            <AddressInput value={address} onChange={setAddress} />
        </div>
      </section>

      <section className="space-y-4">
        <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900">2. AddressSelection (Wrapper)</h1>
        <AddressSelection 
            address={address} 
            setAddress={setAddress}
            shippingData={shippingData}
            setShippingData={setShippingData}
            savedAddresses={savedAddresses}
        />
      </section>
    </div>
  );
}
