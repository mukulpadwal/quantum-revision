import React from "react";

function HowToUsePage() {
  return (
    <div className="w-full md:h-full">
      <div className="py-2">
        <h1 className="font-bold text-center text-2xl sm:text-3xl mb-2">
          How to use Quantum Revision!
        </h1>
        <div>
          <ol className="list-decimal p-5 mx-4">
            <li className="my-4">
              <span className="font-bold text-lg">Sign Up / Login :</span>
              <ul className="list-disc list-inside">
                <li>
                  If you&apos;re new to Quantum Revision, sign up for an account
                  to get started. Existing users can log in with their
                  credentials.
                </li>
                <li>
                  Access Quantum Revision seamlessly on any device with a web
                  browser or download the progressive web app for easy access on
                  the go.
                </li>
              </ul>
            </li>

            <li className="my-4">
              <span className="font-bold text-lg">Homepage Dashboard :</span>
              <ul className="list-disc list-inside">
                <li>
                  Upon logging in, you&apos;ll be greeted by the intuitive
                  homepage dashboard, providing an overview of your revision
                  schedule and options to manage your study sessions
                  effectively.
                </li>
              </ul>
            </li>

            <li className="my-4">
              <span className="font-bold text-lg">
                Adding a Revision Entry :
              </span>
              <ul className="list-disc list-inside">
                <li>
                  To create a new revision entry, simply click the
                  &quot;Add&quot; button on the dashboard.
                </li>
                <li>
                  In the popup window, give your revision a descriptive title
                  and select today&apos;s date using the convenient date picker.
                </li>
                <li>
                  After entering the details, click &quot;Save&quot; to create
                  the note and schedule it for revision. If needed, you can also
                  delete the entry directly from this window or cancel to
                  discard it.
                </li>
              </ul>
            </li>

            <li className="my-4">
              <span className="font-bold text-lg">
                Managing Revision Schedule :
              </span>
              <ul className="list-disc list-inside">
                <li>
                  Your revision schedule is displayed as a table on the homepage
                  dashboard, providing a clear overview of upcoming study
                  sessions.
                </li>
                <li>
                  Delete existing entries effortlessly from this table to keep
                  your revision schedule organized and up to date.
                </li>
              </ul>
            </li>

            <li className="my-4">
              <span className="font-bold text-lg">
                Turning on Notifications :
              </span>
              <ul className="list-disc list-inside">
                <li>
                  Never miss a study session with Quantum Revision&apos;s
                  notification feature. In the revision schedule table, each
                  entry has a dedicated column with a toggle switch to enable
                  notifications.
                </li>
                <li>
                  Simply flip the switch to turn on notifications for specific
                  revision sessions, ensuring you receive timely reminders to
                  stay on track with your studies.
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default HowToUsePage;
