import privacyPolicyData from "@/data/privacy-policy.json";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full md:h-full">
      <div className="py-2">
        <h1 className="font-bold text-center text-2xl sm:text-3xl mb-2">
          Privacy Policy
        </h1>
      </div>
      <div className="m-2 sm:m-8 p-2">
        <p className="font-medium">
          At Quantum Revision, we are committed to protecting your privacy. This
          Privacy Policy outlines the information we collect, how we use it, and
          your choices regarding your personal data.
        </p>
      </div>

      {privacyPolicyData.map((data, index) => {
        return (
          <div className="m-2 sm:m-8 p-2" key={index}>
            <h2 className="text-base sm:text-lg font-bold underline underline-offset-4 mb-2">
              {data.section}
            </h2>
            <p className="font-medium">{data.content}</p>
          </div>
        );
      })}
    </div>
  );
}
