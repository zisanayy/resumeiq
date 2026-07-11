import { useRef, useState } from "react";

function FileDropzone({
  selectedFile,
  onFileSelect,
  inputId = "resume-upload",
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const validateAndSelect = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and DOCX files are allowed.");
      return;
    }

    onFileSelect(file);
  };

  const handleInputChange = (event) => {
    validateAndSelect(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    validateAndSelect(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-300 ${
          dragging
            ? "border-blue-600 bg-blue-100 dark:bg-slate-700"
            : "border-blue-300 dark:border-blue-700 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700"
        }`}
      >
        <div className="text-6xl">{selectedFile ? "✅" : "📄"}</div>

        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-slate-200">
          {dragging
            ? "Drop your resume here"
            : selectedFile
            ? "Resume ready"
            : "Drag & drop your resume here"}
        </p>

        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          or click to browse · PDF or DOCX
        </p>

        {selectedFile && (
          <div className="mt-5 max-w-full break-all rounded-lg bg-green-100 px-4 py-2 font-medium text-green-700">
            {selectedFile.name}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".pdf,.docx"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

export default FileDropzone;