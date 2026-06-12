import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Contact us</h1>
        <p className="mt-2 opacity-70">We&apos;d love to hear from you.</p>

        <ContactForm />
      </div>
    </div>
  );
}
