import { Fragment } from "react";
import { processSteps } from "@/lib/data";
import FadeIn from "./FadeIn";
import StaggerGroup from "./StaggerGroup";

export default function Process() {
  return (
    <section className="section process" id="process">
      <div className="section-grid-bg dark" />
      <div className="container">
        <FadeIn className="section-header">
          <span className="section-label light">Jarayon</span>
          <h2 className="section-title light">ISHLASH JARAYONIMIZ</h2>
        </FadeIn>

        <StaggerGroup className="process-steps" selector=".process-step" stagger={0.14} y={40}>
          {processSteps.map((step, index) => (
            <Fragment key={step.number}>
              {index > 0 && <div className="process-connector" />}
              <div className="process-step">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            </Fragment>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
