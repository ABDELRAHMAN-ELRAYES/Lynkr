import { usersData } from "@/shared/constants/users";
const projectsData: any[] = [];
const ordersData: any[] = [];
const paymentsData: any[] = [];

export type ExportFormat = "csv" | "json" | "xlsx";

export interface ExportOptions {
  format: ExportFormat;
  dataType: "users" | "projects" | "orders" | "payments" | "all";
  filters?: any;
}

export const exportData = (options: ExportOptions) => {
  let data: any[] = [];

  switch (options.dataType) {
    case "users":
      data = usersData;
      break;
    case "projects":
      data = projectsData;
      break;
    case "orders":
      data = ordersData;
      break;
    case "payments":
      data = paymentsData;
      break;
    case "all":
      data = [...usersData, ...projectsData, ...ordersData, ...paymentsData];
      break;
  }

  // Apply filters if provided
  if (options.filters) {
    data = data.filter((item) => {
      return Object.entries(options.filters).every(([key, value]) => {
        if (!value) return true;
        return item[key] === value;
      });
    });
  }

  switch (options.format) {
    case "csv":
      return exportToCSV(data, options.dataType);
    case "json":
      return exportToJSON(data, options.dataType);
    case "xlsx":
      return exportToXLSX(data, options.dataType);
  }
};

const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]).join(",") + "\n";
  const rows = data
    .map((obj) =>
      Object.values(obj)
        .map((value) =>
          typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value
        )
        .join(",")
    )
    .join("\n");

  const csvContent = headers + rows;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.click();
};

const exportToJSON = (data: any[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.json`
  );
  link.click();
};

const exportToXLSX = (data: any[], filename: string) => {
  // This would require a library like xlsx
  console.log("XLSX export would be implemented with a library");
  // For now, we'll fall back to CSV
  exportToCSV(data, filename);
};
