"use client";
import { useState } from "react";
import { projects } from "@/lib/data";
import type { Project } from "@/lib/data";
import FadeIn from "./FadeIn";
import StaggerGroup from "./StaggerGroup";
import { ProjectIcon } from "./Icons";
import ProjectBimModal from "./ProjectBimModal";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <section className="section projects" id="projects">
        <div className="container">
          <FadeIn className="section-header">
            <span className="section-label">Loyihalar</span>
            <h2 className="section-title display-title">
              LOYIHA
              <br />
              LARIMIZ
            </h2>
          </FadeIn>

          <StaggerGroup className="projects-grid" stagger={0.11} y={72} duration={0.95}>
            {projects.map((project, index) => (
              <article
                key={index}
                className={`project-card${project.tall ? " tall" : ""}`}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") setSelectedProject(project); }}
                aria-label={`${project.name} loyihasini ko'rish`}
              >
                <div className="project-image-wrapper">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="project-bg-img"
                    loading="lazy"
                  />
                  <div className="project-overlay" />
                </div>

                <div className="project-icon-badge">
                  <ProjectIcon name={project.icon} />
                </div>

                {/* BIM badge */}
                <div className="project-bim-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  3D BIM
                </div>

                <div className="project-info">
                  <div className="project-meta">
                    <span className="project-tag">{project.category}</span>
                    <span className="project-divider">/</span>
                    <span className="project-year">{project.year}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <div className="project-action">
                    <span className="project-action-text">3D modelni ko&apos;rish</span>
                    <svg
                      className="project-action-arrow"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <ProjectBimModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
