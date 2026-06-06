"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumes, useCreateResume, useDeleteResume } from "@/hooks/useResumes";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { formatDate, getInitials } from "@/lib/utils";
import { Plus, FileText, Trash2, Edit3, Clock, Crown, MoreVertical } from "lucide-react";
import { useForm } from "react-hook-form";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: resumes, isLoading } = useResumes();
  const { mutate: createResume, isPending: creating } = useCreateResume();
  const { mutate: deleteResume } = useDeleteResume();
  const router = useRouter();
  const [createModal, setCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<{ title: string }>();

  const handleCreate = ({ title }: { title: string }) => {
    createResume(title, {
      onSuccess: (data) => {
        setCreateModal(false);
        reset();
        router.push(`/dashboard/edit/${data._id}`);
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">
            Good day, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-[var(--muted-foreground)]">
            {resumes?.length ?? 0} resume{resumes?.length !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user?.subscriptionPlan !== "premium" && (
            <button
              onClick={() => router.push("/dashboard/upgrade")}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-muted)] border border-[var(--accent)]/20 text-[var(--accent)] rounded-xl text-sm font-medium hover:bg-[var(--accent)]/15 transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              Upgrade to Pro
            </button>
          )}
          <Button onClick={() => setCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Resume
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Resumes", value: resumes?.length ?? 0, icon: <FileText className="w-4 h-4" /> },
          { label: "Plan", value: user?.subscriptionPlan === "premium" ? "Premium" : "Basic", icon: <Crown className="w-4 h-4" /> },
          { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).getFullYear().toString() : "—", icon: <Clock className="w-4 h-4" /> },
          { label: "Email Status", value: user?.emailVerified ? "Verified" : "Pending", icon: <FileText className="w-4 h-4" /> },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-2">
              {stat.icon}
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className="font-display font-semibold text-xl">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Resumes grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[#2a2a2a] transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-[var(--accent-muted)] to-[var(--card-hover)] relative overflow-hidden">
                {resume.thumbnailLink ? (
                  <img src={resume.thumbnailLink} alt={resume.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center mx-auto mb-2">
                        <span className="font-display font-bold text-[var(--accent)] text-lg">
                          {getInitials(resume.profileInfo?.fullName || resume.title)}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">No preview</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-sm leading-tight line-clamp-1">{resume.title}</h3>
                  <div className="relative flex-shrink-0">
                    <button className="p-1 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all text-[var(--muted-foreground)]">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {resume.profileInfo?.designation && (
                  <p className="text-xs text-[var(--muted-foreground)] mb-3 line-clamp-1">{resume.profileInfo.designation}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(resume.updatedAt)}
                  </span>
                  <Badge variant="default" className="text-[10px]">
                    {resume.template?.theme || "Default"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => router.push(`/dashboard/edit/${resume._id}`)}
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="flex-shrink-0 w-8 h-8"
                    onClick={() => setDeleteModal(resume._id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <button
            onClick={() => setCreateModal(true)}
            className="h-56 bg-[var(--card)] border border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-muted)] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[var(--accent)]/20 flex items-center justify-center transition-all">
              <Plus className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--accent)]" />
            </div>
            <span className="text-sm text-[var(--muted-foreground)] group-hover:text-[var(--accent)]">New Resume</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-[var(--muted-foreground)]" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">No resumes yet</h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
            Create your first resume and start your journey to landing your dream job.
          </p>
          <Button onClick={() => setCreateModal(true)} size="lg">
            <Plus className="w-4 h-4" />
            Create Your First Resume
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New Resume">
        <form onSubmit={handleSubmit(handleCreate)} className="p-6 space-y-4">
          <Input
            label="Resume Title"
            placeholder="e.g. Software Engineer Resume"
            autoFocus
            {...register("title", { required: true })}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button type="submit" loading={creating} className="flex-1">Create Resume</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Resume">
        <div className="p-6 space-y-4">
          <p className="text-[var(--muted-foreground)]">Are you sure? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                if (deleteModal) {
                  deleteResume(deleteModal);
                  setDeleteModal(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
