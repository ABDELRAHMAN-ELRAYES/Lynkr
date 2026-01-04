import Button from "@/components/ui/Button";

const SupportSection = () => {
  return (
    <section className="max-w-[90rem] mx-auto rounded-lg my-[6rem] px-4 lg:px-24 py-16 lg:py-24 bg-global-1">
      <div className="text-center text-white space-y-8">
        <h2 className="text-4xl lg:text-5xl font-bold font-inter">
          We're Here for You — Anytime, Anywhere
        </h2>
        <p className="text-xl lg:text-2xl font-inter">
          Whether you're a freelancer or a client, our dedicated support team is
          available 24/7 to help you with any questions, issues, or guidance you
          need — so you can focus on what really matters.
        </p>
        <Button className="h-12 px-12 bg-white text-brand-purple-600 cursor-pointer text-[#7682e8] font-semibold rounded-full font-inter">
          Contact Us
        </Button>
      </div>
    </section>
  );
};

export default SupportSection;