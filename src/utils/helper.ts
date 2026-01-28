export const savePasteUrl = (url: string) => {
    const existing = JSON.parse(localStorage.getItem("pastes") || "[]");
    existing.unshift(url);
    localStorage.setItem("pastes", JSON.stringify(existing.slice(0, 10)));
  };
