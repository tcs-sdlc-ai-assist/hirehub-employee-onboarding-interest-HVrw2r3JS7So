import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card" style={{
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 4px rgba(42,110,234,0.06)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '1rem',
      minHeight: '220px'
    }}>
      <div style={{
        fontSize: '2.5rem',
        color: 'var(--color-primary)',
        marginBottom: '0.5rem'
      }}>
        {icon}
      </div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ color: 'var(--color-text-light)', margin: 0 }}>{description}</p>
    </div>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default function LandingPage() {
  const navigate = useNavigate();

  function handleApplyClick(e) {
    e.preventDefault();
    navigate('/apply');
  }

  return (
    <main>
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2.5rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: 'var(--color-primary)',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          Welcome to HireHub
        </h1>
        <p style={{
          fontSize: '1.25rem',
          maxWidth: '600px',
          textAlign: 'center',
          color: 'var(--color-text-light)',
          marginBottom: '1.5rem'
        }}>
          Your gateway to exciting opportunities. Join our onboarding portal and take the next step in your career journey.
        </p>
        <button type="button" onClick={handleApplyClick} style={{
          fontSize: '1.15rem',
          padding: '0.9em 2em',
          borderRadius: '8px',
          background: 'var(--color-accent)',
          color: '#222b45',
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(255,180,0,0.08)',
          marginBottom: '0.5rem'
        }}>
          Apply Now
        </button>
      </section>
      <section>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'var(--color-text)'
        }}>
          Why Join Us?
        </h2>
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto 2.5rem auto'
        }}>
          <FeatureCard
            icon={<span role="img" aria-label="Growth">🚀</span>}
            title="Accelerate Your Growth"
            description="Access tailored onboarding, mentorship, and resources to help you thrive from day one."
          />
          <FeatureCard
            icon={<span role="img" aria-label="Community">🤝</span>}
            title="Vibrant Community"
            description="Join a diverse network of professionals, share knowledge, and grow together."
          />
          <FeatureCard
            icon={<span role="img" aria-label="Opportunities">🌟</span>}
            title="Exciting Opportunities"
            description="Be the first to know about new roles, projects, and internal mobility options."
          />
          <FeatureCard
            icon={<span role="img" aria-label="Support">💡</span>}
            title="Continuous Support"
            description="Our team is here to guide you through every step of your onboarding journey."
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button type="button" onClick={handleApplyClick}>
            Start Your Application
          </button>
          <button
            type="button"
            onClick={handleApplyClick}
            style={{
              background: 'var(--color-success)',
              color: '#fff'
            }}
          >
            Join Now
          </button>
        </div>
      </section>
      <style>
        {`
          @media (max-width: 900px) {
            .features-grid {
              grid-template-columns: 1fr;
              gap: 1.25rem;
            }
          }
          .feature-card h3 {
            font-size: 1.25rem;
            font-weight: 700;
          }
        `}
      </style>
    </main>
  );
}