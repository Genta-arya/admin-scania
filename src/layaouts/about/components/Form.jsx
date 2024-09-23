import React, { useEffect, useState } from "react";
import {
  getAbout,
  manageAbout,
} from "../../../service/API/typeCode/_serviceType";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import app from "../../../service/FirebaseConfig";
import { Editor } from "@tinymce/tinymce-react";
import handleError from "../../../utils/HandleError";
import LoadingGlobal from "../../../components/Loading";
import { toast } from "sonner";

const Form = () => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState(null);
  const [id, setId] = useState(null);
  const [error, setError] = useState(null);

  const fetchAboutData = async () => {
    try {
      const data = await getAbout();

      if (data.data.length > 0) {
        const firstEntry = data.data[0];
        setAboutData(firstEntry);
        setContent(firstEntry.content || "");
        setId(firstEntry.id);
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let fileUrl = "";
    if (file) {
      const storage = getStorage(app);
      const fileRef = ref(storage, `about/${file.name}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }

    try {
      await manageAbout(id, { content, fileUrl });

      setContent("");
      setFile(null);
      fetchAboutData();
      toast.success("About updated successfully");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingGlobal />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
      <div>
        <label className="block text-gray-700 text-sm font-bold ">
          Change Images
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-4 border w-full px-2 py-1"
        />
      </div>
      {aboutData?.fileUrl && (
        <div className="mt-4">
          <h3 className="font-semibold">Current Images:</h3>
          <a
            href={aboutData.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center mb-4"
          >
            <img
              src={aboutData.fileUrl}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          </a>
        </div>
      )}

      <Editor
        apiKey="azzsxiwq7ddj57tp914f7m74kiiezzwpd91333v09liha0x5"
        value={content}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "image",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | help | image",
          image_advtab: true,
        }}
        onEditorChange={handleContentChange}
      />

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-gray-800 w-full text-white rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
