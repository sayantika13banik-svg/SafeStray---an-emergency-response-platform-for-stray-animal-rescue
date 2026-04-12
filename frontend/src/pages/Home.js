import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/puppy.jpeg";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const box = boxRef.current;


    setTimeout(() => setVisible(true), 100);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (box) observer.observe(box);

    return () => {
      if (box) observer.unobserve(box);
    };
  }, []);

  return (
    <div className="page-wrapper">
      <div className="outer-container">


        <img src={heroImg} alt="animals" className="hero-image" />


        <div className="content-card">
          <div
            ref={boxRef}
            className={`inner-box ${visible ? "visible" : ""}`}
          >
            <h1>SafeStray</h1>
            <p className="subtitle">
              Emergency Animal Rescue Platform
            </p>

            <div className="button-row">
              <button className="btn" onClick={() => navigate("/report")}>
                 New Report
              </button>

              <button className="btn" onClick={() => navigate("/map")}>
                 Help Nearby
              </button>

              <button className="btn" onClick={() => navigate("/my-reports")}>
                 My Reports
              </button>
            </div>
          </div>
        </div>




        <div className="extra-section">
          <h2>About SafeStray</h2>
          <p>
            SafeStray is a platform designed to help injured and stray animals
            get immediate assistance. By connecting people with nearby rescuers
            and NGOs, we aim to reduce response time and save more lives.
          </p>
        </div>


        <div className="extra-section">
          <h2> How It Works</h2>
          <div className="steps">
            <div> Report a stray</div>
            <div> Location is captured</div>
            <div> Nearby helpers get alerted</div>
            <div> Animal gets rescued</div>
          </div>
        </div>

        <div className="extra-section">
          <h2> Our Aim</h2>
          <p>
            Our mission is to build a fast, reliable, and community-driven
            rescue network that ensures no stray animal is left without help.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Home;