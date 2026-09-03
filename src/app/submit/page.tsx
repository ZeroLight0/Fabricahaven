import type { Metadata } from "next";
import SubmitForm from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit Your Fabric",
  description:
    "Upload a photo of your fabric, tell us the occasion and your measurements, and get 5 AI-suggested styles with yardage and pricing.",
};

export default function SubmitPage() {
  return <SubmitForm />;
}
