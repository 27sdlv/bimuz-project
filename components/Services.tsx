import { services } from "@/lib/data";
import FadeIn from "./FadeIn";
import StaggerGroup from "./StaggerGroup";
import { ServiceIcon } from "./Icons";

export default function Services() {
  return (
    <section className="section services" id="services">
      <div className="section-grid-bg" />
      <div className="container">
        <FadeIn className="section-header">
          <span className="section-label light">Xizmatlar</span>
          <h2 className="section-title light">XIZMATLARIMIZ</h2>
          <p className="section-desc light">
            BIM texnologiyalari asosida to&apos;liq spektrdagi loyihalash xizmatlari
          </p>
        </FadeIn>

        <StaggerGroup className="services-grid" stagger={0.09} y={64}>
          {services.map((service) => (
            <div key={service.title} className="service-card">
              <div className="service-icon">
                <ServiceIcon name={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
