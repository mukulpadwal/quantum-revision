import React from "react";

function AboutPage() {
  return (
    <div className="w-full md:h-full">
      <div className="py-2">
        <h1 className="font-bold text-center text-2xl sm:text-3xl mb-2">
          Welcome to Quantum Revision!
        </h1>
        <h2 className="font-semibold text-center sm:text-xl mt-2">
          Transform Your Study Sessions with QuantumRevision!
        </h2>
      </div>
      <div className="m-2 sm:m-8 p-2">
        <p>
          At Quantum Revision, we believe in maximizing your study efficiency to
          achieve your academic goals effectively. Our app is founded on the
          principle of the 1247 Memory Technique, a proven method to enhance
          retention and comprehension during study sessions.
        </p>
      </div>
      <ul className="list-disc m-2 sm:m-8 p-2">
        <li className="underline underline-offset-4 font-bold mb-2">
          What is the 1247 Technique?
        </li>
        <li>
          The 1247 Technique is a revolutionary memory strategy designed to
          optimize your learning process. It emphasizes the importance of
          repeated revision at strategic intervals to solidify your
          understanding of any subject matter. With this technique, you&apos;ll
          engage in four study sessions following a specific timeline:
          <br />
          <ol className="px-4 my-2 list-decimal list-inside">
            <li>
              <span className="font-semibold">Initial Study (Day 1):</span> Dive
              into the material for the first time.
            </li>
            <li>
              <span className="font-semibold">First Revision (Day 2):</span>{" "}
              Reinforce your understanding within 24 hours of the initial study.
            </li>
            <li>
              <span className="font-semibold">Second Revision (Day 4):</span>{" "}
              Review the material again, building upon your previous knowledge.
            </li>
            <li>
              <span className="font-semibold">Final Revision (Day 7):</span>{" "}
              Cement your grasp of the concepts with a final comprehensive
              review.
            </li>
          </ol>
        </li>
      </ul>
      <ul className="list-disc m-2 sm:m-8 p-2">
        <li className="underline underline-offset-4 font-bold mb-2">
          Why Choose the 1247 Technique?
        </li>
        <li>
          Efficiency: By focusing on targeted revision sessions, you optimize
          your study time, spending less time overall while achieving better
          results. Retention: Through repeated exposure, the concepts move from
          short-term to long-term memory, ensuring a deeper understanding and
          lasting retention. Confidence: With enhanced recall abilities,
          you&apos;ll approach exams and assignments with confidence, knowing
          you&apos;ve mastered the material thoroughly. Experience the
          Difference
        </li>
      </ul>
      <ul className="list-disc m-2 sm:m-8 p-2">
        <li className="underline underline-offset-4 font-bold mb-2">
          Experience the Difference
        </li>
        <li>
          Say goodbye to last-minute cramming and hello to effective,
          stress-free studying with Quantum Revision.
        </li>
      </ul>
    </div>
  );
}

export default AboutPage;