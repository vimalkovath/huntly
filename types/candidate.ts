export interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  yearsExperience: number;
  skills: string[];
  seniority: "Junior" | "Mid" | "Senior" | "Lead" | "Staff" | "Executive";
  summary: string;
  avatarSeed: string;
}
