import { Suspense } from "react";
import EvaluateClient from "./EvaluateClient";

export default function EvaluatePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading evaluation...</div>}>
      <EvaluateClient />
    </Suspense>
  );
}