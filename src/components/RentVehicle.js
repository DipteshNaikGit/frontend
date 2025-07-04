import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
const BASE_URL = process.env.REACT_APP_API_URL;

function RentVehicle() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    option: "",
    vehicle: "",
    model: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    option: "",
    vehicle: "",
    vehicleTypeId: "",
    model: "",
    startDate: "",
    endDate: "",
  });

  const validateStep = () => {
    let errors = {};

    if (step === 1) {
      if (!formData.firstName.trim())
        errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    }
    if (step === 2) {
      if (!formData.option)
        errors.option = "Please select whether two or four wheeler";
    }

    if (step === 3 && !formData.vehicleTypeId) {
      errors.vehicleTypeId = "Please select a vehicle type.";
    }

    if (step === 4) {
      if (!formData.model) errors.model = "Please select a vehicle";
    }
    if (step === 5) {
      if (!formData.startDate) errors.startDate = "Start date is required";
      if (!formData.endDate) errors.endDate = "End date is required";

      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (start > end) {
          errors.startDate = "Start date must be before end date";
          errors.endDate = "End date must be after start date";
        }
      }
    }

    setErrors(errors);
    return errors;
  };

 
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  
  const handleNext = () => {
    const errors = validateStep();
    if (Object.keys(errors).length === 0) {
      setStep((prevStep) => Math.min(prevStep + 1, 6));
    }
  };

 
  const handleBack = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "Start date must less than  end date.",
      });
    }

  
    const wheel = wheels.find((w) => w.id === formData.option);
    const vehicleType = vehicleTypes.find(
      (vt) => vt.id === formData.vehicleTypeId
    );
    const vehicle = vehicles.find((v) => v.id === formData.model);

   
    const bookingData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      wheel: {
        id: wheel?.id || null,
        count: wheel?.count || "N/A",
      },
      vehicleType: {
        id: vehicleType?.id || null,
        type: vehicleType?.type || "N/A",
      },
      vehicle: {
        id: vehicle?.id || null,
        name: vehicle?.name || "N/A",
      },
    };

   

    try {
      const response = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Booking Confirmed",
          text: data.message || "Your vehicle has been booked successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text:
            data.message ||
            "This vehicle is already booked for the selected dates.",
        });
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  };

  useEffect(() => {
   
    setFormData((prev) => ({
      ...prev,
      vehicleTypeId: "",
      model: "",
    }));
    setVehicleTypes([]);
    setVehicles([]);
  }, [formData.option]);
  useEffect(() => {
   
    setFormData((prev) => ({
      ...prev,
      model: "",
    }));
    setVehicles([]);
  }, [formData.vehicleTypeId]);

  const [wheels, setWheels] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
  
    const fetchWheels = async () => {
      const response = await fetch(`${BASE_URL}/api/wheels`);
      const data = await response.json();
      setWheels(data);
    };
    fetchWheels();
  }, []);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        if (step === 3 && formData.option) {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/vehicle-types/${formData.option}`
          );
          const data = await response.json();
          setVehicleTypes(data);
        }
      } catch (error) {
        console.error("Failed to fetch vehicle types:", error);
      }
    };

    fetchVehicleTypes();
  }, [step]);

  useEffect(() => {
    const fetchVehicles = async () => {
      console.log(formData.vehicleTypeId, "###");
      if (step === 4 && formData.vehicleTypeId) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/vehicles/${formData.vehicleTypeId}`
          );
          const data = await response.json();
          setVehicles(data);
        } catch (err) {
          console.error("Failed to fetch vehicles:", err);
        }
      }
    };

    fetchVehicles();
  }, [step]);


  const form1to5 = (
    <form>
     
      {step === 1 && (
        <div className="step">
          <h3>First, what's your name?</h3>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            required
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
             placeholder="Enter last name"
            onChange={handleChange}
            required
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
      )}

    
      {step === 2 && (
        <div className="step">
          <h3>Number of Wheels</h3>

          {wheels.map((wheel) => (
            <label key={wheel.id}>
              <input
                type="radio"
                name="option"
                value={wheel.id}
                checked={formData.option === wheel.id}
                onChange={handleChange}
              />
              {wheel.count} Wheels
            </label>
          ))}

          {errors.option && <p className="error">{errors.option}</p>}
        </div>
      )}

      {step === 3 && (
        <div className="step">
          <h3>Select Vehicle Type</h3>

          {vehicleTypes.map((type) => (
            <label key={type.id}>
              <input
                type="radio"
                name="vehicleTypeId"
                value={type.id}
                checked={formData.vehicleTypeId === type.id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    vehicleTypeId: e.target.value,
                  }))
                }
              />
              {type.type}
            </label>
          ))}

          {errors.vehicleTypeId && (
            <p className="error">{errors.vehicleTypeId}</p>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="step">
          <h3>Select Vehicle</h3>

          {vehicles.map((vehicle) => (
            <label key={vehicle.id}>
              <input
                type="radio"
                name="model"
                value={vehicle.id}
                checked={formData.model === vehicle.id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, model: e.target.value }))
                }
              />
              {vehicle.name}
            </label>
          ))}

          {errors.model && <p className="error">{errors.model}</p>}
        </div>
      )}

    
      {step === 5 && (
        <div className="step">
          <h3>Date Range Picker</h3>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          {errors.startDate && <p className="error">{errors.startDate}</p>}

          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
          {errors.endDate && <p className="error">{errors.endDate}</p>}
        </div>
      )}


      <div className="navigation">
        {step > 1 && (
          <button type="button" onClick={handleBack}>
            Back
          </button>
        )}{" "}
       
        {step < 5 ? (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button type="button" onClick={handleNext}>
            Next
          </button> 
        )}
      </div>
    </form>
  );
const PreviewRow = ({ label, value }) => (
  <tr>
    <td className="label-cell">{label}</td>
    <td className="value-cell">{value}</td>
  </tr>
);
const form6Preview = (
  <form onSubmit={handleSubmit} className="form-preview">
    <h3 >Preview</h3>

    <div className="preview-table-container">
      <table className="preview-table">
        <tbody>
          <PreviewRow label="First Name" value={formData.firstName} />
          <PreviewRow label="Last Name" value={formData.lastName} />
          <PreviewRow
            label="Number of Wheels"
            value={wheels.find((w) => w.id === formData.option)?.count || "N/A"}
          />
          <PreviewRow
            label="Vehicle Type"
            value={
              vehicleTypes.find((vt) => vt.id === formData.vehicleTypeId)?.type ||
              "N/A"
            }
          />
          <PreviewRow
            label="Vehicle"
            value={vehicles.find((v) => v.id === formData.model)?.name || "N/A"}
          />
          <PreviewRow label="Start Date" value={formData.startDate} />
          <PreviewRow label="End Date" value={formData.endDate} />
        </tbody>
      </table>
    </div>

    <div className="form-buttons navigation">
      <button type="button" onClick={handleBack} >
        Back
      </button>
      <button type="submit" >
        Submit
      </button>
    </div>
  </form>
);

// Reusable row



// Table row component


// PreviewRow component with label on left, value on right

  return (
    <div className="form-container">{step < 6 ? form1to5 : form6Preview}</div>
  );
}

export default RentVehicle;
