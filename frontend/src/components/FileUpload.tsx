"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import toast from "react-hot-toast";

interface FileUploadProps {
  folderId: number | null;
  onUploaded: () => void;
}

interface UploadingFile {
  name: string;
  progress: number;
}

export default function FileUpload({ folderId, onUploaded }: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      for (const file of accepted) {
        setUploadingFiles((prev) => [...prev, { name: file.name, progress: 0 }]);
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadingFiles((prev) =>
              prev.map((f) => (f.name === file.name ? { ...f, progress } : f))
            );
          },
          (error) => {
            toast.error(`Failed to upload ${file.name}`);
            setUploadingFiles((prev) => prev.filter((f) => f.name !== file.name));
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            toast.success(`${file.name} uploaded`);
            onUploaded();
            setUploadingFiles((prev) => prev.filter((f) => f.name !== file.name));
          }
        );
      }
    },
    [onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-primary-400 bg-primary-50 scale-[1.01] shadow-inner"
            : "border-gray-200 hover:border-primary-300 hover:bg-primary-50/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="py-10 px-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
            isDragActive ? "bg-primary-100" : "bg-gray-100"
          }`}>
            <svg className={`w-7 h-7 transition-colors ${isDragActive ? "text-primary-600" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
          </div>
          <p className={`text-sm font-semibold mb-1 ${
            isDragActive ? "text-primary-700" : "text-gray-700"
          }`}>
            {isDragActive ? "Release to upload" : "Drop files here"}
          </p>
          <p className="text-xs text-gray-400">
            {isDragActive
              ? "Files will be saved to the current folder"
              : "or click to browse from your computer · Max 500 MB"}
          </p>
        </div>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploadingFiles.map((f) => (
            <div key={f.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700 truncate">{f.name}</span>
                </div>
                <span className="text-xs font-bold text-primary-600 shrink-0">{f.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${f.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
