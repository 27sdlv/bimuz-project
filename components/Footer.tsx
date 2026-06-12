import { navLinks, socialLinks } from "@/lib/data";
import Logo from "./Logo";
import { SocialIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            O&apos;zbekistonning yetakchi BIM loyihalash kompaniyasi. Revit texnologiyasi asosida
            professional arxitektura va muhandislik xizmatlari.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navigatsiya</h4>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-social">
          <h4>Ijtimoiy tarmoqlar</h4>
          <div className="social-icons">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} aria-label={link.label}>
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 BimUz. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
