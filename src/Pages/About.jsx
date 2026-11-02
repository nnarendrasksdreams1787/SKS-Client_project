import React from "react";
import "../CSS/About.css";
import ShlokaCarousel from "./ShlokaCarousel";
import kanha from "../assets/Theme/divine-krishan.webp"
import Header from "../Components/Header";
import {
  ShoppingBag,
  UserRoundPlus,
  PackageCheck,
  Gift,
  BookOpen,
  UsersRound,
  ShieldCheck,
} from "lucide-react";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom"

// src\assets\Theme\divine-krishan.webp

// import text_divider from "../assets/Theme/text-divider.png"


const About = () => {
  return (
    <>
      <Header />
      <main className="about-page">
        {/* Page Banner */}
        <section className="about-banner">
          <div className="about-container">
            <p className="about-eyebrow">SKS DREAM</p>
            <h1>About Us</h1>
            <div className="about-breadcrumb">
              <Link to='/'>Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span>About Us</span>
            </div>
          </div>
        </section>

        <ShlokaCarousel />

        {/* <section>
          <img src={text_divider} alt="text divider" />
        </section> */}

        {/* Krishna Image and Existing Story */}
        <section className="about-story-section">
          <div className="about-container">
            <div className="about-story-grid">
              <div className="about-krishna-image">
                {/*
                Replace this path with the existing Krishna image
                filename from your project's assets folder.
              */}
                <img src={kanha} alt="Krishna" />
                <div className="image-gold-frame" />
              </div>

              <div className="about-story-content">
                <span className="about-section-label">ABOUT SKS DREAM</span>




                <div className="original-story-content">
                  {/* Original story heading */}
                  {/* Original story paragraph(s) */}
                  {/* Lord Shri Krishna dreamed of a universe rooted in Dharma, where truth overcomes injustice and wisdom guides power. He envisioned humanity living in harmony with nature, free from greed, ego, and fear, performing their duties selflessly without attachment to outcomes. His dream was that every individual realizes their true self beyond the body, lives with compassion and love, respects equality, and attains inner peace through righteous action and devotion.
                  When Dharma declines, He appears not to destroy the world, but to awaken conscience, restore balance, and lead humanity toward freedom, harmony, and lasting peace. Lord Shri Krishna envisioned a world where Dharma guides every action—spiritual and professional alike.
                  He taught that work done with honesty, faith, and selfless intention becomes sacred, whether in life or in business. In Krishna’s way, success is not driven by greed but by responsibility, trust, and righteous conduct, where results are offered to a higher purpose.
                  He dreamed of individuals who act with integrity, respect commitments, serve society through their work, and remain fearless and peaceful in both profit and loss. When work is aligned with truth, devotion, and duty, it creates not just prosperity, but harmony, dignity, and lasting value for the world. */}

                  भगवान् श्रीकृष्णः धर्ममूलकस्य ब्रह्माण्डस्य स्वप्नमपश्यत्, यत्र सत्यम् अन्यायम् अभिभवति, प्रज्ञा च शक्तिं मार्गदर्शयति। सः ऐच्छत् यत् मानवाः प्रकृत्या सह सामञ्जस्येन जीवेयुः, लोभ-अहङ्कार-भयेभ्यः मुक्ताः सन्तः, फलासक्तिं विना निष्कामभावेन स्वकर्तव्यानि आचरेयुः। तस्य स्वप्नः आसीत् यत् प्रत्येकं जनः शरीरात् परं स्वस्य वास्तविकमात्मानं जानीयात्, दयया स्नेहेन च जीवेत्, समतां सम्मानयेत्, तथा च धर्म्याचरणेन भक्त्या च आन्तरिकशान्तिं प्राप्नुयात्।

                  यदा धर्मस्य ग्लानिः भवति, तदा सः जगतः विनाशाय न, अपितु अन्तरात्मनः प्रबोधनाय, संतुलनस्य पुनर्स्थापनाय, मानवानां च मुक्तेः, सामञ्जस्यस्य, शाश्वतशान्तेः च मार्गं प्रति नयनाय सम्भवति। भगवान् श्रीकृष्णः एतादृशस्य जगतः परिकल्पनाम् अकरोत् यत्र धर्मः सर्वकर्माणि—आध्यात्मिकानि व्यावसायिकानि च—मार्गदर्शयेत्। सः अशिक्षयत् यत् सत्यनिष्ठया, श्रद्धया, निष्कामभावेन च कृतं कार्यं पूतं भवति, चाहे तत् जीवने वा व्यापारे वा स्यात्।

                  कृष्णस्य मार्गे सिद्धिः लोभेन न, अपितु उत्तरदायित्वेन, विश्वासेन, धर्म्याचरणेन च सञ्चालिता भवति, यत्र फलानि उच्चतरोद्देश्याय अर्प्यन्ते। सः एतादृशानां जनानां स्वप्नमपश्यत् ये निष्ठावन्तः भूत्वा कार्यं कुर्वन्ति, प्रतिश्रुतिः सम्मानयन्ति, स्वकार्येण समाजस्य सेवां कुर्वन्ति, लाभहान्योः उभयोः निर्भयाः शान्ताश्च तिष्ठन्ति। यदा कार्यं सत्येन, भक्त्या, कर्तव्येन च सह सङ्गतं भवति, तदा तत् केवलं समृद्धिमेव न, अपितु जगते सामञ्जस्यं, प्रतिष्ठां, शाश्वतमूल्यं च सृजति।
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}

        <section className="about-who-section">
          <div className="about-container">
            <div className="about-who-heading">
              <span className="about-section-label">
                GET TO KNOW US
              </span>

              <h2>Who We Are</h2>

              <p>
                At Sks Dream, we believe in building a community-driven-platform.. <br /> our
                system allows admins to launch degital products, users to discover and
                purchase quality digital devotional products, and everyone to enjoy a
                seamless shopping experience.when someone shops on our platform, they
                get access to top-quality devotional digital products, exclusive offers
                and a smooth reliable purchase process. join thousands of satisfied
                customers enjoying everyday shopping with confidence and value.
              </p>
            </div>

            <div className="about-features">
              <article className="about-feature-card">
                {/* <div className="feature-icon">✦</div> */}
                <div className="feature-icon"><Gift size={24} /></div>
                <h3>Exclusive Offers &amp; Deals</h3>
              </article>

              <article className="about-feature-card">
                {/* <div className="feature-icon">◇</div> */}
                <div className="feature-icon"><BookOpen size={24} /></div>
                <h3>
                  Purchase High-Quality Devotional Digital Products
                </h3>
              </article>

              <article className="about-feature-card">
                {/* <div className="feature-icon">♧</div> */}
                <div className="feature-icon"><UsersRound size={24} /></div>
                <h3>Community-Driven Platform</h3>
              </article>

              <article className="about-feature-card">
                {/* <div className="feature-icon">♡</div> */}
                <div className="feature-icon"><ShieldCheck size={24} /></div>
                <h3>A Divine &amp; Trusted Shopping Experience</h3>
              </article>
            </div>
          </div>
        </section>


        {/* <div className="how-it-works-flow">
        <article className="process-card">
        <div className="process-icon">
            <i className="fa-solid fa-bag-shopping" />
            </div>
          <span className="process-step">STEP 01</span>
          <h3>Select Devotional Products</h3>
          <p>
          Browse our wide range of top-quality spiritual
          products and effortlessly choose your favorites.
          </p>
          </article>
          
          <div className="process-arrow" aria-hidden="true">
          <span>→</span>
          </div>

        <article className="process-card">
          <div className="process-icon">
          <i className="fa-solid fa-user-plus" />
          </div>
          <span className="process-step">STEP 02</span>
          <h3>Create an Account</h3>
          <p>
            Sign up to enjoy devotion-inspired shopping
            and save your spiritual preferences.
            </p>
        </article>
        
        <div className="process-arrow" aria-hidden="true">
          <span>→</span>
        </div>
        
        <article className="process-card">
          <div className="process-icon">
            <i className="fa-solid fa-box-open" />
            </div>
            <span className="process-step">STEP 03</span>
            <h3>Place Your Order</h3>
          <p>
          Buy the devotional products you love with a secure
          checkout and enjoy a smooth shopping journey.
          </p>
          </article>
          </div> */}


        {/* How SKS Dream Works */}
        <section className="how-it-works-section">
          <div className="about-container">

            {/* Section Heading */}
            <div className="how-it-works-heading">
              <span className="about-section-label">
                SIMPLE. MEANINGFUL. SEAMLESS.
              </span>

              <h2>How SKS Dream Works</h2>

              <p>
                A seamless shopping experience in three simple steps
              </p>

              <span className="how-it-works-divider" />
            </div>

            {/* Three Steps with Connecting Arrows */}
            <div className="how-it-works-flow">

              <article className="process-card">
                <div className="process-icon">
                  {/* <i className="fa-solid fa-bag-shopping" /> */}
                  <ShoppingBag size={24} color="#E9AD43" />
                </div>

                <span className="process-step">STEP 01</span>

                <h3>Select Devotional Products</h3>

                <p>
                  Browse our wide range of top-quality spiritual
                  products and effortlessly choose your favorites.
                </p>
              </article>

              <div className="process-arrow" aria-hidden="true">
                <span>→</span>
              </div>

              <article className="process-card">
                <div className="process-icon">
                  {/* <i className="fa-solid fa-user-plus" /> */}
                  <UserRoundPlus size={24} color="#E9AD43" />
                </div>

                <span className="process-step">STEP 02</span>

                <h3>Create an Account</h3>

                <p>
                  Sign up to enjoy devotion-inspired shopping
                  and save your spiritual preferences.
                </p>
              </article>

              <div className="process-arrow" aria-hidden="true">
                <span>→</span>
              </div>

              <article className="process-card">
                <div className="process-icon">
                  {/* <i className="fa-solid fa-box-open" /> */}
                  <PackageCheck size={24} color="#E9AD43" />
                </div>

                <span className="process-step">STEP 03</span>

                <h3>Place Your Order</h3>

                <p>
                  Buy the devotional products you love with a secure
                  checkout and enjoy a smooth shopping journey.
                </p>
              </article>

            </div>

            {/* Bottom Closing Message */}
            <div className="how-it-works-bottom">
              <span className="bottom-accent" />
              <p>
                At SKS Dream, shopping is designed to be simple,
                premium, and enjoyable — from discovering Devotional
                quality products to a smooth checkout experience.
              </p>
            </div>

          </div>
        </section>



      </main>
      <Footer />
    </>
  );
};

export default About;
