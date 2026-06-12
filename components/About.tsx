import FadeIn from "./FadeIn";
import IsometricBuilding from "./IsometricBuilding";

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <FadeIn className="about-text" x={-40}>
          <span className="section-label">Biz haqimizda</span>
          <h2 className="section-title display-title">
            BIZ
            <br />
            HAQIMIZDA
          </h2>
          <p className="about-desc">
            BimUz — O&apos;zbekistondagi BIM (Building Information Modeling) sohasidagi yetakchi
            kompaniyalardan biri. Biz arxitektura, muhandislik va qurilish sohasidagi loyihalarni
            zamonaviy raqamli texnologiyalar yordamida amalga oshiramiz. Autodesk Revit
            platformasida ishlab, har bir loyihani yuqori aniqlik va sifat bilan hujjatlashtiramiz.
          </p>
          <div className="about-highlight">
            <h3>Biz nima qilamiz?</h3>
            <p>
              To&apos;liq BIM hujjatlashtirish, 3D modellashtirish va turli soha mutaxassislari
              o&apos;rtasida muvofiqlashtirish ishlarini Autodesk Revit dasturi yordamida amalga
              oshiramiz. Bizning yondashuvimiz — aniqlik, tezlik va professional natija.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="about-visual" x={40} delay={0.15}>
          <IsometricBuilding />
          <div className="about-visual-accent" />
        </FadeIn>
      </div>
    </section>
  );
}
