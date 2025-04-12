import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { onCLS } from "web-vitals";
import { ApiService } from "../apiHandler/ApiService";
import ToastService from "../components/ToastService";

const ProjectSection = ({ selectedProject, onClose,showProjectModal }) => {
  const [formData, setFormData] = useState({});

  

  useEffect(() => {
      setFormData(selectedProject);
  }, [selectedProject]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };


  const handleDateInput = (field) => (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4);
    if (val.length > 7) val = val.slice(0, 7) + "-" + val.slice(7);
    setFormData({ ...formData, [field]: val.slice(0, 10) });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const original = selectedProject;
    const updatedData = {};
  
    Object.keys(formData).forEach((key) => {
      const originalValue = original[key];
      const currentValue = formData[key];
        if ((key === "startDate" || key === "endDate") && currentValue !== originalValue) {
          updatedData[key] = `${currentValue}T00:00:00`; 
      }
        else if (currentValue !== originalValue) {
        updatedData[key] = currentValue;
      }
    });
    updatedData.projectId = original.projectId;
    console.log("🔄 Updated Fields:", updatedData);
    await updatedProjectDetails(updatedData,updatedData.projectId);
    onClose();
  };
  

  const updatedProjectDetails = async (updatedData, projectId) => {
    try {
      const respMessage = await ApiService.updateProject(updatedData, projectId);
      if(respMessage.status===200){
      ToastService.success("✅ Project updated:");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      }else{
        ToastService.error("Project not updated:");   
      }
    } catch (error) {
      ToastService.error("Project not updated:");   
    }
  };
  
  
  

  return (
    <div>
{showProjectModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Icons.Pencil className="w-5 h-5 text-blue-600" />
        {`Update project  ${formData.projectName}`}
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4 text-sm">
        <div>
          <label className="text-gray-700">Project Name</label>
          <input
            value={formData.projectName}
            onChange={handleChange("projectName")}
            className="mt-1 w-full border px-3 py-2 rounded"
            placeholder="Project Name"
          />
        </div>

        <div>
          <label className="text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={handleChange("description")}
            className="mt-1 w-full border px-3 py-2 rounded"
            placeholder="Description"
          />
        </div>

        {/* Status Dropdown same as before */}
        {/* ... (keep your dropdown logic here, no changes needed) */}

        <div>
          <label className="text-gray-700">Creator</label>
          <input
            value={formData.projectCreator}
            onChange={handleChange("projectCreator")}
            className="mt-1 w-full border px-3 py-2 rounded"
            placeholder="Creator"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-gray-700">Start Date</label>
    <input
      type="text"
      placeholder="YYYY-MM-DD"
      value={formData.startDate?.slice(0, 10) || ""}
      onChange={handleDateInput("startDate")}
      className="mt-1 w-full border px-3 py-2 rounded"
    />
  </div>

  <div>
    <label className="text-gray-700">End Date</label>
    <input
      type="text"
      placeholder="YYYY-MM-DD"
      value={formData.endDate?.slice(0, 10) || ""}
      onChange={handleDateInput("endDate")}
      className="mt-1 w-full border px-3 py-2 rounded"
    />
  </div>
</div>


        <div>
          <label className="text-gray-700">Priority</label>
          <select
            value={formData.priority}
            onChange={handleChange("priority")}
            className="mt-1 w-full border px-3 py-2 rounded bg-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => onClose(true)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {"Update"}
          </button>
        </div>
      </form>

      <button
        onClick={() => onClose(true)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        <Icons.X className="w-5 h-5" />
      </button>
    </div>
  </div>
)}

</div>
  );
};

export default ProjectSection;
