import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqData from "@/data/faqs.json";

export default function FaqsPage() {
  return (
    <div className="w-full md:h-full">
      <div className="py-2">
        <h1 className="font-bold text-center text-2xl sm:text-3xl mb-2">
          Frequently Asked Questions
        </h1>
      </div>
      <div className="m-1">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => {
            return (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-base text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
