import React, { useState } from 'react';
import InputComponent from "./InputComponent";
import OutputComponent from "./OutputComponent";
import { Template } from "../constants/templates";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';


const InputOutputComponent: React.FC<{ template: Template }> = ({ template }) => {
  const [output, setOutput] = useState("");
  const { data: session, update } = useSession();
  const router = useRouter();

  const { status } = useSession();
  // Redirect to login if the user is not authenticated
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const generateOutputHandler = async (template: Template, inputsData: { [key: string]: string}, model: string) => {
    try {
      const result: any = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template,
          inputsData,
          model,
        }),
      });
      const { reply } = await result.json();
      setOutput(reply || '');

      // Log template usage if user is authenticated
      if (session?.user) {        
        try {
          const response = await fetch('/api/logrecentTemplates', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              templateId: template.id,
              content: reply,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error logging template usage:", errorData);
            // Optionally show an error message to the user.
            //  e.g. alert("Failed to log usage. Your credits were not deducted.")
            return; // Stop further execution.
          }
          // Update credits in the frontend *after* successful logging
          await update({
            ...session,
            user: {
              ...session.user,
              credits: session.user.credits - 1 // Directly decrement credits
            }
          });
        } catch (logUsageError) {
          console.error('Error logging template usage:', logUsageError);
          // Handle the error, perhaps by showing an error message.
        }
      }
    } catch (error) {
      console.error('Error generating output:', error);
    }
  };

  const handleClearOutput = () => {
    setOutput("");
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full">
      <InputComponent
        template={template}
        generateOutput={generateOutputHandler}
      />
      <OutputComponent
        onClearOutput={handleClearOutput}
        generatedOutput={output}
      />
    </div>
  );
};

export default InputOutputComponent;
