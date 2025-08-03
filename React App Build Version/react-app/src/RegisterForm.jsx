import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HeroUIProvider,
  Form,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AuthService from "./AuthService";
import ThemeToggle from "./ThemeToggle";
import "./forma.css";
import YandexAuthButton from "./YandexAuthButton";
import { getCountryCode, isCISCountry } from "./GeoLocation";

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
  const [isLoading, setIsLoading] = useState(false);
  const [authMethods, setAuthMethods] = useState({
    showYandex: false,
    showGoogle: false
  });
  const navigate = useNavigate();

  const countries = [
    { key: "us", label: "United States" },
    { key: "ca", label: "Canada" },
    { key: "uk", label: "United Kingdom" },
    { key: "au", label: "Australia" },
    { key: "de", label: "Germany" },
    { key: "fr", label: "France" },
  ];

  useEffect(() => {
    const detectAuthMethods = async () => {
      const countryCode = await getCountryCode();
      const isCIS = isCISCountry(countryCode);
      
      setAuthMethods({
        showYandex: isCIS,
        showGoogle: !isCIS
      });
    };

    detectAuthMethods();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        country: form.country,
        completedBusinessInfo: false,
      };

      await AuthService.register(userData);
      navigate("/business-info");
    } catch (error) {
      setAuthError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const decoded = jwtDecode(credentialResponse.credential);
      
      if (!decoded.email) {
        throw new Error("Google account email not found");
      }

      const nameParts = decoded.name?.split(" ") || [];
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const userData = {
        id: decoded.sub,
        firstName,
        lastName,
        email: decoded.email,
        password: `google_${Math.random().toString(36).slice(-8)}`,
        provider: "google",
        avatar: decoded.picture,
        country: form.country || "",
        completedBusinessInfo: false,
        createdAt: new Date().toISOString(),
      };

      try {
        await AuthService.register(userData);
        navigate("/business-info");
      } catch (error) {
        if (error.message.includes("already exists")) {
          const existingUser = await AuthService.loginWithProvider(decoded.email, "google");
          if (existingUser) {
            navigate(existingUser.completedBusinessInfo ? "/dashboard" : "/business-info");
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Google auth error:", error);
      setAuthError(
        error.message.includes("already exists")
          ? "This Google account is already registered. Please sign in."
          : "Failed to authenticate with Google. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google auth failed:", error);
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
    setAuthError(null);
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

          {authError && (
            <div className="error-message">
              {authError}
            </div>
          )}

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
              <Button
                type="submit"
                className="submit-btn"
                disableRipple
                isLoading={isLoading}
              >
                Submit
              </Button>
              <Button
                type="button"
                className="reset-btn"
                onClick={handleReset}
                disableRipple
                isDisabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </Form>

          <div className="form-divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth-container">
            {authMethods.showGoogle && (
              <GoogleOAuthProvider 
                clientId="565850815016-edagcqse3i299cb31eqe9td1icvjd1at.apps.googleusercontent.com"
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap
                  shape="rectangular"
                  size="large"
                  width="350"
                  text="continue_with"
                  locale="en"
                  disabled={isLoading}
                />
              </GoogleOAuthProvider>
            )}
            
            {authMethods.showYandex && (
              <YandexAuthButton disabled={isLoading} />
            )}
          </div>
        </div>
      </div>
    </HeroUIProvider>
  );
};

export default RegisterForm;