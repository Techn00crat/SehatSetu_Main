import React from "react";

const doctors = [
  {
    id: 1,
    name: "Dr. Ayesha Sharma",
    specialty: "Cardiologist",
    phone: "+91 9876543210",
    email: "ayesha.sharma@hospital.com",
    location: "New Delhi, India"
  },
  {
    id: 2,
    name: "Dr. Rajeev Menon",
    specialty: "Dermatologist",
    phone: "+91 9123456780",
    email: "rajeev.menon@hospital.com",
    location: "Bengaluru, India"
  },
  {
    id: 3,
    name: "Dr. Meera Kapoor",
    specialty: "Neurologist",
    phone: "+91 9988776655",
    email: "meera.kapoor@hospital.com",
    location: "Mumbai, India"
  },
  {
    id: 4,
    name: "Dr. Arjun Desai",
    specialty: "Pediatrician",
    phone: "+91 9345678901",
    email: "arjun.desai@hospital.com",
    location: "Ahmedabad, India"
  }
];

const Doctors = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <h2 className="text-4xl font-bold mb-14 text-center text-gray-800">Our Doctors</h2>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 w-full max-w-6xl">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100 flex flex-row justify-between items-start gap-6"
          >
            {/* Left: Profile Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-800">{doc.name}</h3>
              <p className="text-blue-600 font-medium">{doc.specialty}</p>
              <p className="text-sm text-gray-500 mt-1">📍 {doc.location}</p>
            </div>

            {/* Right: Contact Info */}
            <div className="text-sm text-gray-600 text-right">
              <p>📞 {doc.phone}</p>
              <p>📧 {doc.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
