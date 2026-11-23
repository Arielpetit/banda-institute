import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { DeleteButton, StatusForm } from "@/components/admin/status-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { digits, formatDate, formatDateTime, TERM_LABEL } from "@/lib/admin";
import { getApplication } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/supabase/auth";
import { BUCKET, createServiceClient } from "@/lib/supabase/service";

export const metadata: Metadata = { title: "Application" };

const DOC_LABEL: Record<string, string> = {
  birthCertificate: "Birth certificate",
  reportCard: "Last report card",
  photo: "Passport photo",
};
const CLASS_LABEL = { anglophone: "Anglophone section", francophone: "Francophone section" } as const;
const PATHWAY_LABEL: Record<string, string> = { general: "General", technical: "Technical", commercial: "Commercial" };
const RELATION_LABEL: Record<string, string> = { mother: "Mother", father: "Father", guardian: "Legal guardian", other: "Other" };
const GENDER_LABEL: Record<string, string> = { female: "Female", male: "Male" };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display text-xl text-fg">{title}</h2>
      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Item({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-1 text-sm break-words whitespace-pre-line text-fg">{children}</dd>
    </div>
  );
}

const actionLink =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-fg-2 transition-colors hover:border-primary hover:bg-primary hover:text-on-primary";

export default async function ApplicationPage({ params }: PageProps<"/admin/applications/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const app = await getApplication(id);
  if (!app) notFound();

  const entries = Object.entries(app.documents ?? {});
  const signed = entries.length
    ? (await createServiceClient().storage.from(BUCKET).createSignedUrls(
        entries.map(([, p]) => p),
        600,
      )).data ?? []
    : [];
  const docs = entries.map(([key, path], i) => ({
    key,
    name: path.split("/").pop() ?? path,
    url: signed[i]?.signedUrl ?? null,
  }));

  const fullName = `${app.first_name} ${app.last_name}`;
  const wa = digits(app.whatsapp || app.phone);

  return (
    <div>
      <Link href="/admin" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-fg-2 hover:text-accent">
        <ArrowLeft className="size-4" /> All applications
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-muted">{app.reference}</p>
          <h1 className="mt-1 font-display text-4xl font-medium text-fg">{fullName}</h1>
          <p className="mt-2 text-sm text-muted">
            {app.level} · {CLASS_LABEL[app.section]} · received {formatDateTime(app.created_at)}
          </p>
        </div>
        <StatusBadge status={app.status} className="text-sm" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href={`tel:+${digits(app.phone)}`} className={actionLink}>
          <Phone className="size-4" /> Call
        </a>
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className={actionLink}>
          <MessageCircle className="size-4" /> WhatsApp
        </a>
        <a href={`mailto:${app.email}`} className={actionLink}>
          <Mail className="size-4" /> Email
        </a>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card title="Learner">
            <Item label="Full name">{fullName}</Item>
            <Item label="Date of birth">{formatDate(app.dob)}</Item>
            <Item label="Gender">{GENDER_LABEL[app.gender] ?? app.gender}</Item>
            <Item label="Nationality">{app.nationality}</Item>
            <Item label="Current school">{app.current_school}</Item>
            <Item label="Current class">{app.current_class}</Item>
          </Card>

          <Card title="Programme">
            <Item label="Section">{CLASS_LABEL[app.section]}</Item>
            <Item label="Class applied for">{app.level}</Item>
            <Item label="Pathway">{app.pathway ? (PATHWAY_LABEL[app.pathway] ?? app.pathway) : null}</Item>
            <Item label="Entry term">{TERM_LABEL[app.term] ?? app.term}</Item>
          </Card>

          <Card title="Parent or guardian">
            <Item label="Name">{app.guardian_name}</Item>
            <Item label="Relationship">{RELATION_LABEL[app.relationship] ?? app.relationship}</Item>
            <Item label="Phone">
              <a className="hover:text-accent" href={`tel:+${digits(app.phone)}`}>
                {app.phone}
              </a>
            </Item>
            <Item label="WhatsApp">{app.whatsapp}</Item>
            <Item label="Email">
              <a className="hover:text-accent" href={`mailto:${app.email}`}>
                {app.email}
              </a>
            </Item>
            <Item label="Address">{app.address}</Item>
            <Item label="Message from the family" wide>
              {app.notes}
            </Item>
          </Card>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-xl text-fg">Documents</h2>
            {docs.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No document was uploaded.</p>
            ) : (
              <ul className="mt-5 divide-y divide-line">
                {docs.map((d) => (
                  <li key={d.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint text-accent">
                        <FileText className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-fg">{DOC_LABEL[d.key] ?? d.key}</span>
                        <span className="block truncate font-mono text-xs text-muted">{d.name}</span>
                      </span>
                    </span>
                    {d.url ? (
                      <a href={d.url} target="_blank" rel="noreferrer" className={actionLink}>
                        Open
                      </a>
                    ) : (
                      <span className="text-xs text-muted">Unavailable</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-muted">Links expire after 10 minutes. Reload the page for fresh ones.</p>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-xl text-fg">Decision</h2>
            <div className="mt-5">
              <StatusForm id={app.id} status={app.status} notes={app.internal_notes ?? ""} />
            </div>
            <p className="mt-5 border-t border-line pt-4 text-xs text-muted">Last updated {formatDateTime(app.updated_at)}</p>
          </section>
          <DeleteButton id={app.id} name={fullName} />
        </aside>
      </div>
    </div>
  );
}
