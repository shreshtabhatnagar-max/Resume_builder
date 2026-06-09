"use client";
import { use, useState, useEffect } from "react";
import { useResume, useUpdateResume } from "@/hooks/useResumes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { emailService } from "@/services/email.service";
import {
  User, Phone, Briefcase, GraduationCap, Code, FolderOpen,
  Award, Globe, Heart, ChevronDown, ChevronUp, Save, Mail,
  ArrowLeft, Plus, Trash2, Send
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Resume, WorkExperience, Education, Skill, Project, Certification, Language } from "@/types";
import { Modal } from "@/components/ui/Modal";
import toast from "react-hot-toast";

type Params = { id: string };

const SECTIONS = [
  { id: "profile", label: "Profile Info", icon: <User className="w-4 h-4" /> },
  { id: "contact", label: "Contact Info", icon: <Phone className="w-4 h-4" /> },
  { id: "experience", label: "Work Experience", icon: <Briefcase className="w-4 h-4" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "skills", label: "Skills", icon: <Code className="w-4 h-4" /> },
  { id: "projects", label: "Projects", icon: <FolderOpen className="w-4 h-4" /> },
  { id: "certifications", label: "Certifications", icon: <Award className="w-4 h-4" /> },
  { id: "languages", label: "Languages", icon: <Globe className="w-4 h-4" /> },
  { id: "interests", label: "Interests", icon: <Heart className="w-4 h-4" /> },
];

export default function EditResumePage({ params }: { params: Params }) {
  const { id } = params;
  const { data: resume, isLoading } = useResume(id);
  const { mutate: updateResume, isPending: saving } = useUpdateResume();
  const router = useRouter();
  const [openSection, setOpenSection] = useState("profile");
  const [draft, setDraft] = useState<Partial<Resume>>({});
  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ recipientEmail: "", subject: "My Resume", message: "Please find my resume attached." });
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (resume) setDraft(resume);
  }, [resume]);

  const save = () => {
    updateResume({ id, data: draft });
  };

  const updateProfile = (key: string, value: string) => {
    setDraft((d) => ({ ...d, profileInfo: { ...d.profileInfo, [key]: value } }));
  };

  const updateContact = (key: string, value: string) => {
    setDraft((d) => ({ ...d, contactInfo: { ...d.contactInfo, [key]: value } }));
  };

  const updateList = <T,>(key: keyof Resume, index: number, field: string, value: string | number) => {
    setDraft((d) => {
      const arr = [...((d[key] as T[]) || [])] as Record<string, unknown>[];
      arr[index] = { ...arr[index], [field]: value };
      return { ...d, [key]: arr };
    });
  };

  const addItem = <T,>(key: keyof Resume, emptyItem: T) => {
    setDraft((d) => ({ ...d, [key]: [...((d[key] as T[]) || []), emptyItem] }));
  };

  const removeItem = (key: keyof Resume, index: number) => {
    setDraft((d) => {
      const arr = [...((d[key] as unknown[]) || [])];
      arr.splice(index, 1);
      return { ...d, [key]: arr };
    });
  };

  const handleSendEmail = async () => {
    if (!emailForm.recipientEmail) {
      toast.error("Please enter recipient email");
      return;
    }
    setSendingEmail(true);
    try {
      // Create a simple PDF blob (placeholder - in real app this would be generated)
      const blob = new Blob(["Resume PDF"], { type: "application/pdf" });
      const file = new File([blob], `${resume?.title || "resume"}.pdf`, { type: "application/pdf" });
      await emailService.sendResume({ ...emailForm, pdfFile: file });
      toast.success("Resume sent successfully!");
      setEmailModal(false);
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-12 w-64" />
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-xl hover:bg-white/5 transition-colors text-[var(--muted-foreground)]">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold">{draft.title || "Untitled Resume"}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Edit your resume sections</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEmailModal(true)} className="gap-1.5">
            <Send className="w-3.5 h-3.5" />
            Email
          </Button>
          <Button size="sm" loading={saving} onClick={save} className="gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>
        </div>
      </div>

      {/* Sections accordion */}
      <div className="space-y-3">
        {/* Title */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <Input
            label="Resume Title"
            value={draft.title || ""}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
        </div>

        {SECTIONS.map((section) => (
          <div key={section.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === section.id ? "" : section.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center">
                  {section.icon}
                </div>
                <span className="font-display font-semibold">{section.label}</span>
              </div>
              {openSection === section.id ? <ChevronUp className="w-4 h-4 text-[var(--muted-foreground)]" /> : <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />}
            </button>

            {openSection === section.id && (
              <div className="px-5 pb-5 border-t border-[var(--border)] pt-5">
                {/* Profile Info */}
                {section.id === "profile" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full Name" value={draft.profileInfo?.fullName || ""} onChange={(e) => updateProfile("fullName", e.target.value)} placeholder="John Doe" />
                    <Input label="Job Title / Designation" value={draft.profileInfo?.designation || ""} onChange={(e) => updateProfile("designation", e.target.value)} placeholder="Software Engineer" />
                    <Input label="Profile Image URL" value={draft.profileInfo?.profilePreviewUrl || ""} onChange={(e) => updateProfile("profilePreviewUrl", e.target.value)} placeholder="https://..." className="sm:col-span-2" />
                    <div className="sm:col-span-2">
                      <Textarea label="Professional Summary" rows={4} value={draft.profileInfo?.summary || ""} onChange={(e) => updateProfile("summary", e.target.value)} placeholder="A brief summary about yourself..." />
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {section.id === "contact" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { key: "email", label: "Email", placeholder: "you@email.com" },
                      { key: "phone", label: "Phone", placeholder: "+91 9876543210" },
                      { key: "location", label: "Location", placeholder: "Mumbai, India" },
                      { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/you" },
                      { key: "github", label: "GitHub", placeholder: "github.com/you" },
                      { key: "website", label: "Website", placeholder: "yoursite.com" },
                    ].map((f) => (
                      <Input
                        key={f.key}
                        label={f.label}
                        value={(draft.contactInfo as Record<string, string>)?.[f.key] || ""}
                        onChange={(e) => updateContact(f.key, e.target.value)}
                        placeholder={f.placeholder}
                      />
                    ))}
                  </div>
                )}

                {/* Work Experience */}
                {section.id === "experience" && (
                  <div className="space-y-4">
                    {(draft.workExperiences || []).map((exp: WorkExperience, i: number) => (
                      <div key={i} className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--muted-foreground)]">Experience #{i + 1}</span>
                          <button onClick={() => removeItem("workExperiences", i)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input placeholder="Company" value={exp.company || ""} onChange={(e) => updateList<WorkExperience>("workExperiences", i, "company", e.target.value)} />
                          <Input placeholder="Role / Title" value={exp.role || ""} onChange={(e) => updateList<WorkExperience>("workExperiences", i, "role", e.target.value)} />
                          <Input placeholder="Start Date" value={exp.startDate || ""} onChange={(e) => updateList<WorkExperience>("workExperiences", i, "startDate", e.target.value)} />
                          <Input placeholder="End Date (or Present)" value={exp.endDate || ""} onChange={(e) => updateList<WorkExperience>("workExperiences", i, "endDate", e.target.value)} />
                        </div>
                        <Textarea rows={3} placeholder="Describe your responsibilities..." value={exp.description || ""} onChange={(e) => updateList<WorkExperience>("workExperiences", i, "description", e.target.value)} />
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => addItem<WorkExperience>("workExperiences", { company: "", role: "", startDate: "", endDate: "", description: "" })} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Experience
                    </Button>
                  </div>
                )}

                {/* Education */}
                {section.id === "education" && (
                  <div className="space-y-4">
                    {(draft.educations || []).map((edu: Education, i: number) => (
                      <div key={i} className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--muted-foreground)]">Education #{i + 1}</span>
                          <button onClick={() => removeItem("educations", i)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input placeholder="Degree" value={edu.degree || ""} onChange={(e) => updateList<Education>("educations", i, "degree", e.target.value)} />
                          <Input placeholder="Institution" value={edu.institution || ""} onChange={(e) => updateList<Education>("educations", i, "institution", e.target.value)} />
                          <Input placeholder="Start Year" value={edu.startDate || ""} onChange={(e) => updateList<Education>("educations", i, "startDate", e.target.value)} />
                          <Input placeholder="End Year" value={edu.endDate || ""} onChange={(e) => updateList<Education>("educations", i, "endDate", e.target.value)} />
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => addItem<Education>("educations", { degree: "", institution: "", startDate: "", endDate: "" })} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Education
                    </Button>
                  </div>
                )}

                {/* Skills */}
                {section.id === "skills" && (
                  <div className="space-y-3">
                    {(draft.skills || []).map((skill: Skill, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <Input placeholder="Skill name" value={skill.name || ""} onChange={(e) => updateList<Skill>("skills", i, "name", e.target.value)} className="flex-1" />
                        <Input type="number" min="0" max="100" placeholder="0-100" value={skill.progress ?? ""} onChange={(e) => updateList<Skill>("skills", i, "progress", parseInt(e.target.value) || 0)} className="w-24" />
                        <button onClick={() => removeItem("skills", i)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => addItem<Skill>("skills", { name: "", progress: 80 })} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Skill
                    </Button>
                  </div>
                )}

                {/* Projects */}
                {section.id === "projects" && (
                  <div className="space-y-4">
                    {(draft.projects || []).map((proj: Project, i: number) => (
                      <div key={i} className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--muted-foreground)]">Project #{i + 1}</span>
                          <button onClick={() => removeItem("projects", i)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <Input placeholder="Project Title" value={proj.title || ""} onChange={(e) => updateList<Project>("projects", i, "title", e.target.value)} />
                        <Textarea rows={2} placeholder="Description" value={proj.description || ""} onChange={(e) => updateList<Project>("projects", i, "description", e.target.value)} />
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input placeholder="GitHub URL" value={proj.github || ""} onChange={(e) => updateList<Project>("projects", i, "github", e.target.value)} />
                          <Input placeholder="Live Demo URL" value={proj.liveDemo || ""} onChange={(e) => updateList<Project>("projects", i, "liveDemo", e.target.value)} />
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => addItem<Project>("projects", { title: "", description: "", github: "", liveDemo: "" })} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Project
                    </Button>
                  </div>
                )}

                {/* Certifications */}
                {section.id === "certifications" && (
                  <div className="space-y-4">
                    {(draft.certification || []).map((cert: Certification, i: number) => (
                      <div key={i} className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--muted-foreground)]">Certification #{i + 1}</span>
                          <button onClick={() => removeItem("certification", i)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <Input placeholder="Certificate Title" value={cert.title || ""} onChange={(e) => updateList<Certification>("certification", i, "title", e.target.value)} className="sm:col-span-1" />
                          <Input placeholder="Issuer" value={cert.issuer || ""} onChange={(e) => updateList<Certification>("certification", i, "issuer", e.target.value)} />
                          <Input placeholder="Year" value={cert.year || ""} onChange={(e) => updateList<Certification>("certification", i, "year", e.target.value)} />
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => addItem<Certification>("certification", { title: "", issuer: "", year: "" })} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Certification
                    </Button>
                  </div>
                )}

                {/* Languages */}
                {section.id === "languages" && (
                  <div className="space-y-3">
                    {(draft.languages || []).map((lang: Language, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <Input placeholder="Language" value={lang.name || ""} onChange={(e) => updateList<Language>("languages", i, "name", e.target.value)} className="flex-1" />
                        <Input type="number" min="0" max="100" placeholder="Proficiency" value={lang.progress ?? ""} onChange={(e) => updateList<Language>("languages", i, "progress", parseInt(e.target.value) || 0)} className="w-32" />
                        <button onClick={() => removeItem("languages", i)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => addItem<Language>("languages", { name: "", progress: 80 })} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Language
                    </Button>
                  </div>
                )}

                {/* Interests */}
                {section.id === "interests" && (
                  <div className="space-y-3">
                    {(draft.interest || []).map((interest: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <Input
                          placeholder="e.g. Open Source, Photography"
                          value={interest}
                          onChange={(e) => {
                            setDraft((d) => {
                              const arr = [...(d.interest || [])];
                              arr[i] = e.target.value;
                              return { ...d, interest: arr };
                            });
                          }}
                          className="flex-1"
                        />
                        <button onClick={() => removeItem("interest", i)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => setDraft((d) => ({ ...d, interest: [...(d.interest || []), ""] }))} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Interest
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom save bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-xl z-30">
        <span className="text-sm text-[var(--muted-foreground)]">Don&apos;t forget to save your changes</span>
        <Button size="sm" loading={saving} onClick={save}>
          <Save className="w-3.5 h-3.5" /> Save Changes
        </Button>
      </div>

      {/* Email Modal */}
      <Modal isOpen={emailModal} onClose={() => setEmailModal(false)} title="Email Your Resume">
        <div className="p-6 space-y-4">
          <Input
            label="Recipient Email"
            type="email"
            placeholder="recruiter@company.com"
            icon={<Mail className="w-4 h-4" />}
            value={emailForm.recipientEmail}
            onChange={(e) => setEmailForm((f) => ({ ...f, recipientEmail: e.target.value }))}
          />
          <Input
            label="Subject"
            value={emailForm.subject}
            onChange={(e) => setEmailForm((f) => ({ ...f, subject: e.target.value }))}
          />
          <Textarea
            label="Message"
            rows={3}
            value={emailForm.message}
            onChange={(e) => setEmailForm((f) => ({ ...f, message: e.target.value }))}
          />
          <p className="text-xs text-[var(--muted-foreground)]">
            Note: You&apos;ll need to export a PDF from your resume and attach it here. In a full production app, PDF generation is built in.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setEmailModal(false)}>Cancel</Button>
            <Button className="flex-1" loading={sendingEmail} onClick={handleSendEmail}>
              <Send className="w-4 h-4" /> Send Resume
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
