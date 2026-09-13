import { dashboardRepository } from "./dashboard.repository.js";
const result = await dashboardRepository.getInventorySummary();
console.log(result);
