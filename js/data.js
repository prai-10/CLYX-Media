/**
 * CLYX MEDIA - DATA STORE
 * Centralized case studies, leadership roster, and verified client testimonials
 */
const CLYX_DATA = {
  portfolio: [
    {
      id: "lumina-skin",
      title: "LUMINA SKINCARE",
      category: "beauty",
      categoryName: "Beauty & Wellness",
      deliverables: "Creator Whitelisting + Meta Ads Scale",
      heroImg: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
      results: { roas: "4.4X", revenue: "+265%", cpa: "-38%", reach: "4.2M" },
      summary: "Scaled a clean skincare startup from ₹8L/mo to ₹48L/mo in 90 days by pairing 18 dermatologist UGC hooks with creator whitelisting.",
      problem: "Traditional studio product ads were suffering from severe ad fatigue, driving CAC over ₹1,400 with diminishing returns on Meta.",
      strategy: "Recruited 12 micro-creators with hyper-engaged skin-enthusiast audiences. Whitelisted raw unboxing & 7-day before/after routines directly through creator ad accounts."
    },
    {
      id: "aethel-apparel",
      title: "AETHEL LUXURY STREETWEAR",
      category: "fashion",
      categoryName: "Fashion & Apparel",
      deliverables: "TikTok UGC + Influencer Seeding + CRO",
      heroImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
      results: { roas: "3.9X", revenue: "+310%", cpa: "-44%", reach: "6.8M" },
      summary: "Generated ₹1.2Cr in collection drops within 48 hours using viral streetwear transition reels and automated checkout countdowns.",
      problem: "High drop-off on product detail page and low organic engagement on new silhouette drops.",
      strategy: "Seeded 40 fashion tastemakers with unreleased archive jackets. Ran synchronized whitelisted teaser ads 72 hours prior to drop."
    },
    {
      id: "nutra-boost",
      title: "APEX PERFORMANCE NUTRITION",
      category: "food",
      categoryName: "Food & Supplements",
      deliverables: "Performance Ads + Sub-second Web Checkout",
      heroImg: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
      results: { roas: "3.6X", revenue: "+185%", cpa: "-29%", reach: "3.5M" },
      summary: "Transformed a sports electrolyte blend into a top-selling morning ritual product via fitness creator taste-tests.",
      problem: "Customers viewed electrolyte powders as medicinal rather than an everyday lifestyle necessity.",
      strategy: "Positioned the product as 'clean morning focus without the coffee crash' across CrossFit and running influencers."
    },
    {
      id: "volt-audio",
      title: "VOLT HI-FI AUDIO",
      category: "tech",
      categoryName: "Consumer Tech & Audio",
      deliverables: "High-Production 3D Ads + Whitelisting",
      heroImg: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
      results: { roas: "5.1X", revenue: "+420%", cpa: "-52%", reach: "9.1M" },
      summary: "Scaled premium noise-canceling headphones to #1 trending tech product on Instagram Reels via audiophile blind tests.",
      problem: "Competing against legacy audio giants with 100x bigger marketing budgets.",
      strategy: "Leveraged audio engineer creators doing blind sound tests vs Sony and Bose. Ads were published under creator handles."
    }
  ],

  team: [
    {
      name: "Arjun Verma",
      role: "Managing Partner & Growth Lead",
      bio: "Ex-D2C Performance Lead. Scaled ₹80Cr+ in Meta ad spend across 40+ brands.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      monogram: "AV",
      badge: "₹80Cr+ Scaled"
    },
    {
      name: "Sanya Malhotra",
      role: "Head of Creator Strategy & UGC",
      bio: "Directs 200+ creator relationships and content production frameworks that convert.",
      img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
      monogram: "SM",
      badge: "200+ Creators"
    },
    {
      name: "Karan Johar",
      role: "Head of Conversion Tech & CRO",
      bio: "Full-stack engineer specialized in Next.js, sub-second Shopify stores, and A/B funnels.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      monogram: "KJ",
      badge: "0.4s Sub-Second Web"
    }
  ],

  testimonials: [
    {
      quote: "CLYX completely replaced our internal creative bottleneck. Their creator whitelisting pipeline drove our ROAS from 2.1x to 4.4x in just six weeks.",
      author: "Aarav Kapoor",
      role: "Founder & CEO",
      brand: "Lumina Skincare",
      metrics: "+265% Revenue · ₹1.2Cr Added"
    },
    {
      quote: "Most agencies give you fluff reports and vanity metrics. CLYX treats our ad budget like their own money. The blend of UGC + performance buying is deadly.",
      author: "Natasha Roy",
      role: "Head of Growth",
      brand: "Aethel Streetwear",
      metrics: "3.9x ROAS · ₹40L/month Scale"
    },
    {
      quote: "The landing page they built loaded in 0.4 seconds. Coupled with their whitelisted creator ads, our checkout conversion rate jumped from 1.8% to 4.8%.",
      author: "Devang Patel",
      role: "Co-Founder",
      brand: "Volt Audio",
      metrics: "5.1x Peak ROAS · 0.4s Page Speed"
    }
  ]
};

window.CLYX_DATA = CLYX_DATA;
