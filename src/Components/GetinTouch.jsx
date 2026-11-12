import React from 'react'
import {
    Phone,
    Mail,
    MessageCircle,
    Clock3,
    CalendarDays,
    Zap,
    BadgeIndianRupee,
    UserRoundPlus,
    Headphones
} from "lucide-react";


export default function GetinTouch() {
    return (
        <section
            style={{
                background: "f8f2e2",
                padding: "75px 24px",
                fontFamily: "'DM Sans', sans-serif",
            }}
            className="GetInTouchParent"
        >
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "50px",
                }}
            >
                {/* LEFT SIDE */}
                <div style={{ flex: "1 1 360px", minWidth: 0 }}>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "40px",
                            color: "#071B30",
                            marginBottom: "12px",
                        }}
                    >
                        Get in Touch
                    </h2>

                    <h3
                        style={{
                            fontSize: "24px",
                            color: "#071B30",
                            marginBottom: "16px",
                        }}
                    >
                        Ready to Buy?
                    </h3>

                    <p
                        style={{
                            color: "#394655",
                            fontSize: "18px",
                            lineHeight: "1.8",
                            maxWidth: "450px",
                        }}
                    >
                        Discover top-quality Digital Devotional products and enjoy
                        effortless shopping.
                    </p>

                    {/* FEATURES */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "24px",
                            marginTop: "24px",
                            marginBottom: "28px",
                        }}
                    >
                        {[
                            { Icon: Zap, text: "Quick Response" },
                            { Icon: BadgeIndianRupee, text: "Transparent Pricing" },
                        ].map(({ Icon, text }) => (
                            <div
                                key={text}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    color: "#071B30",
                                    fontSize: "15px",
                                }}
                            >
                                <span
                                    style={{
                                        display: "grid",
                                        placeItems: "center",
                                        width: "34px",
                                        height: "34px",
                                        borderRadius: "50%",
                                        background: "#FFF4DE",
                                        color: "#B88732",
                                    }}
                                >
                                    <Icon size={18} />
                                </span>
                                {text}
                            </div>
                        ))}
                    </div>

                    {/* BUTTONS */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "14px",
                        }}
                    >
                        <a
                            href="/register"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "13px 24px",
                                background: "#071B30",
                                color: "#FFFDF9",
                                borderRadius: "30px",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: 700,
                            }}
                        >
                            <UserRoundPlus size={18} />
                            Create Account
                        </a>

                        <a
                            href="/contact"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "13px 24px",
                                background: "#FFFDF9",
                                color: "#071B30",
                                border: "1px solid #E9AD43",
                                borderRadius: "30px",
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: 700,
                            }}
                        >
                            <Headphones size={18} />
                            Contact
                        </a>
                    </div>
                </div>

                {/* RIGHT SIDE CONTACT CARD */}
                <div
                    style={{
                        flex: "1 1 360px",
                        minWidth: 0,
                        maxWidth: "470px",
                        background: "#FFFDF9",
                        border: "1px solid #E5DED2",
                        borderRadius: "18px",
                        padding: "32px",
                        boxShadow: "0 12px 35px rgba(7,27,48,0.08)",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "21px",
                            color: "#071B30",
                            marginBottom: "10px",
                        }}
                    >
                        Get in Touch
                    </h3>

                    <div
                        style={{
                            width: "75px",
                            height: "2px",
                            background: "#E9AD43",
                            marginBottom: "26px",
                        }}
                    />

                    {[
                        {
                            Icon: Phone,
                            title: "Call Us:",
                            value: "+91 8788103520",
                            link: "tel:+918788103520",
                        },
                        {
                            Icon: Mail,
                            title: "Email Us:",
                            value: "sksdreamrk@gmail.com",
                            link: "mailto:sksdreamrk@gmail.com",
                        },
                        {
                            Icon: MessageCircle,
                            title: "WhatsApp:",
                            value: "+91 8788103520",
                            link: "https://wa.me/918788103520",
                        },
                        {
                            Icon: Clock3,
                            title: "Response Time:",
                            value: "Within 24 hours",
                        },
                        {
                            Icon: CalendarDays,
                            title: "Availability:",
                            value: "Monday – Friday, 9 AM – 6 PM EST",
                        },
                    ].map(({ Icon, title, value, link }) => (
                        <div
                            key={title}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                marginBottom: "22px",
                            }}
                        >
                            <span
                                style={{
                                    display: "grid",
                                    placeItems: "center",
                                    width: "42px",
                                    height: "42px",
                                    flexShrink: 0,
                                    borderRadius: "50%",
                                    background: "#F8F2E8",
                                    color: "#B88732",
                                }}
                            >
                                <Icon size={20} />
                            </span>

                            <div style={{ minWidth: 0 }}>
                                <strong
                                    style={{
                                        display: "block",
                                        color: "#071B30",
                                        fontSize: "14px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    {title}
                                </strong>

                                {link ? (
                                    <a
                                        href={link}
                                        target={link.startsWith("https") ? "_blank" : undefined}
                                        rel={link.startsWith("https") ? "noopener noreferrer" : undefined}
                                        style={{
                                            color: "#B88732",
                                            textDecoration: "none",
                                            fontSize: "14px",
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {value}
                                    </a>
                                ) : (
                                    <span style={{ color: "#394655", fontSize: "14px" }}>
                                        {value}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


