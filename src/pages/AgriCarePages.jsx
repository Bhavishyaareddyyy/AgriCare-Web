import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CircleHelp,
  Droplets,
  FlaskConical,
  Globe2,
  HeartHandshake,
  Leaf,
  MapPin,
  Ruler,
  ShieldCheck,
  Sprout,
  Sun,
  Waves,
  Wind
} from 'lucide-react';

import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import DiseaseUpload from '../components/DiseaseUpload.jsx';
import { Button, CropCard, CropVisual, FeatureCard, SectionTitle } from '../components/UI.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useApp } from '../context/AppContext.jsx';
import { cropVisuals, details } from '../data/cropData.js';
import {
  analyzePlantImage,
  getCropHistory,
  getCropHistoryRecord,
  getCropRecommendations,
  getDiseaseHistory,
  getWeather,
  loginUser,
  registerUser,
  updateUserProfile
} from '../services/api.js';

export function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

const fields = (label, props = {}) => (
  <label className="field">
    <span>{label}</span>
    <input {...props} />
  </label>
);

const tomatoReferenceCrop = {
  id: 'tomato',
  name: 'Tomato',
  soil: [],
  seasons: [],
  sources: details.tomato.sources,
  comparisonStatus: 'reference-only',
  suitabilityCategory: 'Reference guide only',
  summary: 'Reference-only crop guide; not included in suitability matching because source-backed soil and season categories are unavailable.'
};

export function Home() {
  return (
    <Shell>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> A little more confidence in every growing season
            </span>
            <h1>
              Grow smarter.
              <br />
              <em>Farm better.</em>
            </h1>
            <p>Simple, data-informed guidance to help you compare crops and understand plant health.</p>
            <div className="hero-actions">
              <Button to="/recommend">
                Plan My Crop <ArrowRight size={17} />
              </Button>
              <Button variant="light" to="/disease">
                <Leaf size={17} /> Check Plant Health
              </Button>
            </div>
            <div className="hero-note">
              <div className="avatar-stack">
                <span>🌿</span>
                <span>🌾</span>
                <span>👩‍🌾</span>
              </div>
              <span>Practical guidance, made for growers</span>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-photo" role="img" aria-label="Green crops growing in a sunlit field" />
            <div className="hero-sticker sticker-top">
              <span>📍</span>
              <div>
                <b>Grow with confidence</b>
                <small>One step at a time</small>
              </div>
            </div>
            <div className="hero-sticker sticker-bottom">
              <span className="sticker-leaf">
                <Leaf size={20} />
              </span>
              <div>
                <b>Rooted in your conditions</b>
                <small>Guidance that fits your farm</small>
              </div>
            </div>
            <div className="hero-sun" />
          </div>
        </div>
        <div className="hero-scroll">
          <ArrowDown size={14} /> A better growing season starts here
        </div>
      </section>

      <section className="section problem-section">
        <div className="problem-intro">
          <span className="eyebrow">GROWING IS HARD ENOUGH</span>
          <h2>Good decisions shouldn’t be guesswork.</h2>
        </div>
        <p>
          Choosing what to grow, how to care for it and what to do when leaves look unwell can feel overwhelming.
          Helpful information is often hard to find, hard to trust or hard to put into practice.
        </p>
        <div className="problem-points">
          <div>
            <span>01</span>
            <b>What grows well here?</b>
          </div>
          <div>
            <span>02</span>
            <b>Am I watering enough?</b>
          </div>
          <div>
            <span>03</span>
            <b>What’s happening to this leaf?</b>
          </div>
        </div>
      </section>

      <section className="section feature-section">
        <SectionTitle
          eyebrow="A HELPFUL HAND, AT EVERY STEP"
          title="Everything your growing journey needs"
          text="Clear, practical support from your first planting decision to a healthier harvest."
          center
        />
        <div className="feature-grid">
          <FeatureCard icon={Sprout} title="Crop Recommendation" text="Explore crops that suit your soil, season, climate and available water." />
          <FeatureCard icon={Activity} title="Plant Disease Detection" text="Get a helpful starting point for understanding common plant symptoms." tint="yellow" />
          <FeatureCard icon={BookOpen} title="Crop Care Guidance" text="Find straightforward tips for watering, nutrients, spacing and harvest." tint="sage" />
          <FeatureCard icon={Globe2} title="Simple & Accessible" text="Easy-to-follow guidance in clear English." tint="sand" />
        </div>
      </section>

      <section className="steps-section">
        <div className="section steps-inner">
          <SectionTitle
            eyebrow="HOW AGRICARE WORKS"
            title="Three steps to a clearer plan"
            text="Designed to feel simple, even if you’re just getting started."
          />
          <div className="steps-grid">
            <article>
              <span className="step-num">01</span>
              <div className="step-icon">
                <MapPin />
              </div>
              <h3>Tell us about your farm</h3>
              <p>Share your location, soil, season and the resources you have available.</p>
            </article>
            <article>
              <span className="step-num">02</span>
              <div className="step-icon">
                <Activity />
              </div>
              <h3>AgriCare looks at the details</h3>
              <p>We compare your conditions with practical crop and plant health guidance.</p>
            </article>
            <article>
              <span className="step-num">03</span>
              <div className="step-icon">
                <Sprout />
              </div>
              <h3>Get guidance you can use</h3>
              <p>Explore tailored options and clear next steps for your growing season.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section promo-section">
        <div className="promo-copy">
          <span className="eyebrow">A BETTER PLACE TO START</span>
          <h2>
            Find a crop that fits <em>your ground.</em>
          </h2>
          <p>
            Every farm is different. Tell us what you’re working with and explore crops that may fit your conditions,
            with the reasons behind each suggestion.
          </p>
          <ul className="check-list">
            <li>
              <Check /> Recommendations shaped around your conditions
            </li>
            <li>
              <Check /> Plain-language reasons and care information
            </li>
            <li>
              <Check /> Several options to compare at a glance
            </li>
          </ul>
          <Button to="/recommend">
            Explore crop options <ArrowRight size={17} />
          </Button>
        </div>
        <div className="promo-art crop-promo-art">
          <div className="crop-photo" role="img" aria-label="Healthy rows of young crops" />
          <div className="recommend-float">
            <div className="recommend-icon">🌱</div>
            <div>
              <small>LOCAL MODEL RANKING</small>
              <b>Compare your options</b>
              <small>Use your measured farm inputs</small>
            </div>
            <Check className="recommend-check" />
          </div>
          <div className="floating-label">
            <Droplets /> Guidance for your conditions
          </div>
        </div>
      </section>

      <section className="disease-band">
        <div className="disease-visual">
          <div className="leaf-photo" role="img" aria-label="Close-up of a leaf being inspected" />
          <div className="scan-label">
            <span className="scan-pulse" /> A closer look at plant health
          </div>
        </div>
        <div className="disease-copy">
          <span className="eyebrow">WHEN YOUR PLANT NEEDS A CLOSER LOOK</span>
          <h2>Make sense of what you’re seeing.</h2>
          <p>
            Share a clear photo of a plant leaf and get a simple, informative starting point for understanding its
            symptoms and possible next steps.
          </p>
          <div className="disease-bullets">
            <span>
              <Check /> Easy photo upload
            </span>
            <span>
              <Check /> Symptoms explained clearly
            </span>
            <span>
              <Check /> Practical prevention tips
            </span>
          </div>
          <Button to="/disease" variant="cream">
            Check plant health <ArrowRight size={17} />
          </Button>
        </div>
      </section>

      <section className="section care-section">
        <div className="care-header">
          <SectionTitle
            eyebrow="THE LITTLE THINGS ADD UP"
            title="Good care, made easier to remember."
            text="Find clear, timely reminders for each part of the growing cycle."
          />
          <div className="care-orbit">
            <div className="orbit-ring" />
            <div className="orbit-core">
              <Sprout size={36} />
            </div>
            <span className="orbit-item oi1">
              <Droplets />
            </span>
            <span className="orbit-item oi2">
              <FlaskConical />
            </span>
            <span className="orbit-item oi3">
              <Ruler />
            </span>
            <span className="orbit-item oi4">
              <Sun />
            </span>
          </div>
        </div>
        <div className="care-list">
          <div>
            <span>
              <Droplets />
            </span>
            <b>Watering</b>
            <small>Give plants the moisture they need</small>
          </div>
          <div>
            <span>
              <FlaskConical />
            </span>
            <b>Nutrients</b>
            <small>Build healthy soil and steady growth</small>
          </div>
          <div>
            <span>
              <Ruler />
            </span>
            <b>Plant spacing</b>
            <small>Leave room for roots and airflow</small>
          </div>
          <div>
            <span>
              <Wind />
            </span>
            <b>Growth stages</b>
            <small>Know what to look for as plants grow</small>
          </div>
          <div>
            <span>
              <CalendarDays />
            </span>
            <b>Harvesting</b>
            <small>Learn when produce is ready</small>
          </div>
          <div>
            <span>
              <ShieldCheck />
            </span>
            <b>Disease prevention</b>
            <small>Support healthier plants early</small>
          </div>
        </div>
      </section>

      <section className="language-band">
        <div className="language-icon">
          <Globe2 size={27} />
        </div>
        <div>
          <span className="eyebrow">MADE FOR GROWERS</span>
          <h2>Clear guidance, every step of the way.</h2>
          <p>AgriCare brings practical growing advice together in one simple English-language platform.</p>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-leaf cta-leaf1">✓</div>
        <div className="cta-leaf cta-leaf2">✓</div>
        <span className="eyebrow">YOUR NEXT SEASON STARTS HERE</span>
        <h2>Ready to grow smarter?</h2>
        <p>A few small steps can make your next growing decision feel a lot clearer.</p>
        <Button to="/signup" variant="cream">
          Get Started <ArrowRight size={17} />
        </Button>
      </section>
    </Shell>
  );
}

export function Auth({ signup = false }) {
  const { login } = useApp();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;

    const form = Object.fromEntries(new FormData(event.currentTarget));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email || ''))) {
      setError('Enter a valid email address.');
      return;
    }
    if (String(form.password || '').length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (signup && String(form.password || '') !== String(form.confirm || '')) {
      setError('Your passwords do not match.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const result = signup
        ? await registerUser({
            name: form.name,
            email: form.email,
            password: form.password,
            location: form.location
          })
        : await loginUser({ email: form.email, password: form.password });

      login(result.user, result.token);
      navigate('/dashboard');
    } catch (failure) {
      setError(
        failure.message === 'API_UNAVAILABLE'
          ? 'AgriCare could not reach the API at localhost:5000. Check that the backend is running.'
          : failure.message || 'Unable to complete your request. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <section className="auth-page">
        <div className="auth-aside">
          <span className="eyebrow">A LITTLE MORE CONFIDENCE, EVERY DAY</span>
          <h1>{signup ? 'Start growing with AgriCare.' : 'Welcome back to your growing season.'}</h1>
          <p>Simple tools and practical guidance to help you make the next decision with confidence.</p>
          <div className="auth-aside-quote">
            <span>“</span>
            <p>Growing well starts with understanding what your plants need.</p>
            <small>THE AGRICARE APPROACH</small>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-heading">
            <div className="auth-icon">
              <Leaf />
            </div>
            <h2>{signup ? 'Create your account' : 'Welcome back'}</h2>
            <p>{signup ? 'Join AgriCare for practical growing guidance.' : 'Log in to see your growing dashboard.'}</p>
          </div>

          <form onSubmit={submit} noValidate>
            {signup && (
              <>
                {fields('Full name', { name: 'name', placeholder: 'e.g. Ananya Rao', required: true, autoComplete: 'name' })}
                {fields('Location', { name: 'location', placeholder: 'Town or district', required: true })}
              </>
            )}

            {fields('Email address', {
              name: 'email',
              type: 'email',
              placeholder: 'name@example.com',
              required: true,
              autoComplete: 'email'
            })}

            <label className="field password-field">
              <span>Password</span>
              <div className="password-wrap">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  autoComplete={signup ? 'new-password' : 'current-password'}
                />
                <button type="button" className="show-toggle" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {signup &&
              fields('Confirm password', {
                name: 'confirm',
                type: 'password',
                placeholder: 'Repeat your password',
                required: true,
                autoComplete: 'new-password'
              })}

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button className="btn btn-primary wide" disabled={busy} type="submit">
              {busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}
            </button>

            <div className="auth-switch">
              <span>{signup ? 'Already have an account?' : 'Need an account?'}</span>
              <Link to={signup ? '/login' : '/signup'}>{signup ? 'Log in' : 'Sign up'}</Link>
            </div>
          </form>
        </div>
      </section>
    </Shell>
  );
}

export function Dashboard() {
  const { user } = useApp();
  const [cropHistory, setCropHistory] = useState([]);
  const [diseaseHistory, setDiseaseHistory] = useState([]);
  const [historyError, setHistoryError] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const timer = setInterval(tick, 30_000);

    Promise.all([getCropHistory(), getDiseaseHistory()])
      .then(([cropResult, diseaseResult]) => {
        setCropHistory(cropResult?.items || []);
        setDiseaseHistory(diseaseResult?.items || []);
      })
      .catch(() => setHistoryError(true));

    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateText = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(now);

  const formatDate = (value) => {
    const parsed = value ? new Date(value) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) return 'Date unavailable';
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(parsed);
  };

  return (
    <ProtectedRoute>
      <Shell>
        <div className="page-wrap">
          <div className="dashboard-welcome">
            <div>
              <span className="eyebrow">{dateText}</span>
              <h1>
                {greeting}, {user?.name?.split(' ')[0] || 'Farmer'} <Sun aria-hidden="true" />
              </h1>
              <p>Let’s make this growing season a little clearer.</p>
            </div>
            <Button to="/recommend">
              Plan a crop <ArrowRight size={17} />
            </Button>
          </div>

          <div className="dashboard-grid">
            <div className="dash-main">
              <div className="quick-grid">
                <Link to="/recommend" className="quick-card quick-green">
                  <span>
                    <Sprout />
                  </span>
                  <b>Find crops for my farm</b>
                  <small>Get tailored suggestions</small>
                </Link>
                <Link to="/disease" className="quick-card quick-cream">
                  <span>
                    <Activity />
                  </span>
                  <b>Check a plant photo</b>
                  <small>Understand visible symptoms</small>
                </Link>
              </div>

              <div className="dash-panel">
                <div className="panel-head">
                  <div>
                    <span className="eyebrow">YOUR RECENT ACTIVITY</span>
                    <h2>Crop recommendations</h2>
                  </div>
                  <Link to="/history">
                    View all <ArrowRight size={16} />
                  </Link>
                </div>

                {historyError ? (
                  <p role="status">Saved history is temporarily unavailable.</p>
                ) : cropHistory.length ? (
                  cropHistory.slice(0, 3).map((record) => {
                    const crop = record.recommendations?.[0];
                    if (!crop) return null;
                    return (
                      <div className="activity-row" key={record._id || crop.id}>
                        <CropVisual cropId={crop.id} className="activity-crop-visual" />
                        <div>
                          <b>{crop.name}</b>
                          <small>{formatDate(record.createdAt)}</small>
                        </div>
                        <Link to={`/history/${record._id}`}>Open</Link>
                      </div>
                    );
                  })
                ) : (
                  <p role="status">No saved crop recommendations yet.</p>
                )}
              </div>
            </div>

            <div className="dash-side">
              <div className="dash-panel">
                <div className="panel-head">
                  <div>
                    <span className="eyebrow">VISUAL CHECK</span>
                    <h2>Plant health history</h2>
                  </div>
                </div>

                {historyError ? (
                  <p role="status">Plant history is temporarily unavailable.</p>
                ) : diseaseHistory.length ? (
                  diseaseHistory.slice(0, 3).map((record) => (
                    <div className="activity-row" key={record._id}>
                      <span className="activity-pill yellow">{record.diseaseName}</span>
                      <div>
                        <b>{record.plant || 'Plant sample'}</b>
                        <small>{formatDate(record.createdAt)}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p role="status">No plant checks saved yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </ProtectedRoute>
  );
}

export function Recommendation() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));

    const requiredFields = ['location', 'soil', 'area', 'areaUnit', 'temperature', 'humidity', 'soilPH', 'rainfall', 'season'];
    if (requiredFields.some(name => !form[name]?.trim())) {
      setError('Enter the farm details and all four measured model inputs. The model does not fill missing values.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const result = await getCropRecommendations({ ...form, requestId: crypto.randomUUID() });
      sessionStorage.setItem(`agricare-crop-results:${user.id || user._id}`, JSON.stringify(result));
      navigate('/crops');
    } catch (failure) {
      const fieldNames = { N: 'Nitrogen', P: 'Phosphorus', K: 'Potassium', temperature: 'Temperature', humidity: 'Humidity', ph: 'Soil pH', rainfall: 'Rainfall' };
      const outOfRange = failure.details?.outOfRange;
      const rangeMessage = outOfRange
        ? Object.entries(outOfRange).map(([name, range]) => `${fieldNames[name] || name}: ${range.min}–${range.max}`).join('; ')
        : '';
      setError([failure.message || 'The local crop model is unavailable. Please try again.', rangeMessage].filter(Boolean).join(' '));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="page-wrap form-page">
        <div className="form-intro">
          <span className="eyebrow">CROP RECOMMENDATION</span>
          <h1>
            Rank crops from <em>your measurements.</em>
          </h1>
          <p>Enter your farm conditions to see the five highest-ranked crops supported by the trained model.</p>
          <div className="demo-banner">
            <CircleHelp size={18} />
            <span>The trained Logistic Regression model ranks 22 crop classes using temperature, humidity, soil pH and rainfall, and shows its five highest-ranked distinct crops. Scores are uncalibrated model probabilities, not probabilities of crop success. Location, soil type, season and land area are saved as context and do not affect the ranking. The dataset does not define rainfall's accumulation period. Results are exploratory, not agronomic advice.</span>
          </div>
        </div>

        <form className="farm-form" onSubmit={submit}>
          <div className="form-grid">
            {fields('Farm location', { name: 'location', placeholder: user?.location || 'e.g. Guntur, Andhra Pradesh', required: true })}
            <label className="field">
              <span>Soil type</span>
              <select name="soil" required defaultValue="">
                <option value="" disabled>
                  Select soil type
                </option>
                {['Red', 'Black', 'Alluvial', 'Sandy', 'Clay', 'Other/unknown'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            {fields('Soil pH', {
              name: 'soilPH',
              type: 'number',
              min: 0,
              max: 14,
              step: 'any',
              placeholder: 'Enter measured soil pH',
              required: true
            })}

            {fields('Temperature in °C', {
              name: 'temperature',
              type: 'number',
              min: 0,
              max: 55,
              step: 'any',
              placeholder: 'Enter measured value',
              required: true
            })}

            {fields('Relative humidity (%)', {
              name: 'humidity',
              type: 'number',
              min: 0,
              max: 100,
              step: 'any',
              placeholder: 'Enter measured value',
              required: true
            })}

            {fields('Rainfall (mm; previous 12 months)', {
              name: 'rainfall',
              type: 'number',
              min: 0,
              max: 10000,
              step: 'any',
              placeholder: 'Enter 12-month total',
              required: true
            })}

            <label className="field">
              <span>Season</span>
              <select name="season" required defaultValue="">
                <option value="" disabled>Select growing season</option>
                {['Kharif', 'Rabi', 'Zaid', 'Perennial/Year-round'].map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

            {fields('Land area', {
              name: 'area',
              type: 'number',
              min: 0.1,
              step: '0.1',
              placeholder: 'e.g. 2.5',
              required: true
            })}

            <label className="field">
              <span>Area unit</span>
              <select name="areaUnit" defaultValue="acres">
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </label>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button className="btn btn-primary wide" type="submit" disabled={busy}>
            {busy ? 'Running local crop model…' : 'Rank crops with AI'}
          </button>
        </form>
      </div>
    </Shell>
  );
}

export function CropResults() {
  const { setSelectedCrop, user } = useApp();
  const navigate = useNavigate();
  const [sort, setSort] = useState('fit');
  const [filter, setFilter] = useState('');
  const [stored, setStored] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let current = null;
    try { current = user ? JSON.parse(sessionStorage.getItem(`agricare-crop-results:${user.id || user._id}`) || 'null') : null; } catch { current = null; }
    if (current && Array.isArray(current.recommendations) && current.recommendations.length) {
      setStored(current);
      setLoading(false);
      return () => { active = false; };
    }
    getCropHistory({ page: 1, limit: 1 }).then(result => {
      if (active && result?.items?.[0]) {
        const record = result.items[0];
        const savedRecommendations = Array.isArray(record.recommendations) ? record.recommendations : [];
        setStored({ ...record, recommendations: savedRecommendations, inputs: record.inputSnapshot || record, model: savedRecommendations[0] ? { name: savedRecommendations[0].model, version: savedRecommendations[0].modelVersion, heldOutAccuracy: savedRecommendations[0].heldOutAccuracy } : null, weather: record.sourceMetadata?.weather, weatherError: record.sourceMetadata?.weatherError });
      } else if (active) setStored({ recommendations: [] });
    }).catch(failure => { if (active) setError(failure.message || 'Saved recommendations could not be loaded.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user]);

  const recommendations = Array.isArray(stored?.recommendations) ? stored.recommendations.filter(crop => crop && typeof crop.id === 'string' && typeof crop.name === 'string') : [];
  const ordered = recommendations.filter(crop => crop.name.toLowerCase().includes(filter.trim().toLowerCase())).sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (Number.isInteger(a.rank) && Number.isInteger(b.rank)) return a.rank - b.rank;
    return Number(b.comparisonStatus === 'matches-listed-conditions') - Number(a.comparisonStatus === 'matches-listed-conditions') || a.name.localeCompare(b.name);
  });
  const hasModelRanking = recommendations.some(crop => crop.model === 'local-logistic-crop-recommendation');
  const hasOlderModelRanking = recommendations.some(crop => crop.model && crop.model !== 'local-logistic-crop-recommendation');
  const weather = stored?.weather;

  return <Shell><div className="page-wrap results-page">
    <div className="results-top"><div><span className="eyebrow">YOUR CROP OPTIONS</span><h1>{hasModelRanking ? <>Local model <em>ranking.</em></> : hasOlderModelRanking ? <>Saved model <em>ranking.</em></> : <>Saved crop <em>comparison.</em></>}</h1><p>{hasModelRanking ? 'Ranked from temperature, humidity, soil pH and rainfall entered for this comparison.' : hasOlderModelRanking ? 'This historical model result is preserved as originally created and was not recalculated by the current model.' : 'This older saved record is preserved as originally created and was not recalculated by the current model.'}</p></div><div className="hero-actions"><Button variant="outline" to="/crops/tomato">Tomato reference</Button><Button variant="outline" to="/recommend">Edit conditions</Button></div></div>
    {weather ? <><p className="weather-summary">Open-Meteo current model conditions for {weather.location?.name}, {weather.location?.country}: {weather.current?.temperatureC} &deg;C at {weather.current?.time} ({weather.current?.timezone}), retrieved {weather.retrievedAt}. These are model conditions, not a station observation.</p><section className="weather-forecast"><h2>Seven-day forecast</h2><p>Forecast model data, not observed future or seasonal rainfall.</p><div>{(Array.isArray(weather.forecast?.days) ? weather.forecast.days : []).map(day => { const forecastDate = new Date(`${day.date}T12:00:00`); const label = Number.isNaN(forecastDate.getTime()) ? day.date : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(forecastDate); return <span key={day.date}><b>{label}</b><small>{day.meanTemperatureC ?? 'not available'} &deg;C mean ? {day.precipitationMm ?? 'not available'} mm forecast</small></span>; })}</div></section></> : <p className="weather-summary" role="status">Live weather is unavailable{stored?.weatherError ? `: ${stored.weatherError}` : ''}. Current conditions and forecast could not be assessed; no live values were substituted.</p>}
    {(hasModelRanking || hasOlderModelRanking) && <p className="results-context">Farm context: {stored?.inputs?.location || stored?.location || 'location not recorded'} · soil type {stored?.inputs?.soil || stored?.soilType || 'not recorded'} · area {stored?.inputs?.area ?? stored?.landArea ?? 'not recorded'} {stored?.inputs?.areaUnit || stored?.areaUnit || ''}. Location, soil type and area are saved for context; they do not change the model ranking. No seed quantities are estimated.</p>}
    {hasModelRanking && <p className="results-context">Model inputs: temperature {stored?.inputs?.temperature ?? stored?.temperature ?? 'not recorded'} °C, humidity {stored?.inputs?.humidity ?? 'not recorded'}%, soil pH {stored?.inputs?.soilPH ?? 'not recorded'}, and rainfall {stored?.inputs?.rainfall ?? stored?.rainfall ?? 'not recorded'} mm over {stored?.inputs?.rainfallPeriod === 'previous_12_months' ? 'the previous 12 months' : 'the period recorded for this comparison'}.</p>}
    {Number.isFinite(stored?.model?.heldOutAccuracy) && <p className="results-context">Logistic Regression accuracy on the documented held-out dataset split: {(stored.model.heldOutAccuracy * 100).toFixed(1)}%. This is not field accuracy or a probability of success.</p>}
    <div className="demo-banner"><CircleHelp size={18}/><span>{hasModelRanking ? 'The model uses temperature, humidity, soil pH and rainfall to rank 22 trained classes; the displayed five are its highest-ranked predictions. Scores are uncalibrated model probabilities, not probabilities of crop success. Row-level provenance and the dataset rainfall period are unspecified. Location, soil type, season and land area do not affect the ranking. Treat recommendations as exploratory and verify locally.' : hasOlderModelRanking ? 'This result was created by an earlier model and is shown unchanged for history. Its scores and ranking were not recalculated by the current Logistic Regression model.' : 'This record predates the local AI ranking. Historical comparisons are retained without changing their original results.'}</span></div>
    <div className="results-toolbar"><span><b>{loading ? 'Loading saved recommendations?' : `${ordered.length}${filter.trim() ? ` of ${recommendations.length}` : ''} crops`}</b>{!loading && ' to explore'}</span><label className="crop-filter"><span>Filter crops</span><input type="search" value={filter} onChange={event => setFilter(event.target.value)} placeholder="Crop name" aria-label="Filter crops by name"/></label><label className="sort-toggle"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="fit">Model rank</option><option value="name">Name</option></select></label></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {!loading && !error && ordered.length === 0 && recommendations.length > 0 && <div className="empty-state"><h2>No crops match this filter.</h2><button className="btn btn-outline" onClick={() => setFilter('')}>Clear filter</button></div>}{!loading && !error && recommendations.length === 0 && <div className="empty-state"><h2>No saved crop comparison is available.</h2><p>Complete the required farm conditions to compare crops. If you expected a saved result, check your recommendation history.</p><Button to="/recommend">Enter conditions</Button> <Button variant="outline" to="/history">Open history</Button></div>}
    <div className="crop-grid">{ordered.map(crop => <CropCard key={crop.id} crop={{ ...crop, color: 'sage' }} onSelect={selected => { setSelectedCrop(selected); navigate(`/crops/${selected.id}`); }}/>)}</div>
  </div></Shell>;
}

export function RecommendationHistory() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getCropHistory({ page, limit: 20 }).then(result => { if (active) { setRecords(Array.isArray(result?.items) ? result.items : []); setPages(result?.pages || 1); } }).catch(failure => { if (active) setError(failure.message || 'Recommendation history is unavailable.'); });
    return () => { active = false; };
  }, [page]);
  const formatDate = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date); };
  return <Shell><div className="page-wrap results-page"><div className="results-top"><div><span className="eyebrow">SAVED RECORDS</span><h1>Recommendation history</h1><p>Previously saved inputs and crop comparisons, newest first.</p></div><Button variant="outline" to="/recommend">New comparison</Button></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {!error && records.length === 0 && <div className="empty-state"><h2>No recommendations saved yet.</h2><p>Create a crop comparison while signed in to save it here.</p><Button to="/recommend">Compare crops</Button></div>}
    <div className="history-list">{records.map(record => { const values = record.inputSnapshot || record; const crops = Array.isArray(record.recommendations) ? record.recommendations : []; return <Link className="history-record" key={record._id} to={`/history/${record._id}`}><span className="eyebrow">{formatDate(record.createdAt)}</span><h2>{values.location || record.location || 'Farm location unavailable'}</h2><p>Soil: {values.soil || record.soilType || 'not recorded'}{(values.season || record.season) && ` · Season: ${values.season || record.season}`}{(values.water || record.waterAvailability) && ` · Water: ${values.water || record.waterAvailability}`}</p><div className="history-crop-list">{crops.length ? crops.map(crop => <span key={crop.id || crop.name}><CropVisual cropId={crop.id}/>{crop.name}</span>) : 'No saved crop rows'}</div><span>Open original comparison <ArrowRight size={15}/></span></Link>; })}</div>
    {pages > 1 && <div className="history-pagination"><Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><span>Page {page} of {pages}</span><Button variant="outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</Button></div>}
  </div></Shell>;
}

export function SavedRecommendation() {
  const { id } = useParams();
  const { setSelectedCrop } = useApp();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; getCropHistoryRecord(id).then(value => { if (active) setRecord(value); }).catch(failure => { if (active) setError(failure.message || 'This saved recommendation could not be opened.'); }); return () => { active = false; }; }, [id]);
  const inputs = record?.inputSnapshot || record;
  const savedDate = record?.createdAt ? new Date(record.createdAt) : null;
  const timestamp = savedDate && !Number.isNaN(savedDate.getTime()) ? new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'short' }).format(savedDate) : 'Date unavailable';
  const recommendations = Array.isArray(record?.recommendations) ? record.recommendations : [];
  return <Shell><div className="page-wrap results-page"><Link className="back-link" to="/history">Back to recommendation history</Link>{error && <p className="form-error" role="alert">{error}</p>}{record && <><span className="eyebrow">SAVED {timestamp}</span><h1>Original crop comparison</h1><div className="results-context"><p>Location: {inputs.location || record.location || 'not recorded'} · Soil type: {inputs.soil || record.soilType || 'not recorded'}{(inputs.season || record.season) && <> · Season: {inputs.season || record.season}</>}{(inputs.water || record.waterAvailability) && <> · Water: {inputs.water || record.waterAvailability}</>} · Area: {inputs.area ?? record.landArea ?? 'not recorded'} {inputs.areaUnit || record.areaUnit || ''}</p><p>{inputs.rainfallPeriod ? <>Current model inputs: temperature {inputs.temperature ?? 'not recorded'} °C · humidity {inputs.humidity ?? 'not recorded'}% · soil pH {inputs.soilPH ?? 'not recorded'} · rainfall {inputs.rainfall ?? 'not recorded'} mm over the previous 12 months.</> : <>Original model inputs: N {inputs.nitrogen ?? 'not recorded'} · P {inputs.phosphorus ?? 'not recorded'} · K {inputs.potassium ?? 'not recorded'} · pH {inputs.soilPH ?? 'not recorded'} · temperature {record.inputSnapshot ? (inputs.temperature ?? inputs.farmerTemperature ?? 'not recorded') : 'origin unavailable for this older record'} °C · humidity {inputs.humidity ?? 'not recorded'}% · rainfall {record.inputSnapshot ? (inputs.rainfall ?? inputs.farmerRainfall ?? 'not recorded') : 'origin unavailable for this older record'} mm</>}</p></div>{record.sourceMetadata?.weather ? <p className="weather-summary">Saved Open-Meteo model data for {record.sourceMetadata.weather.location?.name}, retrieved {record.sourceMetadata.weather.retrievedAt}. Forecast values are not observations.</p> : <p role="status">Weather was unavailable or not saved for this comparison; no values have been substituted.</p>}<p>{record.sourceMetadata?.scoreMethod || recommendations[0]?.scoreMethod || 'Legacy saved comparison. Its original results are shown without recalculation.'}</p><div className="crop-grid">{recommendations.map(crop => <CropCard key={crop.id || crop.name} crop={crop} onSelect={selected => { setSelectedCrop(selected); navigate(`/crops/${selected.id}`); }}/>)}</div>{recommendations.length === 0 && <p role="status">This older record has no compatible saved crop results.</p>}</>}</div></Shell>;
}

export function CropDetail() {
  const { selectedCrop, setSelectedCrop, user } = useApp();
  const { id } = useParams();
  const [stored, setStored] = useState(null);
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    try {
      setStored(user ? JSON.parse(sessionStorage.getItem(`agricare-crop-results:${user.id || user._id}`) || 'null') : null);
    } catch {
      setStored(null);
    }
  }, [user]);

  const crop =
    (selectedCrop && selectedCrop.id === id ? selectedCrop : null) ||
    stored?.recommendations?.find((item) => item.id === id) ||
    (id === 'tomato' ? tomatoReferenceCrop : null);

  useEffect(() => {
    if (crop) setSelectedCrop(crop);
  }, [crop, setSelectedCrop]);

  const location = stored?.inputs?.location || stored?.location || user?.location;
  useEffect(() => {
    if (!location) return undefined;
    let active = true;
    setWeatherLoading(true);
    getWeather(location)
      .then(value => { if (active) setLiveWeather(value); })
      .catch(() => { if (active) setLiveWeather(null); })
      .finally(() => { if (active) setWeatherLoading(false); });
    return () => { active = false; };
  }, [location]);

  if (!crop) {
    return (
      <Shell>
        <div className="page-wrap">
          <p role="status">Crop details are available after selecting a recommendation.</p>
          <Button to="/recommend">Get crop recommendations</Button>
        </div>
      </Shell>
    );
  }

  const info = details[crop.id];
  const cropSources = [...new Map([...(crop.sources || []), ...(info?.sources || [])].map((source) => [source.url, source])).values()];
  const sources = cropSources.map((source) => (
    <li key={source.url}>
      <a href={source.url} target="_blank" rel="noreferrer">
        {source.name}
      </a>
      <small>{[source.region, source.publicationDate].filter(Boolean).join(' · ')}</small>
    </li>
  ));

  const section = (title, body) => <section className="detail-card crop-detail-card"><h2>{title}</h2><p>{body}</p></section>;
  const missing = 'Reliable crop-specific information is unavailable in the checked sources.';

  return (
    <Shell>
      <div className="page-wrap detail-page">
        <Link className="back-link" to="/crops">
          Back to crop recommendations
        </Link>

        <div className="detail-hero">
          <div className="detail-visual">
            <CropVisual cropId={crop.id} />
            {cropVisuals[crop.id]?.source && <span className="detail-photo-credit">Photo: <a href={cropVisuals[crop.id].source} target="_blank" rel="noreferrer">{cropVisuals[crop.id].credit}</a> · <a href={cropVisuals[crop.id].licenseUrl} target="_blank" rel="noreferrer">{cropVisuals[crop.id].license}</a></span>}
          </div>

          <div>
            <span className="eyebrow">CROP REFERENCE</span>
            <h1>{crop.name}</h1>
            <p>{info?.overview || crop.referenceType || missing}</p>
          </div>

          <div className="detail-score">
            <strong>{crop.suitabilityCategory || 'Reference only'}</strong>
            <span>{crop.comparisonStatus === 'model-ranked' && Number.isFinite(crop.modelScore)
              ? `Uncalibrated model probability ${crop.modelScore.toFixed(3)}; not a probability of crop success`
              : crop.comparisonStatus === 'matches-listed-conditions' || crop.comparisonStatus === 'reference-mismatch'
                ? 'Rule-based reference comparison; no score or probability'
                : 'Reference-only profile; suitability not assessed'}</span>
          </div>
        </div>

        <div className="detail-columns">
          <div className="detail-main">
            {section('Crop overview', info?.overview || crop.referenceType || missing)}
            <div className="crop-fact-grid">
              {section('Regions and soils', `Regions: ${info?.regions || missing} Soil and pH: ${info?.soil || missing}`)}
              {section('Season and sowing', `${info?.season || missing} ${info?.sowing || missing}`)}
              {section('Climate, rainfall and irrigation', `Temperature: ${info?.temperature || missing} Rainfall: ${info?.rainfall || missing} Irrigation: ${info?.water || missing}`)}
              {location && section('Current weather context', liveWeather
                ? `Open-Meteo model conditions for ${liveWeather.location?.name || location}: ${liveWeather.current?.temperatureC ?? 'not available'} °C and ${liveWeather.current?.precipitationMm ?? 'not available'} mm precipitation at ${liveWeather.current?.time || 'time unavailable'} (${liveWeather.current?.timezone || 'timezone unavailable'}). Retrieved ${liveWeather.retrievedAt || 'time unavailable'}. This is current model data, not a station observation or crop requirement.`
                : weatherLoading ? 'Loading current weather model data…' : 'Current weather is unavailable. No live values were substituted.')}
              {section('Growing duration', info?.duration || missing)}
              {section('Nutrients', `${info?.nutrients || missing} Soil testing is recommended before fertilizer decisions.`)}
              {section('Diseases and prevention', `${info?.diseases?.join(' ') || 'The available crop catalogue does not provide crop-specific disease guidance.'} ${info?.prevention || ''}`.trim())}
            </div>
          </div>

          <aside className="detail-sidebar">
            <section className="detail-card">
              <span className="eyebrow">{crop.comparisonStatus === 'reference-only' ? 'CROP REFERENCES' : 'WHY THIS RECOMMENDATION?'}</span>
              <h2>Recommendation and sources</h2>
              <p>{crop.summary || crop.reasons?.join(' ') || crop.referenceType || 'Reference information only. Suitability has not been assessed for this crop.'}</p>
              <ul className="detail-source-list">{sources.length ? sources : <li>Crop sources are unavailable for this saved record.</li>}</ul>
              <p className="reference-check-date">{info?.lastVerified || 'Reference publication/update date unavailable.'}</p>
              <p>{crop.scoreMethod || (crop.comparisonStatus === 'reference-only' ? crop.summary : 'This older saved record has no recorded comparison method.')}</p>
            </section>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

export function Disease() {
  const { diseaseImage, setDiseaseResult } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function runAnalysis() {
    if (!diseaseImage) {
      setError('Add a plant photo to continue.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const result = await analyzePlantImage(diseaseImage);
      setDiseaseResult(result);
      navigate('/disease-result');
    } catch (failure) {
      setError(
        failure.code === 'MODEL_UNAVAILABLE'
          ? 'Plant analysis is offline. Start the local inference service and try again.'
          : failure.code === 'INVALID_IMAGE'
            ? 'Use a valid JPG, PNG or WEBP image smaller than 5 MB.'
            : 'The image or inference service is unavailable. Check the image and retry.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="page-wrap disease-page">
        <div className="disease-heading">
          <span className="eyebrow">PLANT HEALTH CHECK</span>
          <h1>
            Let’s take a closer <em>look.</em>
          </h1>
          <p>The classifier covers 38 PlantVillage classes across 14 crops, including tomato, potato, bell pepper and maize. Rice, wheat, cotton and groundnut are unsupported; field photos may also be rejected or less reliable.</p>
        </div>

        <div className="disease-layout">
          <div className="upload-card">
            <div className="upload-card-head">
              <span className="upload-step">01</span>
              <div>
                <h2>Add a plant photo</h2>
                <p>One clear, well-lit image works best.</p>
              </div>
            </div>

            <DiseaseUpload />
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button className="btn btn-primary wide analyze-button" onClick={runAnalysis} disabled={busy}>
              {busy ? 'Analyzing…' : 'Analyze plant'} <ArrowRight size={17} />
            </button>
            <p className="upload-privacy">Uploaded image is processed temporarily and not stored.</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function DiseaseResult() {
  const { diseaseResult, setDiseaseResult, diseaseImage, setDiseaseImage } = useApp();
  const result = diseaseResult;
  const unsupported = result?.predictionStatus === 'unsupported';

  return (
    <Shell>
      <div className="page-wrap disease-result-page">
        <Link className="back-link" to="/disease">
          Back to plant check
        </Link>

        {!result ? (
          <p role="status">No analysis result. Upload a plant photo to begin.</p>
        ) : (
          <>
            <div className="result-banner">
              <span className="result-symbol">*</span>
              <div>
                <span className="eyebrow">PLANT HEALTH MODEL RESULT</span>
                <h1>
                  A screening result to <em>review.</em>
                </h1>
                <p>A model suggestion is not a confirmed diagnosis.</p>
              </div>
            </div>

            <div className="disease-result-grid">
              <div className="result-image-card">
                {diseaseImage ? <img src={diseaseImage.preview} alt="Uploaded plant leaf" /> : <div className="result-placeholder">Plant</div>}
                <div>
                  <small>MODEL CLASS</small>
                  <b>{result.plant || 'Unknown'}</b>
                </div>
              </div>

              <section className="result-detail-card">
                <div className="result-disease-title">
                  <span className="disease-badge">{unsupported ? 'Unable to classify this photo' : 'Uncertain screening result'}</span>
                  <h2>
                    {unsupported ? 'No reliable match for this image' : `${result.plant}: ${result.diseaseName}`}
                  </h2>
                  <p>{unsupported ? result.message : 'Plant disease classifier suggestion; not a verified diagnosis.'}</p>
                </div>

                {!unsupported && Number.isFinite(result.classScore) && (
                  <div className="confidence-row">
                    <span>{result.scoreDescription}</span>
                    <strong>{result.classScore.toFixed(3)} <small>raw class score</small></strong>
                  </div>
                )}

                {unsupported ? (
                  <div className="result-info">
                    <h3>Why the model abstained</h3>
                    <p>Use a close, well-lit photo of one leaf on a plain background. The model covers 38 PlantVillage classes across 14 crops, including tomato, potato, bell pepper and maize; it does not cover rice, wheat, cotton or groundnut. A supported crop photographed in a field can still fall outside the validated image distribution.</p>
                  </div>
                ) : (
                  <>
                    <div className="result-info">
                      <h3>Visible symptoms</h3>
                      <p>{result.symptoms}</p>
                    </div>
                    <div className="result-info">
                      <h3>Prevention and management</h3>
                      <p>{result.prevention}</p>
                    </div>
                  </>
                )}
                {Number.isFinite(result.imageSimilarity) && Number.isFinite(result.rejectionThreshold) && (
                  <div className="result-info">
                    <h3>Image-distribution check</h3>
                    <p>Feature similarity: {result.imageSimilarity.toFixed(3)}; published reference threshold: {result.rejectionThreshold.toFixed(3)}. Similarity is not disease confidence. {unsupported ? 'This image fell below the threshold, so no disease class was returned.' : 'This image passed the reference-set check; the disease class remains a model suggestion, not a diagnosis.'}</p>
                  </div>
                )}
                <div className="result-info">
                  <h3>References</h3>
                  <ul>
                    {result.references?.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} target="_blank" rel="noreferrer">
                          {source.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.historySaved === false && <p role="status">Inference succeeded, but this result could not be saved to history.</p>}
              </section>
            </div>

            <div className="result-disclaimer">
              <CircleHelp />
              <p>{result.disclaimer}</p>
            </div>
          </>
        )}

        <Button
          to="/disease"
          onClick={() => {
            setDiseaseResult(null);
            if (diseaseImage?.preview) URL.revokeObjectURL(diseaseImage.preview);
            setDiseaseImage(null);
          }}
        >
          Analyze another image <ArrowRight size={17} />
        </Button>
      </div>
    </Shell>
  );
}

export function Profile() {
  const { user, login, logout } = useApp();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  async function saveProfile(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    setSaveError('');

    try {
      const response = await updateUserProfile(form);
      login(response.user, localStorage.getItem('agricare-token'));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaved(false);
      setSaveError('Could not save your profile. The service may be temporarily unavailable.');
    }
  }

  return (
    <ProtectedRoute>
      <Shell>
        <div className="page-wrap profile-page">
          <div className="profile-title">
            <span className="eyebrow">YOUR ACCOUNT</span>
            <h1>Profile & preferences</h1>
            <p>Keep your details up to date so AgriCare can feel a little more personal.</p>
          </div>

          <form className="profile-card" onSubmit={saveProfile}>
            <div className="profile-avatar">
              {(user?.name || 'A')
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="profile-fields">
              <div className="profile-section-head">
                <h2>Your details</h2>
                <span>All fields are optional</span>
              </div>

              <div className="form-grid">
                {fields('Full name', { name: 'name', defaultValue: user?.name || '', required: true })}
                {fields('Email address', { name: 'email', type: 'email', defaultValue: user?.email || '', readOnly: true })}
                {fields('Location', { name: 'location', defaultValue: user?.location || '', placeholder: 'Town or district' })}
              </div>

              {saveError && (
                <p className="form-error" role="alert">
                  {saveError}
                </p>
              )}

              <div className="profile-save">
                <button className="btn btn-primary" type="submit">
                  {saved ? 'Changes saved ✓' : 'Save changes'}
                </button>
              </div>
            </div>
          </form>

          <div className="logout-card">
            <div>
              <h3>Ready to leave?</h3>
              <p>You can log back in anytime with this demo account.</p>
            </div>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </Shell>
    </ProtectedRoute>
  );
}

export function About() {
  return (
    <Shell>
      <section className="about-hero">
        <span className="eyebrow">ABOUT AGRICARE</span>
        <h1>
          Growing well starts with <em>good information.</em>
        </h1>
        <p>AgriCare brings crop recommendations, plant health guidance and practical care tips together in one simple platform.</p>
        <div className="about-hero-leaves">🌿 🌾 🌱</div>
      </section>

      <section className="section about-body">
        <div className="about-copy">
          <span className="eyebrow">OUR PURPOSE</span>
          <h2>Helpful guidance, within reach.</h2>
          <p>
            Small-scale farmers and home gardeners make important decisions every day. Which crops are suited to their
            soil and season? What does a discolored leaf mean? How much water does a young plant need?
          </p>
          <p>
            AgriCare is designed to make exploring those questions feel less complicated. It combines crop
            recommendation, plant disease detection and everyday crop-care guidance in one welcoming place.
          </p>
          <p>
            AgriCare combines farmer-entered conditions, live weather when available, and sourced reference guidance.
            District-specific agronomic details remain limited and are identified on crop pages.
          </p>
        </div>

        <div className="about-values">
          <div>
            <span>
              <Sprout />
            </span>
            <h3>Practical first</h3>
            <p>Advice that’s clear enough to put into action.</p>
          </div>
          <div>
            <span>
              <HeartHandshake />
            </span>
            <h3>Made for everyone</h3>
            <p>Friendly guidance for farms and gardens of every size.</p>
          </div>
          <div>
            <span>
              <Globe2 />
            </span>
            <h3>Growing together</h3>
            <p>Built to make growing guidance easier to access.</p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Let’s grow something good.</h2>
        <p>Start with your crop conditions or take a closer look at a plant.</p>
        <div>
          <Button to="/recommend">
            Plan my crop <ArrowRight size={17} />
          </Button>
          <Button to="/disease" variant="outline">
            Check plant health
          </Button>
        </div>
      </section>
    </Shell>
  );
}
