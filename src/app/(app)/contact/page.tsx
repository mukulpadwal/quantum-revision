import React from "react";
import ContactMeForm from "@/components/ContactMeFrom";

function ContactPage() {
  return (
    <div className="w-full md:h-full">
      <div className="py-2">
        <h1 className="font-bold text-center text-2xl sm:text-3xl">
          Contact Us
        </h1>
      </div>
      <div className="m-2 sm:m-8 p-2 text-center">
        <p>
          Got a question or need assistance? We&apos;re here to help! Feel free
          to reach out to us with any inquiries, feedback, or concerns you may
          have. Your satisfaction is our priority, and we&apos;re committed to
          providing you with prompt and helpful support. Get in touch with us
          today!
        </p>
      </div>
      <div>
        <ContactMeForm />
      </div>
    </div>
  );
}

export default ContactPage;
