import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

export function FaqList({
  faqs,
}: {
  faqs: readonly { question: string; answer: string }[];
}) {
  return (
    <div className="faq-list">
      {faqs.map((faq) => (
        <details className="faq-item" key={faq.question}>
          <summary>
            <span>{faq.question}</span>
            <span className="faq-chevron" aria-hidden="true">
              <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
            </span>
          </summary>
          <div className="faq-answer"><p>{faq.answer}</p></div>
        </details>
      ))}
    </div>
  );
}
