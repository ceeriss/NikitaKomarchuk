// mockData.js
export const mockUsers = [
  {
    id: 1,
    name: "Иван Иванов",
    email: "ivan@example.com",
    password: "password123",
    country: "Russia",
    firstName: "Иван",
    lastName: "Иванов",
    company: "ООО ТехноПром",
    phone: "+79161234567",
    category: "it",
    source: "google",
    completedBusinessInfo: true,
    createdAt: "2023-10-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Анна Петрова",
    email: "anna@example.com",
    password: "anna1234",
    country: "Russia",
    firstName: "Анна",
    lastName: "Петрова",
    company: "Кафе Уют",
    phone: "+79167654321",
    category: "retail",
    source: "social",
    completedBusinessInfo: true,
    createdAt: "2023-11-20T14:15:00Z"
  },
  {
    id: 3,
    name: "Алексей Смирнов",
    email: "alex@example.com",
    password: "alex123",
    country: "USA",
    completedBusinessInfo: false,
    createdAt: "2023-12-05T09:45:00Z"
  }
];

export const mockBusinessCategories = [
  { key: "retail", label: "Розничная торговля" },
  { key: "services", label: "Услуги" },
  { key: "manufacturing", label: "Производство" },
  { key: "it", label: "IT" },
  { key: "other", label: "Другое" }
];

export const mockSources = [
  { key: "google", label: "Google" },
  { key: "social", label: "Социальные сети" },
  { key: "friends", label: "Рекомендации" },
  { key: "ads", label: "Реклама" },
  { key: "other", label: "Другое" }
];

export const mockCountries = [
  { key: "ru", label: "Russia" },
  { key: "us", label: "United States" },
  { key: "uk", label: "United Kingdom" },
  { key: "ca", label: "Canada" },
  { key: "au", label: "Australia" }
];