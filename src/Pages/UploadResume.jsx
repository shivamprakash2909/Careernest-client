import React, { useState } from "react";
import { FileText, UploadCloud, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useToast } from "@/components/common/ToastContext";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState(""); // "success" | "error" | ""
  const { showError, showWarning } = useToast();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (!selected) {
      setFile(null);
      setFileName("");
      setStatus("error");
      return;
    }

    if (selected.type !== "application/pdf") {
      setFile(null);
      setFileName("");
      setStatus("error");
      showError("Only PDF files are allowed.");
      return;
    }

    if (selected.size > maxSize) {
      setFile(null);
      setFileName("");
      setStatus("error");
      showError("File size must be less than 2MB.");
      return;
    }

    setFile(selected);
    setFileName(selected.name);
    setStatus("");
  };

  const handleUpload = async () => {
    if (!file) {
      showError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    // try {
    //   const res = await axiosInstance.post("/api/upload-resume", formData,{
    //   });
    //   const data = res.data ;
    //   console.log("Server response:", data);
    //   setStatus("success");
    // } catch (err) {
    //   console.error("Upload failed:", err);
    //   setStatus("error");
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6 border-t-8 border-blue-500">
        <div className="text-center">
          <FileText className="mx-auto text-blue-600 w-10 h-10 mb-2" />
          <h2 className="text-2xl font-bold text-blue-800">Upload Your Resume</h2>
          <p className="text-gray-500 text-sm">Only PDF files are supported</p>
        </div>

        {/* File Upload Box */}
        <div>
          <label
            htmlFor="resumeInput"
            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 hover:border-blue-600 hover:bg-blue-50 transition-colors duration-300 rounded-xl h-40 cursor-pointer text-center text-blue-700"
          >
            <UploadCloud className="w-8 h-8 mb-2" />
            {fileName ? (
              <span className="font-medium">{fileName}</span>
            ) : (
              <span className="font-medium">Click or drag file here</span>
            )}
            <span className="text-xs text-gray-500">Only PDF (Max 2MB)</span>
          </label>
          <input type="file" id="resumeInput" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </div>

        {/* Status Feedback */}
        {status === "success" && (
          <div className="flex items-center text-green-600 text-sm bg-green-100 p-2 rounded-md">
            <CheckCircle className="w-4 h-4 mr-2" />
            Resume uploaded successfully!
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center text-red-600 text-sm bg-red-100 p-2 rounded-md">
            <XCircle className="w-4 h-4 mr-2" />
            Upload failed or invalid file. Please select a valid PDF.
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Upload Resume
        </Button>
      </div>
    </div>
  );
}
