'use client'; 
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show-animation');
        } else {
          entry.target.classList.remove('show-animation');
        }
      });
    }, { threshold: 0.1 });

    const target = document.querySelector('.hero-image');
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="main-wrapper">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo-group">
            <img src="/logo cv.png" alt="Logo" className="logo-icon" />
            <div className="logo-text">
              <span className="text-black">CIVIC</span>
              <span className="text-green">NODE</span>
            </div>
          </div>
          <ul className="nav-menu">
            <li><a href="#hero">HOME</a></li>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#feature">FEATURE</a></li>
          </ul>
          <div className="nav-actions">
            {/* Tombol Login mengarah ke dashboard */}
            <Link href="/dashboard">
              <button className="btn-login">LOGIN</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HALAMAN 1: HERO --- */}
      <section className="hero-section" id="hero">
        <div className="hero-container">
          <img src="/anak anak.png" alt="Civic Node" className="hero-image" />
          <div className="hero-overlay">
            <h1>CIVIC NODE</h1>
            <p>“Guarding the Earth, One Node at a Time”</p>
          </div>
        </div>
      </section>

      {/* --- HALAMAN 2: ABOUT --- */}
      <section className="second-section" id="about">
        <div className="second-section-container">
          <div className="logo-picket-side">
            <img src="/papan logo.png" alt="Picket" className="picket-image" />
          </div>
          <div className="text-content-side">
            <h2 className="title-didot">
              WHAT’S ABOUT <span className="text-black-title">CIVIC</span> <span className="text-green-title">NODE</span> ?
            </h2>
            <div className="paper-container">
              <p className="description-text">
                CivicNode AI is a smart environmental surveillance platform powered by 
                Computer Vision and Blockchain, designed to address the waste 
                management crisis in public spaces. Driven by a Planetary Health 
                mission, this platform transforms conventional CCTV into an automated 
                and transparent instrument for public accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HALAMAN 3: KEY FEATURES --- */}
      <section className="third-section" id="feature">
        <img src="/speaker.png" alt="Speaker" className="speaker-image" />
        
        <div className="features-container">
          <h2 className="features-title">Key Features</h2>
          
          <div className="cards-wrapper">
            {/* Kartu fitur dengan efek hover timbul yang sama dengan log */}
            <div className="feature-card">
              <div className="card-image-box">
                <span className="placeholder-text">FEATURE 1</span>
              </div>
              <p className="card-label">SMART SNAPSHOT AI</p>
            </div>

            <div className="feature-card">
              <div className="card-image-box">
                <span className="placeholder-text">FEATURE 2</span>
              </div>
              <p className="card-label">HYBRID AUTHENTICATION</p>
            </div>

            <div className="feature-card">
              <div className="card-image-box">
                <span className="placeholder-text">FEATURE 3</span>
              </div>
              <p className="card-label">ANALYTIC DASHBOARD</p>
            </div>
          </div>

          <div className="cta-section">
            <div className="cta-text-wrapper">
              <img src="/tanda seru.png" alt="Exclamation Left" className="exclamation-icon left" />
              <h3 className="cta-text">Are you new comer?</h3>
              <img src="/tanda seru.png" alt="Exclamation Right" className="exclamation-icon right" />
            </div>
            
            <Link href="/dashboard">
              <button className="btn-try">Try it now</button>
            </Link>

            <div className="social-footer">
              <p>Media Sosial</p>
              <p>• Instagram: <span>@civicnode</span></p>
            </div>
          </div>
        </div>

        <footer className="mini-footer">
          <p>CIVIC <span className="text-green-footer">NODE</span> 2026</p>
        </footer>
      </section>

      {/* CSS internal agar Maria tidak perlu edit globals.css lagi */}
      <style dangerouslySetInnerHTML={{ __html: `
        .feature-card {
          transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          cursor: pointer;
        }
        .feature-card:hover {
          transform: scale(1.05); /* Efek timbul ke tengah */
        }
        .btn-login, .btn-try {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .btn-login:hover, .btn-try:hover {
          filter: brightness(1.1);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
      `}} />
    </div>
  );
}