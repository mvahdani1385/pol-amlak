"use Client";

import Link from "next/link";
import { useState } from "react";

function ContactFix({ contactBoxs }: { contactBoxs: any }) {
  const [open, setOpen] = useState(false);
  const finalBoxs = contactBoxs.contactBoxs;
  console.log(finalBoxs);

  return (
    <>
      <style></style>
      {finalBoxs.length > 0 && (
        <div className={`contactFix ${open ? "open" : ""}`}>
          <button
            onClick={() => {
              if (open) {
                setOpen(false);
              } else {
                setOpen(true);
              }
            }}
            className="ccdiv"
          >
            <i className={`${!open ? 'ri-chat-ai-line' : 'ri-close-line'}`}></i>
          </button>

          <div className="socalsall">
                {finalBoxs
                .filter((fin: any) => fin.name === "اینستاگرام")
                .map((fin: any) => (
                <Link key={fin.id || fin.name} href={fin.link} className="sochial">
                    <i className={`${fin.icon} ccdiv`}></i>
                    <p>{fin.name}</p>
                </Link>
                ))}

                {finalBoxs
                .filter((fin: any) => fin.name === "واتساپ")
                .map((fin: any) => (
                <Link key={fin.id || fin.name} href={fin.link} className="sochial">
                    <i className={`${fin.icon} ccdiv`}></i>
                    <p>{fin.name}</p>
                </Link>
                ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ContactFix;
