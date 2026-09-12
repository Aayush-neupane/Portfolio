// utils/whatsappTemplates.js
export const whatsappTemplates = {
  general: "Hi! I visited your portfolio and would like to connect. 👋",
  project: "Hi! I saw your projects and would like to discuss a potential collaboration. 💼",
  hiring: "Hi! I'm interested in hiring you for a project. Can we discuss? 🚀",
  feedback: "Hi! Love your portfolio! I have some feedback to share. 💡"
};

// Usage in components
import { whatsappTemplates } from '../utils/whatsappTemplates';
const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappTemplates.project)}`;