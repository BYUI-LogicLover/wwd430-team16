export default function ContactPage() {
  return (
    <div className="bg-[#f8f8f8] text-[#343434]">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-[family-name:var(--font-montserrat)] text-4xl font-bold">Contact us</h1>
        <p className="mt-2 opacity-70">We&apos;d love to hear from you.</p>

        <form className="mt-8 grid gap-4">
          <input type="text" placeholder="Your name" className="rounded-md border border-black/10 px-3 py-2" />
          <input type="email" placeholder="Email" className="rounded-md border border-black/10 px-3 py-2" />
          <textarea rows={5} placeholder="Message" className="rounded-md border border-black/10 px-3 py-2" />
          <button
            type="submit"
            className="rounded-md bg-[#28582e] px-6 py-3 font-medium text-[#f8f8f8] hover:opacity-90"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
