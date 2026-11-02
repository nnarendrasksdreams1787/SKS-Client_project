// import React, { useState } from "react";
// import "../../CSS/Register.css";

// // Backend API
// const API_URL = "http://localhost:4010/api/auth";

// export default function Register() {
//   const [activeTab, setActiveTab] = useState("register");
//   const [showPassword, setShowPassword] = useState(false);
//   const [documentType, setDocumentType] = useState("Aadhaar Card");
//   const [verified, setVerified] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const [formData, setFormData] = useState({
//     documentNumber: "",
//     fullName: "",
//     mobile: "",
//     dob: "",
//     gender: "",
//     pincode: "",
//     city: "",
//     state: "",
//     country: "India",
//     address: "",
//   });

//   // Update registration fields
//   const updateForm = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (name === "documentNumber") {
//       setVerified(false);
//     }
//   };

//   // Check document number format only.
//   // This does NOT verify the document's authenticity.
//   const handleVerify = () => {
//     const docNumber = formData.documentNumber
//       .trim()
//       .replace(/\s/g, "")
//       .toUpperCase();

//     if (!docNumber) {
//       alert(`Please enter your ${documentType} number.`);
//       return;
//     }

//     const isPAN = documentType === "PAN Card";

//     const isValid = isPAN
//       ? /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(docNumber)
//       : /^\d{12}$/.test(docNumber);

//     if (!isValid) {
//       setVerified(false);

//       alert(
//         isPAN
//           ? "Please enter a valid PAN format."
//           : "Aadhaar number must contain exactly 12 digits."
//       );

//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       documentNumber: docNumber,
//     }));

//     setVerified(true);

//     alert(
//       "Document format is valid. This does not confirm identity or document authenticity."
//     );
//   };

//   // Register user through the backend
//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (loading) return;

//     if (!verified) {
//       alert("Please check your document format before registering.");
//       return;
//     }

//     // Convert frontend field names to backend field names
//     const payload = {
//       document_type:
//         documentType === "PAN Card" ? "PAN" : "AADHAAR",
//       document_number: formData.documentNumber,
//       full_name: formData.fullName.trim(),
//       mobile_no: formData.mobile.trim(),
//       date_of_birth: formData.dob,
//       gender: formData.gender,
//       pincode: formData.pincode.trim(),
//       city: formData.city.trim(),
//       state: formData.state.trim(),
//       country: formData.country.trim(),
//       address: formData.address.trim(),
//     };

//     try {
//       setLoading(true);

//       const response = await fetch(`${API_URL}/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         alert(data.message || "Registration failed.");
//         return;
//       }

//       // The backend generates both the reference ID and password.
//       const referenceId = data.user.reference_id;
//       const temporaryPassword = data.temporaryPassword;

//       // Development/testing only: do not expose temporary passwords
//       // in production. Deliver them through a properly configured SMS service.
//       alert(
//         `Registration successful!\n\n` +
//           `Welcome, ${data.user.full_name}!\n` +
//           `Reference ID: ${referenceId}\n` +
//           `Temporary Password: ${temporaryPassword}\n\n` +
//           `Please save these details securely.`
//       );

//       // Switch to login and prefill the reference ID.
//       setLoginData({
//         email: referenceId,
//         password: "",
//       });

//       // Clear the registration form.
//       setFormData({
//         documentNumber: "",
//         fullName: "",
//         mobile: "",
//         dob: "",
//         gender: "",
//         pincode: "",
//         city: "",
//         state: "",
//         country: "India",
//         address: "",
//       });

//       setDocumentType("Aadhaar Card");
//       setVerified(false);
//       setActiveTab("login");
//     } catch (error) {
//       console.error("Registration error:", error);

//       alert(
//         "Cannot connect to the backend. Please make sure your server is running on port 4010."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login user through the backend
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (loading) return;

//     try {
//       setLoading(true);

//       const response = await fetch(`${API_URL}/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           reference_id: loginData.email.trim(),
//           password: loginData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         alert(data.message || "Login failed.");
//         return;
//       }

//       // Store the JWT for the current browser session.
//       sessionStorage.setItem("authToken", data.token);

//       alert(`Welcome back, ${data.user.full_name}! Login successful.`);

//       // Add dashboard navigation here when your dashboard is ready.
//       // For React Router, use navigate("/dashboard").
//     } catch (error) {
//       console.error("Login error:", error);

//       alert(
//         "Cannot connect to the backend. Please make sure your server is running on port 4010."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="sks-auth-page">
//       <section className="sks-auth-layout">
//         {/* LEFT BRANDING PANEL */}
//         <aside className="sks-auth-hero">
//           <a href="/" className="sks-auth-logo">
//             <span className="sks-logo-symbol">✺</span>
//             <span>
//               SKS <strong>Dream</strong>
//               <small>Books | Skills | Better You</small>
//             </span>
//           </a>

//           <div className="sks-hero-message">
//             <span className="sks-eyebrow">
//               YOUR JOURNEY TO KNOWLEDGE
//             </span>

//             <h1>
//               Learn with purpose.
//               <br />
//               Grow with <span>wisdom.</span>
//             </h1>

//             <p>
//               Explore e-books, competitive exams, spoken English
//               and timeless wisdom for a better tomorrow.
//             </p>

//             <div className="sks-shloka">
//               <span className="sks-shloka-symbol">✺</span>

//               <h3>
//                 उद्यमेन हि सिध्यन्ति
//                 <br />
//                 कार्याणि न मनोरथैः ॥
//               </h3>

//               <p>
//                 Success comes through effort, not merely wishes.
//               </p>

//               <small>— Traditional Sanskrit Subhashita</small>
//             </div>

//             <div className="sks-learning-categories">
//               <div>
//                 <span>▤</span>
//                 <small>E-Books</small>
//               </div>

//               <div>
//                 <span>♙</span>
//                 <small>MPSC</small>
//               </div>

//               <div>
//                 <span>◎</span>
//                 <small>Spoken English</small>
//               </div>

//               <div>
//                 <span>✺</span>
//                 <small>Bhagavad Gita</small>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* RIGHT AUTHENTICATION PANEL */}
//         <section className="sks-auth-main">
//           <div className="sks-auth-card">
//             {/* LOGIN / REGISTRATION TABS */}
//             <div className="sks-auth-tabs">
//               <button
//                 type="button"
//                 className={activeTab === "register" ? "active" : ""}
//                 onClick={() => setActiveTab("register")}
//               >
//                 ♙ &nbsp; Complete Your Registration
//               </button>

//               <button
//                 type="button"
//                 className={activeTab === "login" ? "active" : ""}
//                 onClick={() => setActiveTab("login")}
//               >
//                 ♙ &nbsp; Login
//               </button>
//             </div>

//             {activeTab === "register" ? (
//               <div className="sks-register-content">
//                 <h2>Complete Your Registration</h2>

//                 <p className="sks-form-subtitle">
//                   Please select your ID type and complete your profile
//                   information.
//                 </p>

//                 <form onSubmit={handleRegister}>
//                   <label className="sks-field-label">
//                     IDENTITY DOCUMENT
//                   </label>

//                   <div className="sks-document-row">
//                     <select
//                       value={documentType}
//                       onChange={(e) => {
//                         setDocumentType(e.target.value);
//                         setVerified(false);

//                         setFormData((prev) => ({
//                           ...prev,
//                           documentNumber: "",
//                         }));
//                       }}
//                       aria-label="Identity document type"
//                     >
//                       <option>Aadhaar Card</option>
//                       <option>PAN Card</option>
//                     </select>

//                     <input
//                       type="text"
//                       name="documentNumber"
//                       placeholder={
//                         documentType === "PAN Card"
//                           ? "Enter PAN number"
//                           : "Enter Aadhaar number"
//                       }
//                       value={formData.documentNumber}
//                       onChange={updateForm}
//                       autoComplete="off"
//                       required
//                     />

//                     <button
//                       type="button"
//                       className="sks-verify-btn"
//                       onClick={handleVerify}
//                     >
//                       {verified ? "Verified ✓" : "Verify"}
//                     </button>
//                   </div>

//                   <div className="sks-section-heading">
//                     <h3>Personal Information</h3>
//                     <p>
//                       Enter your details to create your SKS Dream account.
//                     </p>
//                   </div>

//                   <div className="sks-form-grid">
//                     <div className="sks-form-field full-width">
//                       <label>FULL NAME</label>
//                       <input
//                         name="fullName"
//                         placeholder="Enter your full name"
//                         value={formData.fullName}
//                         onChange={updateForm}
//                         autoComplete="name"
//                         required
//                       />
//                     </div>

//                     <div className="sks-form-field">
//                       <label>MOBILE NUMBER</label>
//                       <input
//                         name="mobile"
//                         type="tel"
//                         inputMode="numeric"
//                         pattern="[0-9]{10}"
//                         maxLength={10}
//                         placeholder="Enter 10-digit mobile number"
//                         value={formData.mobile}
//                         onChange={updateForm}
//                         autoComplete="tel"
//                         required
//                       />
//                     </div>

//                     <div className="sks-form-field">
//                       <label>DATE OF BIRTH</label>
//                       <input
//                         name="dob"
//                         type="date"
//                         value={formData.dob}
//                         onChange={updateForm}
//                         autoComplete="bday"
//                         required
//                       />
//                     </div>

//                     <div className="sks-form-field">
//                       <label>GENDER</label>
//                       <select
//                         name="gender"
//                         value={formData.gender}
//                         onChange={updateForm}
//                         required
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                         <option value="Prefer not to say">
//                           Prefer not to say
//                         </option>
//                       </select>
//                     </div>

//                     <div className="sks-form-field">
//                       <label>PINCODE</label>
//                       <input
//                         name="pincode"
//                         inputMode="numeric"
//                         pattern="[0-9]{6}"
//                         maxLength={6}
//                         placeholder="Enter 6-digit pincode"
//                         value={formData.pincode}
//                         onChange={updateForm}
//                         autoComplete="postal-code"
//                         required
//                       />
//                     </div>

//                     <div className="sks-form-field">
//                       <label>CITY</label>
//                       <input
//                         name="city"
//                         placeholder="Enter city name"
//                         value={formData.city}
//                         onChange={updateForm}
//                         autoComplete="address-level2"
//                         required
//                       />
//                     </div>

//                     <div className="sks-form-field">
//                       <label>STATE</label>
//                       <input
//                         name="state"
//                         placeholder="Enter state name"
//                         value={formData.state}
//                         onChange={updateForm}
//                         autoComplete="address-level1"
//                         required
//                       />
//                     </div>

//                     <div className="sks-form-field">
//                       <label>COUNTRY</label>
//                       <input
//                         name="country"
//                         placeholder="Enter country"
//                         value={formData.country}
//                         onChange={updateForm}
//                         autoComplete="country-name"
//                         required
//                       />
//                     </div>

//                     <div className="sks-form-field full-width">
//                       <label>ADDRESS</label>
//                       <textarea
//                         name="address"
//                         placeholder="Enter your complete residential address"
//                         value={formData.address}
//                         onChange={updateForm}
//                         autoComplete="street-address"
//                         rows={2}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <label className="sks-terms-checkbox">
//                     <input type="checkbox" required />
//                     <span>
//                       I agree to the{" "}
//                       <a href="/terms">Terms and Conditions</a>
//                       {" "}and{" "}
//                       <a href="/privacy">Privacy Policy</a>.
//                     </span>
//                   </label>

//                   <button
//                     type="submit"
//                     className="sks-submit-btn"
//                     disabled={loading}
//                   >
//                     {loading ? "Please wait..." : "Complete Registration"}
//                     {!loading && <span> →</span>}
//                   </button>

//                   <p className="sks-switch-text">
//                     Already have an account?{" "}
//                     <button
//                       type="button"
//                       onClick={() => setActiveTab("login")}
//                     >
//                       Login
//                     </button>
//                   </p>
//                 </form>
//               </div>
//             ) : (
//               <div className="sks-login-content">
//                 <h2>Welcome Back!</h2>

//                 <p className="sks-form-subtitle">
//                   Login to continue your learning journey.
//                 </p>

//                 <form onSubmit={handleLogin}>
//                   <div className="sks-form-field full-width">
//                     <label>REFERENCE ID</label>
//                     <input
//                       type="text"
//                       placeholder="Enter reference ID (e.g. SD0001)"
//                       value={loginData.email}
//                       onChange={(e) =>
//                         setLoginData((prev) => ({
//                           ...prev,
//                           email: e.target.value,
//                         }))
//                       }
//                       autoComplete="username"
//                       required
//                     />
//                   </div>

//                   <div className="sks-form-field full-width sks-login-password">
//                     <label>PASSWORD</label>

//                     <div className="sks-password-wrap">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter password"
//                         value={loginData.password}
//                         onChange={(e) =>
//                           setLoginData((prev) => ({
//                             ...prev,
//                             password: e.target.value,
//                           }))
//                         }
//                         autoComplete="current-password"
//                         required
//                       />

//                       <button
//                         type="button"
//                         onClick={() => setShowPassword((prev) => !prev)}
//                         aria-label={
//                           showPassword ? "Hide password" : "Show password"
//                         }
//                       >
//                         {showPassword ? "Hide" : "Show"}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="sks-forgot-row">
//                     <a href="/forgot-password">Forgot password?</a>
//                   </div>

//                   <button
//                     type="submit"
//                     className="sks-submit-btn"
//                     disabled={loading}
//                   >
//                     {loading ? "Please wait..." : "Login"}
//                     {!loading && <span> →</span>}
//                   </button>

//                   <p className="sks-switch-text">
//                     New to SKS Dream?{" "}
//                     <button
//                       type="button"
//                       onClick={() => setActiveTab("register")}
//                     >
//                       Create an account
//                     </button>
//                   </p>
//                 </form>
//               </div>
//             )}
//           </div>
//         </section>
//       </section>
//     </main>
//   );
// }




import React, { useState } from "react";
import "../../CSS/Auth.css";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4010/api/auth";


// import logo from "../../assets/Theme/logo-register"

const handleVerifyDocument = () => {
  const number = form.document_number.trim().toUpperCase();

  if (form.document_type === "AADHAAR") {
    if (!/^\d{12}$/.test(number)) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }
  } else if (form.document_type === "PAN") {
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(number)) {
      setError("Enter a valid PAN format, such as ABCDE1234F.");
      return;
    }
  } else {
    setError("Please select a document type.");
    return;
  }

  setForm((previous) => ({
    ...previous,
    document_number: number,
  }));

  setError("");
  setSuccess("Document number format is valid.");
};


const handleRegister = async (event) => {
  event.preventDefault();

  if (loading) return;

  setError("");
  setSuccess("");

  if (!form.agreeToTerms) {
    setError("Please accepts the terms to continue")
    return;
  }

  const payload = {
    document_type: form.document_type,
    document_number: form.document_number.trim().toUpperCase(),
    full_name: form.full_name.trim(),
    mobile_no: form.phone.trim(),
    date_of_birth: form.dob,
    gender: form.gender,
    pincode: form.pincode.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    country: form.country.trim(),
    address: (form.address || "").trim(),

    // Optinal referalID
     referral_id: form.referral_id.trim() || null,
  };

  try {
    setLoading(true)

    const response = await axios.post(
      `${API_URL}/register`,
      payload
    )

    const data = response.data

    if (!response.ok) {
      setError(data.message || "Registration failed")
      return;
    }

    const referenceId = data.user.reference_id;
    const temporaryPassword = data.temporaryPassword;

    setSuccess(
      `Registration successful! Your Reference ID is ${referenceId}.`
    );

    // Development/testing only.
    // Do not expose temporary passwords this way in production.
    console.log("Temporary password:", temporaryPassword);

  } catch (error) {
    console.error("Registration error:", error);

    setError(
      error.response?.data?.message ||
      (error.response
        ? "Registration failed. Please check your details."
        : "Cannot connect to the backend. Check that your server is running on port 4010.")
    );
  }

  finally {
    setLoading(false);
  }

}




const Register = () => {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    dob: "",
    gender: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    document_type: "AADHAAR",
    document_number: "",
    address: "",
    referral_id: "",

    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!form.agreeToTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    // Connect your existing registration API handler here.
    // Keep its original endpoint and payload unchanged.
    setError(
      "Registration API integration is pending. Connect your existing registration handler here."
    );
  };

  return (
    <main className="sks-auth-page">

      {/* <section>
        <img src={logo} alt="this is only for the register login" />
      </section> */}

      <section className="sks-auth-layout">




        {/* Registration Form */}
        <section className="sks-auth-main">
          <div className="sks-auth-card">
            <span className="sks-eyebrow">JOIN SKS DREAM</span>
            <div className="up-links">
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </div>

            <h2>Create Your Account</h2>

            <p className="sks-form-subtitle">
              Enter your details to get started.
            </p>
            <div className="sks-register-scroll">

              <form onSubmit={handleRegister}>

                <div className="sks-section-heading">
                  <h3>Identity Verification</h3>
                  <p>Select your document type and enter its number.</p>
                </div>

                <div className="sks-form-grid">
                  <div className="sks-form-field">
                    <label htmlFor="register-document-type">
                      DOCUMENT TYPE *
                    </label>

                    <select
                      id="register-document-type"
                      name="document_type"
                      value={form.document_type}
                      onChange={updateForm}
                      required
                    >
                      <option value="">Select document</option>
                      <option value="AADHAAR">Aadhaar</option>
                      <option value="PAN">PAN</option>
                    </select>
                  </div>

                  <div className="sks-form-field">
                    <label htmlFor="register-document-number">
                      DOCUMENT NUMBER *
                    </label>

                    <input
                      id="register-document-number"
                      name="document_number"
                      value={form.document_number}
                      onChange={updateForm}
                      placeholder="Enter document number"
                      autoComplete="off"
                      required
                    />
                    {/* <button type="button" onClick={handleVerifyDocument}>
                      Verify Format
                    </button> */}
                  </div>
                </div>
                <div className="sks-section-heading">
                  <h3>Personal Information</h3>
                  <p>Provide your basic contact details.</p>
                </div>

                <div className="sks-form-grid">
                  <div className="sks-form-field full-width">
                    <label htmlFor="register-name">FULL NAME *</label>
                    <input
                      id="register-name"
                      name="full_name"
                      value={form.full_name}
                      onChange={updateForm}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                  </div>


                  <div className="sks-form-field">
                    <label htmlFor="register-phone">PHONE NUMBER *</label>
                    <input
                      id="register-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={updateForm}
                      placeholder="Enter 10-digit mobile number"
                      autoComplete="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="sks-form-field">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      value={form.dob}
                      onChange={updateForm}
                      required
                    />
                  </div>
                </div>



                <div className="sks-form-grid">

                  <div className="sks-form-field">
                    <label htmlFor="register-gender">GENDER</label>
                    <select
                      id="register-gender"
                      name="gender"
                      value={form.gender}
                      onChange={updateForm}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="sks-form-field full-width">
                    <label htmlFor="register-address">ADDRESS *</label>

                    <textarea
                      id="register-address"
                      name="address"
                      value={form.address}
                      onChange={updateForm}
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>


                </div>

                <div className="sks-form-grid">
                  <div className="sks-form-field">
                    <label htmlFor="register-pincode">PINCODE</label>
                    <input
                      id="register-pincode"
                      name="pincode"
                      value={form.pincode}
                      onChange={updateForm}
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="Enter 6-digit pincode"
                      autoComplete="postal-code"
                      required
                    />
                  </div>

                  <div className="sks-form-field">
                    <label htmlFor="register-city">CITY</label>
                    <input
                      id="register-city"
                      name="city"
                      value={form.city}
                      onChange={updateForm}
                      placeholder="Enter city"
                      autoComplete="address-level2"
                      required
                    />
                  </div>

                  <div className="sks-form-field">
                    <label htmlFor="register-state">STATE</label>
                    <input
                      id="register-state"
                      name="state"
                      value={form.state}
                      onChange={updateForm}
                      placeholder="Enter state"
                      autoComplete="address-level1"
                      required
                    />
                  </div>

                  <div className="sks-form-field">
                    <label htmlFor="register-country">COUNTRY</label>
                    <input
                      id="register-country"
                      name="country"
                      value={form.country}
                      onChange={updateForm}
                      placeholder="Enter country"
                      autoComplete="country-name"
                      required
                    />
                  </div>
                </div>

                <div className="sks-section-heading">
                  <h3>Account Security</h3>
                  <p>Set up your login credentials.</p>
                </div>


                <div className="sks-form-field">
                  <label htmlFor="register-referral">
                    REFERRAL ID (OPTIONAL)
                  </label>

                  <input
                    id="register-referral"
                    name="referral_id"
                    type="text"
                    value={form.referral_id}
                    onChange={updateForm}
                    placeholder="Enter referral ID (if available)"
                    autoComplete="off"
                  />

                  <small>
                    Don't have a referral ID? You can leave this field empty.
                  </small>
                </div>


                <label className="sks-terms-checkbox">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={form.agreeToTerms}
                    onChange={updateForm}
                    required
                  />

                  <span>
                    I agree to the applicable terms and conditions.
                  </span>
                </label>

                {error && (
                  <p className="sks-auth-error" role="alert">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="sks-auth-success" role="status">
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  className="sks-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <span>→</span>}
                </button>

                <p className="sks-switch-text">
                  Already have an account?{" "}
                  <a href="/login">Login</a>
                </p>
              </form>

            </div>
          </div>
        </section>

      </section>
    </main>
  );
};

export default Register;
