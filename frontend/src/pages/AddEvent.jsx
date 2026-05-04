import { useState } from "react";
import { toast } from "react-toastify";
import { eventService } from "../services/eventService";

function AddEvent() {
  const initialForm = {
    title: "",
    description: "",
    eventDate: "",
    location: "",
    files: [],
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const showToast = (type, message) => {
    toast.dismiss();
    toast[type](message, {
      toastId: "main-toast",
      onClick: () => toast.dismiss("main-toast"),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, files: [...prev.files, ...selectedFiles] }));
    e.target.value = "";
  };

  const removeFile = (index) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const data = new FormData();
    data.append("Title", form.title);
    data.append("Description", form.description);
    data.append("EventDate", form.eventDate);
    data.append("Location", form.location);
    form.files.forEach((file) => data.append("Files", file));

    try {
      await eventService.create(data);
      showToast("success", "Eventi u krijua me sukses!");
      setForm(initialForm);
    } catch (err) {
      const backendData = err.response?.data;
      if (backendData?.errors) {
        const formatted = {};
        Object.keys(backendData.errors).forEach((key) => {
          const k = key.charAt(0).toLowerCase() + key.slice(1);
          formatted[k] = backendData.errors[key][0];
        });
        setErrors(formatted);
        return;
      }
      showToast("error", backendData?.message || "Gabim gjatë krijimit.");
    }
  };

  const getInputClasses = (fieldName) => `
    w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all duration-200
    ${errors[fieldName]
      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
      : "border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">Krijo Event</h2>
          <p className="text-gray-500 mt-1">Plotësoni të dhënat më poshtë.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Titulli
            </label>
            <input
              type="text"
              name="title"
              placeholder="Titulli i eventit"
              value={form.title}
              onChange={handleChange}
              className={getInputClasses("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Data e Eventit
              </label>
              <input
                type="datetime-local"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className={getInputClasses("eventDate")}
              />
              {errors.eventDate && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.eventDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Lokacioni
              </label>
              <input
                type="text"
                name="location"
                placeholder="Ku mbahet eventi?"
                value={form.location}
                onChange={handleChange}
                className={getInputClasses("location")}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Përshkrimi
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Jepni më shumë detaje..."
              value={form.description}
              onChange={handleChange}
              className={`${getInputClasses("description")} resize-none`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.description}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Foto
            </label>
            <div className={`mt-1 border-2 border-dashed rounded-xl p-6 transition-colors bg-gray-50/50 ${
              errors.files ? "border-red-400" : "border-gray-200 hover:border-blue-400"
            }`}>
              <div className="space-y-1 text-center">
                <label className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                  <span>Ngarko foto</span>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="text-xs text-gray-400">JPG, JPEG, PNG</p>
                {form.files.length > 0 && (
                  <p className="text-xs text-green-600 font-medium pt-1">
                    {form.files.length} foto u zgjodhën
                  </p>
                )}
              </div>

              {form.files.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {form.files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        className="h-14 w-14 object-cover rounded-md border"
                        alt="preview"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-black/70 text-white text-[8px] w-5 h-5 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-500 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
          >
            Krijo Eventin
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;