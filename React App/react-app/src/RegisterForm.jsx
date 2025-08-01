import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HeroUIProvider,
  Form,
  Input,
  Select,
  SelectItem,
  Button,
  Avatar,
} from "@heroui/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "./AuthService";
import ThemeToggle from "./ThemeToggle";
import "./forma.css";

const RegisterForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const countries = [
    { key: "us", label: "United States" },
    { key: "ca", label: "Canada" },
    { key: "uk", label: "United Kingdom" },
    { key: "au", label: "Australia" },
    { key: "de", label: "Germany" },
    { key: "fr", label: "France" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.country) newErrors.country = "Country is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit logic here
    console.log("Form submitted:", form);
    
    // Перенаправляем на страницу входа после успешной валидации
    navigate("/login");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google Auth Success:", decoded);

      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        provider: "google",
        avatar: decoded.picture,
        createdAt: new Date().toISOString(),
        completedBusinessInfo: false,
      };

      AuthService.register(userData);
      navigate("/business-info");
    } catch (error) {
      console.error("Error decoding Google token:", error);
      setAuthError("Failed to process Google authentication");
    }
  };

  const handleGoogleFailure = () => {
    setAuthError("Google authentication failed. Please try again.");
  };

  const handleReset = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
    });
    setErrors({});
  };

  return (
    <HeroUIProvider>
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>

      <div className="form-container">
        <div className="form-content">
          <div className="form-header">
            <h1 className="form-logo">Castaway</h1>
            <h2 className="form-title">Sign up</h2>
            <p className="form-subtitle">
              Already have an account?{" "}
              <Link to="/login" className="form-link">
                Sign in
              </Link>
            </p>
          </div>

          {authError && <div className="error-message">{authError}</div>}

          <Form className="main-form" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="First Name"
              labelPlacement="outside"
              name="firstName"
              placeholder="Enter your first name"
              value={form.firstName}
              onChange={handleChange}
              errorMessage={errors.firstName}
              className="form-input"
            />

            <Input
              isRequired
              label="Last Name"
              labelPlacement="outside"
              name="lastName"
              placeholder="Enter your last name"
              value={form.lastName}
              onChange={handleChange}
              errorMessage={errors.lastName}
              className="form-input"
            />

            <Input
              isRequired
              label="Email"
              labelPlacement="outside"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              errorMessage={errors.email}
              className="form-input"
            />

            <Input
              isRequired
              label="Password"
              labelPlacement="outside"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              errorMessage={errors.password}
              className="form-input"
            />

            <Select
              isRequired
              label="Country"
              labelPlacement="outside"
              name="country"
              placeholder="Select your country"
              selectedKeys={form.country ? [form.country] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setForm({ ...form, country: selectedKey });
              }}
              className="form-select"
              disableSelectorIcon
              popoverProps={{
                className: "select-popover",
                placement: "bottom",
                offset: 5,
                shouldFlip: false,
                style: { position: "fixed", zIndex: 1001 },
              }}
              listboxProps={{
                className: "select-listbox",
                selectionMode: "single",
                hideSelectedIcon: true,
              }}
            >
              {countries.map((country) => (
                <SelectItem
                  key={country.key}
                  className="select-option"
                  textValue={country.label}
                >
                  {country.label}
                </SelectItem>
              ))}
            </Select>

            <div className="form-actions">
              <Button type="submit" className="submit-btn" disableRipple>
                Submit
              </Button>
              <Button
                type="button"
                className="reset-btn"
                onClick={handleReset}
                disableRipple
              >
                Reset
              </Button>
            </div>
          </Form>

          <div className="form-divider">
            <span>or continue with</span>
          </div>

          <GoogleOAuthProvider clientId="565850815016-hqel8fp78cht54hpmi9b88vh50obij95.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              shape="rectangular"
              size="large"
              width="100%"
              text="continue_with"
              locale="en"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </HeroUIProvider>
  );
};

export default RegisterForm;