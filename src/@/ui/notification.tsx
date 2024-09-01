import { Dispatch, SetStateAction, useState } from "react";

import { cn } from "@lib/utils"; // Ensure you have the cn function from previous utils
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

type NotificationProps = {
  type: "success" | "warning" | "error";
  message?: string;
  messages?: Array<string>;
  setMessages?: Dispatch<SetStateAction<string[]>>;
};

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  messages,
  setMessages,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const warnings = message
    ?.split("Warning: ")
    .filter((msg) => msg)
    .map((msg) => `Warning: ${msg}`);

  const msgs = message
    ?.split("Inventory ")
    .filter((msg) => msg)
    .map((msg) => `Inventory ${msg}`);

  return (
    <div
      className={cn(
        "rounded-2xl p-6 text-base/6  flex ",
        type === "success" && "bg-lime-50 text-lime-700",
        type === "warning" && "bg-amber-50 text-amber-700",
        type === "error" && "bg-red-50 text-red-700"
      )}
    >
      <div className="">
        {type === "success" && (
          <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-lime-400" />
        )}
        {type === "warning" && (
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="h-6 w-6 text-amber-400"
          />
        )}
        {type === "error" && (
          <XCircleIcon aria-hidden="true" className="h-6 w-6 text-red-400" />
        )}
      </div>
      <div className="ml-3">
        <h3
          className={cn(
            "font-medium",
            type === "success" && "text-lime-800",
            type === "warning" && "text-amber-800",
            type === "error" && "text-red-800"
          )}
        >
          {type === "success"
            ? "Success"
            : type === "warning"
            ? "Attention needed"
            : "Error"}
        </h3>
        <div className="mt-2">
          {type === "warning" &&
            warnings?.map((item, index) => (
              <p key={index} className="pb-2">
                {item}
              </p>
            ))}
          {type === "success" &&
            msgs?.map((item, index) => (
              <p key={index} className="pb-2">
                {item}
              </p>
            ))}

          {messages?.map((item, index) => (
            <p key={index} className="pb-2">
              {item}
            </p>
          ))}

          {type === "error" && <p>{message}</p>}
        </div>
      </div>

      <div className="ml-auto pl-3">
        <div className="-mx-1.5 -my-1.5">
          <button
            type="button"
            className={cn(
              "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
              type === "success" &&
                "bg-lime-50 text-lime-500 hover:bg-lime-100 focus:ring-lime-600 focus:ring-offset-lime-50",
              type === "warning" &&
                "bg-amber-50 text-amber-500 hover:bg-amber-100 focus:ring-amber-600 focus:ring-offset-amber-50",
              type === "error" &&
                "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50"
            )}
            onClick={
              messages ? () => setMessages && setMessages([]) : () => setVisible(false)
            }
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
