import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

const Faq = () => {
  const t = useTranslations("HomePage.faq");

  return (
    <div className="p-12">
      <h4 className="text-4xl font-medium">Faq</h4>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl">{t("question1.question")}</AccordionTrigger>
          <AccordionContent className="leading-6">{t("question1.answer")}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-1">
        <AccordionTrigger className="text-xl">{t("question2.question")}</AccordionTrigger>
        <AccordionContent className="leading-6">{t("question2.answer")}</AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-1">
        <AccordionTrigger className="text-xl">{t("question3.question")}</AccordionTrigger>
        <AccordionContent className="leading-6">{t("question3.answer")}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Faq;
