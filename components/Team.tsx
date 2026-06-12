import { teamMembers } from "@/lib/data";
import FadeIn from "./FadeIn";
import StaggerGroup from "./StaggerGroup";

export default function Team() {
  return (
    <section className="section team" id="team">
      <div className="container">
        <FadeIn className="section-header">
          <span className="section-label">Jamoa</span>
          <h2 className="section-title display-title">JAMOA</h2>
          <p className="section-desc">Tajribali mutaxassislar jamoasi — har bir loyiha sifat kafolati</p>
        </FadeIn>

        <StaggerGroup className="team-grid" stagger={0.12} y={56}>
          {teamMembers.map((member) => (
            <div key={member.name} className="team-card">
              <div className="team-avatar">
                <span>{member.initials}</span>
              </div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
