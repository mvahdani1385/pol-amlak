"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

export default function ApplicantsNewPage() {
  // Redirect to the main applicants page which contains the form
  redirect("/applicants");
}
