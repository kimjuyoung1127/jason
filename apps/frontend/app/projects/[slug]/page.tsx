/** Project case study page - Server component orchestrating SEO metadata and prev/next navigation. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import ProjectDetailContent from "@/components/hero/project-detail-content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} | JASON.`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | JASON.`,
      description: project.summary,
      images: project.ogImage ? [project.ogImage] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);

  if (index === -1) {
    notFound();
  }

  const project = projects[index];
  const prev = projects[index > 0 ? index - 1 : projects.length - 1];
  const next = projects[index < projects.length - 1 ? index + 1 : 0];

  return (
    <ProjectDetailContent
      project={project}
      prev={{ slug: prev.slug, id: prev.id, title: prev.title }}
      next={{ slug: next.slug, id: next.id, title: next.title }}
    />
  );
}
