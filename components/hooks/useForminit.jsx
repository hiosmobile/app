import { useState, useRef } from "react";
import { Forminit } from "forminit";

export function useForminit(formId) {
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = useRef(false);

  const submit = async (formData) => {
    if (isSubmitting.current) return false;

    // Apply Forminit's required apostrophe fix to all possible name fields
    ["fi-sender-lastName", "fi-sender-firstName", "fi-sender-fullName"].forEach((key) => {
      const val = formData.get(key);
      if (typeof val === "string") {
        formData.set(key, val.replace(/[\u2018\u2019]/g, "'"));
      }
    });

    isSubmitting.current = true;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const forminit = new Forminit();
      const { data, error } = await forminit.submit(formId, formData);

      if (!error && typeof data?.hashId === "string") {
        setStatus("success");
        return true;
      } else {
        console.error("Forminit Error:", error);
        setStatus("error");
        
        const errField = error?.fieldName || error?.message?.split(" ")[0];
        if (errField?.includes("Name")) {
          setErrorMessage("Please use only letters, spaces, hyphens, apostrophes and periods.");
        } else if (errField?.includes("date")) {
          setErrorMessage("Please enter a valid date.");
        } else if (error?.code === "TOO_MANY_REQUESTS") {
          setErrorMessage("Please wait a few seconds before trying again.");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
        return false;
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Network error. Please check your connection.");
      return false;
    } finally {
      isSubmitting.current = false;
      if (status !== "success") setStatus("idle");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  return { status, errorMessage, setErrorMessage, submit, reset };
}