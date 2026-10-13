import { Link } from 'react-router-dom';
import { Logo } from './UI.jsx';

export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div><Logo light/><p>Grow smarter. Farm better.</p></div>
      <div className="footer-links"><Link to="/">Home</Link><Link to="/recommend">Crop Recommendation</Link><Link to="/disease">Disease Detection</Link><Link to="/about">About</Link></div>
      <div className="footer-links"><a href="mailto:hello@agricare.example">Contact</a><a href="mailto:privacy@agricare.example">Privacy</a></div>
    </div>
    <div className="footer-bottom"><span>{String.fromCharCode(169)} {new Date().getFullYear()} AgriCare</span><span>Made for a more confident growing season <span aria-hidden="true">{'\u2733'}</span></span></div>
  </footer>;
}
