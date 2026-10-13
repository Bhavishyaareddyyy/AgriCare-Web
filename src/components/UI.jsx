
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, LoaderCircle } from 'lucide-react';
import { cropVisuals } from '../data/cropData.js';

export function Logo({ light = false }) {
  return (
    <Link
      className={`brand ${light ? 'brand-light' : ''}`}
      to="/"
      aria-label="AgriCare home"
    >
      <span className="brand-mark">
        <Leaf size={19} strokeWidth={2.3} />
      </span>
      <span>AgriCare</span>
    </Link>
  );
}

export function Button({
  children,
  to,
  variant = 'primary',
  className = '',
  ...props
}) {
  const cls = `btn btn-${variant} ${className}`;

  return to ? (
    <Link className={cls} to={to} {...props}>
      {children}
    </Link>
  ) : (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
}) {
  return (
    <div className={`section-title ${center ? 'center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  text,
  tint = 'green',
}) {
  return (
    <article className="feature-card">
      <div className={`feature-icon ${tint}`}>
        <Icon size={22} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="feature-arrow" aria-hidden="true">
        <ArrowRight size={17} />
      </span>
    </article>
  );
}

export function CropVisual({ cropId, className = '' }) {
  const visual = cropVisuals[cropId] || cropVisuals.default;
  const [failedSrc, setFailedSrc] = useState(null);
  const photoFailed = !visual.src || failedSrc === visual.src;

  return photoFailed ? (
    <span
      className={`crop-visual-fallback photo-unavailable ${className}`}
      role="img"
      aria-label={`${visual.alt}; no crop photograph is currently available`}
    >
      <span aria-hidden="true">Photo unavailable</span>
    </span>
  ) : (
    <img
      className={`crop-photo-image ${className}`}
      src={visual.src}
      alt={visual.alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(visual.src)}
    />
  );
}

const cropEmojis = {
  rice: '🌾',
  maize: '🌽',
  corn: '🌽',
  'green gram': '🌱',
  'mung bean': '🌱',
  'green gram (mung bean)': '🌱',
  chickpea: '🫘',
  cotton: '🌿',
  tomato: '🍅',
  wheat: '🌾',
  sugarcane: '🎋',
  potato: '🥔',
  groundnut: '🥜',
  soybean: '🫘',
  millet: '🌾',
  sorghum: '🌾',
  default: '🌱',
};

export function CropCard({ crop, onSelect }) {
  const emoji =
    cropEmojis[crop.name?.toLowerCase()] ||
    cropEmojis[crop.id?.toLowerCase()] ||
    cropEmojis.default;

  const status = crop.suitabilityCategory || 'Model-ranked';

  const fitLabel =
    crop.comparisonStatus === 'model-ranked' &&
    Number.isFinite(crop.modelScore)
      ? `Rank ${crop.rank} · Model score ${crop.modelScore.toFixed(3)}`
      : crop.comparisonStatus === 'model-ranked' &&
          Number.isFinite(crop.modelVoteShare)
        ? `Rank ${crop.rank} · Raw tree vote share ${(crop.modelVoteShare * 100).toFixed(1)}%`
        : crop.comparisonStatus === 'model-ranked'
          ? `Stored model rank ${crop.rank}`
          : crop.comparisonStatus === 'matches-listed-conditions'
            ? 'Both listed conditions match'
            : crop.comparisonStatus === 'reference-mismatch'
              ? 'Some listed conditions differ'
              : 'Legacy comparison';

  return (
    <article className="crop-card crop-card-clean">
      <div
        className={`crop-emoji ${crop.color || 'sage'}`}
        aria-hidden="true"
      >
        <span className="crop-emoji-symbol">{emoji}</span>
      </div>

      <div className="crop-content">
        <div className="crop-heading">
          <h3>{crop.name}</h3>
          <strong>{status}</strong>
        </div>

        <span className="fit-label">{fitLabel}</span>

        <p>
          {crop.explanation ||
            crop.summary ||
            'Explore this crop’s growing requirements and care guidance.'}
        </p>

        <Button
          variant="outline"
          className="wide"
          onClick={() => onSelect(crop)}
        >
          View Details <ArrowRight size={16} />
        </Button>
      </div>
    </article>
  );
}

export function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="loading">
      <LoaderCircle className="spin" size={25} />
      <span>{label}</span>
    </div>
  );
}
