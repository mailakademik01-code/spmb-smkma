
import { GoogleGenAI } from "@google/genai";
import { SCHOOL_NAME, SCHOOL_TAGLINE, CONTACT_INFO, REQUIREMENTS, DEPARTMENTS } from "../constants.tsx";

// Correctly initialize with a direct reference to process.env.API_KEY per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DEPARTMENTS_INFO = DEPARTMENTS.map(d => `${d.code} (${d.name}): ${d.desc}`).join("\n");

const SYSTEM_INSTRUCTION = `
You are the AI Admission Assistant for ${SCHOOL_NAME}. 
Motto: ${SCHOOL_TAGLINE}.
Location: ${CONTACT_INFO.address}.
Phone: ${CONTACT_INFO.phone}.
Office Hours: ${CONTACT_INFO.hours}.

Your primary goal is to help prospective students choose the right vocational major (Jurusan) for SPMB 2024/2025.
The school currently offers two major programs: DKV and TKR.

Vocational Departments (Jurusan):
${DEPARTMENTS_INFO}

Key Information:
- Requirements: ${REQUIREMENTS.join(", ")}. Note: DKV requires candidates not to be color blind.
- Admission Steps: Online registration, Aptitude test, Interview, Announcement, Re-registration.
- Focus: Work readiness, professional certification, and industrial internship (PKL).

If asked about future jobs or career paths:
- DKV: Graphic Designer, Illustrator, Photographer, Content Creator, UI/UX Designer.
- TKR: Automotive Technician, Service Advisor, Workshop Manager, Automotive Entrepreneur.

Always respond in Indonesian. Keep answers short, direct, and welcoming. Use the term 'SPMB' instead of 'PPDB'.
`;

export async function sendMessageToAssistant(message: string, history: any[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // response.text is a getter, correctly used without calling it as a method
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, sistem sedang sibuk. Silakan hubungi WA kami di " + CONTACT_INFO.phone;
  }
}
