import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeroUIProvider,
  Form,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import AuthService from "./AuthService";
import ThemeToggle from "./ThemeToggle";
import "./forma.css";
import { mockBusinessCategories, mockSources } from "./mockData";

const BusinessInfoForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    category: "",
    source: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const categories = mockBusinessCategories;
  const sources = mockSources;

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      // Если пользователь не авторизован, перенаправляем на логин
      navigate("/login");
      return;
    }

    // Устанавливаем только те поля, которые есть у текущего пользователя
    setForm({
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      company: currentUser.company || "",
      phone: currentUser.phone || "",
      category: currentUser.category || "",
      source: currentUser.source || "",
    });
    setIsLoading(false);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.firstName) newErrors.firstName = "Введите имя";
    if (!form.lastName) newErrors.lastName = "Введите фамилию";
    if (!form.company) newErrors.company = "Введите название компании";
    if (!form.phone) newErrors.phone = "Введите номер телефона";
    if (!form.category) newErrors.category = "Выберите категорию";
    if (!form.source) newErrors.source = "Укажите источник";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const currentUser = AuthService.getCurrentUser();
      const updatedUser = {
        ...currentUser,
        ...form,
        completedBusinessInfo: true,
      };

      await AuthService.updateUser(updatedUser);
      navigate("/dashboard");
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  if (isLoading) {
    return (
      <HeroUIProvider>
        <div className="theme-toggle-container">
          <ThemeToggle />
        </div>
        <div className="form-container">Loading...</div>
      </HeroUIProvider>
    );
  }

  return (
    <HeroUIProvider>
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>

      <div className="form-container">
        <div className="form-content">
          <div className="form-header">
            <h1 className="form-logo">Castaway</h1>
            <h2 className="form-title">Информация о бизнесе</h2>
            <p className="form-subtitle">
              Заполните информацию о вашем бизнесе
            </p>
          </div>

          <Form className="main-form" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Имя"
              labelPlacement="outside"
              name="firstName"
              placeholder="Введите имя"
              value={form.firstName}
              onChange={handleChange}
              errorMessage={errors.firstName}
              className="form-input"
            />

            <Input
              isRequired
              label="Фамилия"
              labelPlacement="outside"
              name="lastName"
              placeholder="Введите фамилию"
              value={form.lastName}
              onChange={handleChange}
              errorMessage={errors.lastName}
              className="form-input"
            />

            <Input
              isRequired
              label="Компания"
              labelPlacement="outside"
              name="company"
              placeholder="Введите название компании"
              value={form.company}
              onChange={handleChange}
              errorMessage={errors.company}
              className="form-input"
            />

            <Input
              isRequired
              label="Телефон"
              labelPlacement="outside"
              name="phone"
              placeholder="Введите номер телефона"
              value={form.phone}
              onChange={handleChange}
              errorMessage={errors.phone}
              className="form-input"
            />

            <Select
              isRequired
              label="Категория деятельности"
              labelPlacement="outside"
              name="category"
              placeholder="Выберите категорию"
              selectedKeys={form.category ? [form.category] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setForm({ ...form, category: selectedKey });
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
              {categories.map((category) => (
                <SelectItem
                  key={category.key}
                  className="select-option"
                  textValue={category.label}
                >
                  {category.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Откуда вы о нас узнали?"
              labelPlacement="outside"
              name="source"
              placeholder="Откуда вы о нас узнали?"
              selectedKeys={form.source ? [form.source] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setForm({ ...form, source: selectedKey });
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
              {sources.map((source) => (
                <SelectItem
                  key={source.key}
                  className="select-option"
                  textValue={source.label}
                >
                  {source.label}
                </SelectItem>
              ))}
            </Select>

            <div className="form-actions">
              <Button
                type="submit"
                color="primary"
                className="submit-btn"
                disableRipple
                isLoading={isLoading}
              >
                Продолжить
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </HeroUIProvider>
  );
};

export default BusinessInfoForm;