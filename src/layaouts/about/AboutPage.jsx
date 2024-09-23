import React, { useEffect, useState } from "react";
import { getAbout } from "../../service/API/typeCode/_serviceType";
import LoadingGlobal from "../../components/Loading";

const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAbout();
        if (data.data.length > 0) {
          setAboutData(data.data[0]);
        }
      } catch (err) {
        setError("Failed to fetch about data");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <LoadingGlobal />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        {aboutData?.fileUrl && (
          <div className="mb-4">
            <div className="flex justify-center mb-8">
              <img
                src={aboutData.fileUrl}
                alt="Preview"
                className="mt-2 w-64 h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        )}

        <div
          className="mt-2 text-gray-700 pb-4"
          dangerouslySetInnerHTML={{ __html: aboutData?.content }}
        />
      </div>
    </div>
  );
};

export default AboutPage;
