/** Project detail page showing full info for each portfolio project. */
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    notFound();
  }

  return (
    <main className="detail-wrap">
      <Link href="/" className="back-link">
        &larr; Back to Home
      </Link>
      <p className="client">
        NO. {project.id} // {project.client}
      </p>
      <h1>{project.title}</h1>
      <p className="summary">{project.description}</p>
      <div className="stack-list">
        {project.stack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="back-link"
          style={{ display: "inline-block", marginTop: "2rem" }}
        >
          View Live Project &rarr;
        </a>
      )}
    </main>
  );
}
