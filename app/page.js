"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("in");
  const timers = useRef([]);

  const svcScrollerRef = useRef(null);
  const dragRef = useRef({ down: false, startX: 0, startLeft: 0, pid: null });
  const [svcActive, setSvcActive] = useState(1);

  const slides = useMemo(
    () => [
      {
        img: "/2.png",
        kicker: "LEAVE COURT TO US",
        titlePrefix: "A law firm with a ",
        cursive: "passion",
        titleSuffix: " for success",
        desc:
          "Experienced attorneys. Clear strategy. Strong representation with a modern, premium approach.",
        primary: "Recent Work",
        secondary: "Contact Us",
      },
      {
        img: "/1.png",
        kicker: "TRUST. CLARITY. RESULTS.",
        titlePrefix: "Your case deserves ",
        cursive: "precision",
        titleSuffix: " and power",
        desc:
          "Transparent guidance, sharp documentation, and courtroom-ready preparation from day one.",
        primary: "Our Services",
        secondary: "Book a Call",
      },
    ],
    []
  );

  const services = useMemo(
    () => [
      {
        variant: "light",
        img: "/1.1.png",
        title: "Legal Professional Law",
        desc: "Where Law Meets Integrity and Excellence.",
      },
      {
        variant: "dark",
        img: "/2.2.png",
        title: "Family & Civil Matters",
        desc: "Dedicated legal support for family disputes, property matters, and civil cases.",
        badge: "DRAG",
      },
      {
        variant: "dark",
        img: "/3.3.png",
        title: "Competition and Antitrust",
        desc: "Defending your business interests through expert guidance in competition and antitrust regulations.",
      },
      {
        variant: "light",
        img: "/4.4.png",
        title: "Corporate Documentation",
        desc: "Comprehensive drafting and review of corporate documents to ensure legal compliance and operational clarity.",
      },
      {
        variant: "dark",
        img: "/5.5.png",
        title: "Criminal Defense Support",
        desc: "Comprehensive criminal defense support, delivering strong advocacy and meticulous case preparation.",
      },
    ],
    []
  );

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const clearAll = () => {
      timers.current.forEach((x) => clearTimeout(x));
      timers.current = [];
    };

    clearAll();

    const inMs = 1200;
    const holdMs = 2600;
    const outMs = 900;

    setPhase("in");

    timers.current.push(
      setTimeout(() => {
        setPhase("out");
      }, inMs + holdMs)
    );

    timers.current.push(
      setTimeout(() => {
        setIdx((v) => (v + 1) % slides.length);
        setPhase("in");
      }, inMs + holdMs + outMs)
    );

    return clearAll;
  }, [idx, slides.length]);

  useEffect(() => {
    const el = svcScrollerRef.current;
    if (!el) return;

    const update = () => {
      const firstCard = el.querySelector(".svc2Card");
      if (!firstCard) return;

      const styles = window.getComputedStyle(el);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

      const cardW = firstCard.getBoundingClientRect().width;
      const step = cardW + gap;

      const i = Math.round(el.scrollLeft / step) + 1;
      const clamped = Math.max(1, Math.min(services.length, i));
      setSvcActive(clamped);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [services.length]);

  const onSvcPointerDown = (e) => {
    const scroller = svcScrollerRef.current;
    if (!scroller) return;

    dragRef.current.down = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startLeft = scroller.scrollLeft;
    dragRef.current.pid = e.pointerId;

    try {
      scroller.setPointerCapture(e.pointerId);
    } catch { }

    scroller.classList.add("isDragging");
  };

  const onSvcPointerMove = (e) => {
    const scroller = svcScrollerRef.current;
    if (!scroller) return;
    if (!dragRef.current.down) return;

    const dx = e.clientX - dragRef.current.startX;
    scroller.scrollLeft = dragRef.current.startLeft - dx;
  };

  const endSvcDrag = () => {
    const scroller = svcScrollerRef.current;
    dragRef.current.down = false;
    dragRef.current.pid = null;
    if (scroller) scroller.classList.remove("isDragging");
  };

  const s = slides[idx];

  return (
    <>
      <main className={`page ${loaded ? "loaded" : ""}`}>
        <section className="hero">
          <div className="heroBg" />
          <div className="heroOverlay" />

          <header className="nav">
            <div className="navLeft">
              <a className="brand" href="#">
                <span className="brandMark">
                  <img src="/logo-1.png" alt="logo" />
                </span>
                <span className="brandText">Vanguard</span>
              </a>

              <nav className="navLinks">
                <a href="#">Home</a>
                <a href="#">Service</a>
                <a href="#">Blog</a>
                <a href="#">Contact Us</a>
              </nav>
            </div>

            <div className="navRight">
              <button className="iconBtn" aria-label="Search">
                <FiSearch className="navIcon" />
              </button>

              <button className="iconBtn cartBtn" aria-label="Cart">
                <HiOutlineShoppingBag className="navIcon" />
                <span className="cartBadge">0</span>
              </button>

              <button className="ctaBtn">
                <span className="ctaText">Recent Work</span>
                <span className="ctaArrow">→</span>
              </button>
            </div>
          </header>

          <div className="heroSlides">
            <div className={`heroSlide isActive phase-${phase}`} key={`${idx}-${phase}`}>
              <div className="heroContent">
                <div className="heroLeft">
                  <img className="heroStatue" src={s.img} alt="Justice statue" draggable="false" />
                </div>

                <div className="heroRight">
                  <div className="heroKicker">{s.kicker}</div>

                  <h1 className="heroTitle">
                    {s.titlePrefix}
                    <span className="cursive">{s.cursive}</span>
                    {s.titleSuffix}
                  </h1>

                  <p className="heroDesc">{s.desc}</p>

                  <div className="heroActions">
                    <button className="primaryBtn">
                      <span>{s.primary}</span>
                      <span className="btnArrowBox">→</span>
                    </button>

                    <button className="outlineBtn">
                      <span>{s.secondary}</span>
                      <span className="btnArrowBox">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vTimeline">
          <div className="vTimelineHead">
            <h2 className="vTimelineTitle">
              A Passion For Justice. The <br />
              Experience For Win.
            </h2>
            <span className="vTimelineUnderline" />
          </div>

          <div className="vTimelineTrackWrap">
            <div className="vTimelineTrack" />
            <div className="vTimelineGrid">
              <div className="vTItem top">
                <h4>JUNE 2015</h4>
                <p>dummy dummy dummy dummy dummy dummy.</p>
              </div>
              <div className="vTItem bottom">
                <h4>JUNE 2017</h4>
                <p>dummy dummy dummy dummy dummy dummy.</p>
              </div>
              <div className="vTItem top">
                <h4>JUNE 2019</h4>
                <p>dummy dummy dummy dummy dummy dummy.</p>
              </div>
              <div className="vTItem bottom active">
                <h4>AUG 2020</h4>
                <p>dummy dummy dummy dummy dummy dummy.</p>
              </div>
              <div className="vTItem top">
                <h4>SEP 2021</h4>
                <p>dummy dummy dummy dummy dummy dummy.</p>
              </div>
              <div className="vTItem bottom">
                <h4>DEC 2022</h4>
                <p>dummy dummy dummy dummy dummy dummy.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="aboutSplit">
          <div className="aboutInner">
            <div className="aboutLeft">
              <h2 className="aboutTitle">
                We are the Leading <br />
                Law Firm for Annual <br />
                Revenues
              </h2>
              <span className="aboutUnderline" />

              <div className="aboutRotator">
                <img className="aboutTiltImg" src="/pillar.png" alt="building" />
              </div>
            </div>

            <div className="aboutRight">
              <div className="aboutCard">
                <img className="aboutPortrait" src="/woman.png" alt="lawyer" />
                <p className="aboutText">
                  At Powerlegal Law Firm, we have designed a community of legal service providers who are
                  passionate about providing exceptional legal services.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="svc2">
          <div className="svc2Head">
            <div className="svc2HeadLeft">
              <h2 className="svc2Title">
                We are Provided Especially <br />
                Skilled Services to you.
              </h2>
              <span className="svc2Underline" />
            </div>

            <div className="svc2Count">
              {svcActive}/{services.length}
            </div>
          </div>

          <div
            ref={svcScrollerRef}
            className="svc2Scroller"
            onPointerDown={onSvcPointerDown}
            onPointerMove={onSvcPointerMove}
            onPointerUp={endSvcDrag}
            onPointerCancel={endSvcDrag}
            onPointerLeave={endSvcDrag}
          >
            {services.map((x, i) => (
              <article className={`svc2Card ${x.variant === "light" ? "isLight" : "isDark"}`} key={i}>
                <div className="svc2ImgWrap">
                  <img className="svc2Img" src={x.img} alt={x.title} />
                  {x.badge ? <div className="svc2DragBadge">{x.badge}</div> : null}
                </div>

                <div className="svc2Body">
                  <h3 className="svc2H3">{x.title}</h3>
                  <p className="svc2P">{x.desc}</p>
                  <button className="svc2ArrowBtn" aria-label="Open">
                    →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="sig">
          <div className="sigInner">
            <div className="sigGlow" />

            <p className="sigQuote">
              “We Approach Experts To Great Value For Your Business And Best Solutions For
              Developing Business”
            </p>

            <div className="sigRow">
              <img className="sigImg" src="/sig2.png" alt="Signature" />

              <div className="sigDivider" />

              <div className="sigMeta">
                <div className="sigName">Jason Mathew</div>
                <div className="sigRole">CEO of Vanguard Group</div>
              </div>
            </div>
          </div>
        </section>
        <section className="freshBlogs">
          <div className="freshBlogsInner">
            <div className="freshBlogsHead">
              <div>
                <h2 className="freshBlogsTitle">Our Fresh Blogs</h2>
                <span className="freshBlogsUnderline" />
              </div>

              <a className="freshBlogsAll" href="#">
                <span>View All Blog</span>
                <span className="freshBlogsAllIcon">→</span>
              </a>
            </div>

            <div className="freshBlogsList">
              <a className="freshBlogRow" href="#">
                <div className="freshBlogDate">MAY 2022</div>
                <div className="freshBlogMain">
                  <div className="freshBlogTitle">Divorce in the UK today</div>
                  <div className="freshBlogMeta">CHILD LAW &nbsp;–&nbsp; 3 COMMENTS</div>
                </div>
              </a>

              <a className="freshBlogRow" href="#">
                <div className="freshBlogDate">APR 2022</div>
                <div className="freshBlogMain">
                  <div className="freshBlogTitle">Week family law Domestic</div>
                  <div className="freshBlogMeta">FAMILY LAW &nbsp;–&nbsp; 3 COMMENTS</div>
                </div>
              </a>

              <a className="freshBlogRow" href="#">
                <div className="freshBlogDate">APR 2022</div>
                <div className="freshBlogMain">
                  <div className="freshBlogTitle">Flexibility of marriage in US</div>
                  <div className="freshBlogMeta">CRIMINAL LAW &nbsp;–&nbsp; 3 COMMENTS</div>
                </div>
              </a>
            </div>
          </div>
        </section>
        <section className="svcGrid">
          <div className="svcGridInner">
            <div className="svcGridTop">
              <div className="svcGridLeft">
                <h2 className="svcGridTitle">Advice on a Full Range of Family Law Matters</h2>
                <span className="svcGridUnderline" />
              </div>

              <div className="svcGridRight">
                <p>
                  For most of our clients, we meet them when the worst thing that ever could happen to them has happened.
                </p>
                <p>
                  We know that they want more than an attorney. They want someone who will listen attentively.
                </p>

                <a className="svcGridBtn" href="#">
                  <span>All Service</span>
                  <span className="svcGridBtnIcon">→</span>
                </a>
              </div>
            </div>

            <div className="svcGridCards">
              <a className="svcMini" href="#">
                <div className="svcMiniIcon">
                  <img src="/ham.png" alt="" />
                </div>
                <div className="svcMiniK">CIVIL</div>
                <div className="svcMiniT">Competition and Antitrust</div>
                <div className="svcMiniArrow">→</div>
              </a>

              <a className="svcMini" href="#">
                <div className="svcMiniIcon">
                  <img src="/ham.png" alt="" />
                </div>
                <div className="svcMiniK">FINANCIAL</div>
                <div className="svcMiniT">Real Estate Law Firms</div>
                <div className="svcMiniArrow">→</div>
              </a>

              <a className="svcMini" href="#">
                <div className="svcMiniIcon">
                  <img src="/ham.png" alt="" />
                </div>
                <div className="svcMiniK">BUSINESS</div>
                <div className="svcMiniT">International Law &amp; Justice</div>
                <div className="svcMiniArrow">→</div>
              </a>

              <a className="svcMini" href="#">
                <div className="svcMiniIcon">
                  <img src="/ham.png" alt="" />
                </div>
                <div className="svcMiniK">CRIMINAL</div>
                <div className="svcMiniT">Marriage Contract in Law</div>
                <div className="svcMiniArrow">→</div>
              </a>
            </div>
          </div>
        </section>
        <footer className="vFooter">
          <div className="vFooterInner">
            <div className="vFooterTop">
              <div className="vFooterBrand">
                <div className="vFooterLogoRow">
                  <img className="vFooterLogo" src="/logo-1.png" alt="logo" />
                  <span className="vFooterBrandText">Vanguard</span>
                </div>
              </div>

              <div className="vFooterCols">
                <div className="vFooterCol">
                  <div className="vFooterColTitle">Discover</div>
                  <a href="#">Coaching</a>
                  <a href="#">Courses</a>
                  <a href="#">Client Stories</a>
                  <a href="#">Contact Us</a>
                </div>

                <div className="vFooterCol">
                  <div className="vFooterColTitle">Support</div>
                  <a href="#">Consulting</a>
                  <a href="#">About Us</a>
                  <a href="#">Blog</a>
                </div>

                <div className="vFooterCol">
                  <div className="vFooterColTitle">Contact</div>
                  <a href="mailto:contact@pbminfotech.com">info@logisol.tech</a>
                  <a href="tel:+18774850700">(415) 969-4133</a>
                  <div className="vFooterSocial">
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                    <a href="#">Linkedin</a>
                  </div>
                </div>
              </div>

              <div className="vFooterNewsletter">
                <div className="vFooterNewsTitle">STOP INFORMING. START INSPIRING.</div>
                <div className="vFooterNewsSub">Let’s Stay in Touch</div>

                <form className="vFooterForm" onSubmit={(e) => e.preventDefault()}>
                  <input className="vFooterInput" type="email" placeholder="Enter your Email" />
                  <button className="vFooterSend" type="submit" aria-label="Submit">
                    →
                  </button>
                </form>
              </div>
            </div>

            <div className="vFooterDivider" />

            <div className="vFooterBottom">
              <div className="vFooterCopy">Copyright ©logisol.tech, All Rights Reserved.</div>

              <div className="vFooterLinks">
                <a href="#">Services</a>
                <span className="vFooterDot">|</span>
                <a href="#">Faq</a>
                <span className="vFooterDot">|</span>
                <a href="#">Careers</a>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
