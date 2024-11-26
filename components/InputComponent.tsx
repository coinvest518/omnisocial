import React, { useState } from 'react';
import TemplateHeader from "./TemplateHeader";
import { Template } from "../constants/templates";

interface InputComponentProps {
    generateOutput: (template: Template, inputsData: { [key: string]: string }, model: string) => void;
    template: Template;
}

const renderInputField = (
    input: { id: any; label: any; placeholder?: string; type?: "text" | "textarea" | "select"; options?: string[] | undefined },
    value: string,
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
) => {
    if (input.type === "textarea") {
        return (
            <textarea
                id={input.id}
                value={value}
                onChange={handleChange}
                className="w-full p-2 mt-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
                placeholder={input.placeholder}
                rows={4}
                maxLength={800}
            />
        );
    } else if (input.type === "text") {
        return (
            <input
                maxLength={300}
                type="text"
                id={input.id}
                value={value}
                onChange={handleChange}
                className="w-full p-2 mt-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
                placeholder={input.placeholder}
            />
        );
    }
    return null;
};

const InputComponent: React.FC<InputComponentProps> = ({ template, generateOutput }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputsData, setInputsData] = useState<{ [key: string]: string }>({});
    const [selectedModel, setSelectedModel] = useState<string>("gpt-3.5-turbo");

    const handleInputChange = (e: any) => {
        setInputsData({ ...inputsData, [e.target.id]: e.target.value });
    };

    const handleClearInputs = () => {
        const clearedInputsData = { ...inputsData };
        Object.keys(clearedInputsData).forEach((key) => {
            clearedInputsData[key] = '';
        });
        setInputsData(clearedInputsData);
    };

    return (
        <div className="w-full lg:w-1/2 bg-gray-50 border-r flex flex-col">
            <TemplateHeader icon={template.icon} title={template.title} description={template.description} />
            <div className="flex flex-col p-4 flex-grow">
                {template.inputs.map((input) => (
                    <label htmlFor={input.id} className="block mt-4" key={input.id}>
                        {input.label}
                        {renderInputField(input, inputsData[input.id] || "", handleInputChange)}
                    </label>
                ))}

                {/* Model Selection Dropdown */}
                <label className="block mt-4">
                    Select Model:
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-2 mt-2 text-gray-900 bg-white border border-gray-200 rounded-lg"
                    >
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    </select>
                </label>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <button
                    onClick={handleClearInputs}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
                >
                    Clear inputs
                </button>
                <button
                    onClick={async () => {
                        setIsLoading(true);
                        await generateOutput(template, inputsData, selectedModel);
                        setIsLoading(false);
                    }}
                    className={`px-4 py-2 text-white bg-gradient-to-r from-purple-400 to-blue-400 rounded-md hover:from-purple-300 hover:to-blue-300 ${isLoading ? 'opacity-50' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? "Generating..." : "Generate"}
                </button>
            </div>
        </div>
    );
};
export default InputComponent;
