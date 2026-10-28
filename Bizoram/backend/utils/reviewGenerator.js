export const BUSINESS_CATEGORIES = {
  general: {
    label: "General Business & Service",
    tags: [
      "Excellent Service",
      "Professional Staff",
      "Fast Response Time",
      "High Quality Standards",
      "Reliable & Trustworthy",
      "Great Communication",
      "Value for Money",
      "Smooth Experience",
      "Attention to Detail",
      "Highly Recommended",
    ],
  },
  tech: {
    label: "Software, Tech & Digital",
    tags: [
      "User-Friendly Platform",
      "Fast & Reliable",
      "Great Customer Support",
      "Feature-Rich Solution",
      "Smooth Onboarding",
      "Innovative Experience",
      "Helpful Team",
      "Seamless Integration",
      "Saved Us Time",
      "Highly Recommended",
    ],
  },
  retail: {
    label: "Retail, Products & E-Commerce",
    tags: [
      "Quality Products",
      "Fast Delivery",
      "Great Packaging",
      "Fair Pricing",
      "Wide Selection",
      "Helpful Customer Care",
      "Easy Checkout",
      "Accurate Descriptions",
      "Trustworthy Brand",
      "Will Buy Again",
    ],
  },
  food: {
    label: "Restaurant, Cafe & Dining",
    tags: [
      "Delicious Food",
      "Fresh Ingredients",
      "Prompt Service",
      "Courteous Staff",
      "Pleasant Ambience",
      "Clean and Hygienic",
      "Generous Portions",
      "Fair Pricing",
      "Comfortable Seating",
      "Great Atmosphere",
    ],
  },
  healthcare: {
    label: "Healthcare, Clinic & Hospital",
    tags: [
      "Knowledgeable Doctors",
      "Caring Staff",
      "Clean & Sanitized Clinic",
      "Minimal Waiting Time",
      "Clear Guidance",
      "Gentle Care",
      "Modern Facilities",
      "Comfortable Environment",
      "Professional Consultation",
      "Highly Trusted",
    ],
  },
  professional: {
    label: "Professional Services & Consulting",
    tags: [
      "Expert Guidance",
      "Timely Delivery",
      "Clear Communication",
      "Dedicated Team",
      "Transparent Pricing",
      "Strategic Advice",
      "Professional Approach",
      "Attention to Detail",
      "Dependable Partner",
      "Exceeded Expectations",
    ],
  },
  salon: {
    label: "Salon, Spa & Beauty Care",
    tags: [
      "Skilled Stylists",
      "Relaxing Atmosphere",
      "Hygienic Equipment",
      "Polite Staff",
      "Great Consultation",
      "Punctual Appointment",
      "Premium Products",
      "Reasonable Rates",
      "Wonderful Transformation",
      "Highly Recommended",
    ],
  },
  fitness: {
    label: "Gym, Fitness & Sports",
    tags: [
      "Modern Equipment",
      "Motivating Trainers",
      "Clean & Spacious",
      "Good Energy",
      "Helpful Coaching",
      "Flexible Timings",
      "Friendly Community",
      "Well Maintained",
      "Great Workout Vibe",
      "Great Results",
    ],
  },
  hospitality: {
    label: "Hotels, Resorts & Travel",
    tags: [
      "Comfortable Rooms",
      "Warm Welcome",
      "Clean Amenities",
      "Prime Location",
      "Courteous Hospitality",
      "Delicious Breakfast",
      "Prompt Room Service",
      "Peaceful Stay",
      "Hassle-Free Check-in",
      "Memorable Experience",
    ],
  },
  education: {
    label: "Education, Coaching & Training",
    tags: [
      "Knowledgeable Teachers",
      "Interactive Classes",
      "Clear Explanations",
      "Supportive Mentors",
      "Practical Learning",
      "Structured Curriculum",
      "Doubt Solving Support",
      "Encouraging Atmosphere",
      "Great Learning Journey",
      "Highly Recommended",
    ],
  },
  auto: {
    label: "Automobile & Repair Services",
    tags: [
      "Honest Diagnosis",
      "Fair Estimate",
      "Timely Completion",
      "Quality Spare Parts",
      "Experienced Mechanics",
      "Transparent Pricing",
      "Clear Explanation",
      "Smooth Drive",
      "Reliable Workmanship",
      "Trustworthy Workshop",
    ],
  },
  realestate: {
    label: "Real Estate & Construction",
    tags: [
      "Prime Location",
      "Transparent Dealing",
      "Helpful Consultation",
      "Clear Legal Documentation",
      "High Build Quality",
      "On-Time Handover",
      "Responsive Team",
      "Professional Guidance",
      "Good Return on Investment",
      "Highly Recommended",
    ],
  },
};

export const ALL_BUSINESS_TAGS = Object.values(BUSINESS_CATEGORIES).flatMap((c) => c.tags);
export const RESTAURANT_TAGS = ALL_BUSINESS_TAGS;

const TEMPLATES_5_STAR = [
  (b, t) =>
    `Had a truly wonderful experience with ${b}. ${t ? `The ${t.toLowerCase()} was particularly noteworthy. ` : ""}Everything was handled professionally, smoothly, and with genuine attention to detail. The team was responsive, helpful, and courteous throughout. Highly recommended!`,
  (b, t) =>
    `Really impressed with the quality and service provided by ${b}. ${t ? `Appreciated the ${t.toLowerCase()}. ` : ""}Everything exceeded our expectations, with prompt communication and zero unnecessary delays. Easily one of the best experiences we have had.`,
  (b, t) =>
    `Worked with / visited ${b} and was thoroughly satisfied. ${t ? `Special mention for the ${t.toLowerCase()}. ` : ""}The team maintained high standards, transparent communication, and genuine professionalism. Will definitely be returning and recommending them to others.`,
  (b, t) =>
    `Top-notch service and reliable quality from ${b}. ${t ? `The ${t.toLowerCase()} made a significant difference. ` : ""}Every aspect was delivered on time and with great care. Commendable work by the entire team.`,
  (b, t) =>
    `An exceptional experience with ${b} from start to finish. ${t ? `Liked the ${t.toLowerCase()}. ` : ""}Consistent quality, attentive support, and fair value. A solid five-star recommendation!`,
  (b, t) =>
    `One of the most dependable and professional teams around. ${t ? `The ${t.toLowerCase()} was top tier. ` : ""}Quick turnaround, respectful staff, and consistently reliable results. They clearly take pride in what they do.`,
];

const TEMPLATES_4_STAR = [
  (b, t) =>
    `Had a very good experience with ${b}. ${t ? `The ${t.toLowerCase()} was well executed. ` : ""}Communication was prompt and our requirements were handled smoothly. A reliable team that definitely delivers on quality.`,
  (b, t) =>
    `Pleasant and satisfying experience with ${b}. ${t ? `Liked the ${t.toLowerCase()}. ` : ""}Helpful team and efficient service. Overall very happy with the outcome and would gladly recommend.`,
  (b, t) =>
    `Solid 4-star experience with ${b}. ${t ? `Particularly appreciated the ${t.toLowerCase()}. ` : ""}Professional team and respectful coordination throughout. Minor scope for small refinements, but definitely worth working with.`,
];

const TEMPLATES_3_STAR = [
  (b, t) =>
    `Average experience with ${b}. There is definitely scope for improvement. ${t ? `Specifically experienced issues with ${t.toLowerCase()}. ` : ""}While some aspects were acceptable, speed, consistency, and customer attention need improvement.`,
  (b, t) =>
    `My experience with ${b} was moderate. ${t ? `Room for improvement regarding ${t.toLowerCase()}. ` : ""}Turnaround time and customer care could be noticeably better. Hope the team takes this constructive feedback into account.`,
  (b, t) =>
    `Fair experience, but fell short of what we expected from ${b}. ${t ? `Feedback on ${t}: ` : ""}Some parts were satisfactory while others were poor. Better communication and coordination would make a huge difference.`,
];

const TEMPLATES_1_2_STAR = [
  (b, t) =>
    `Very disappointed with our experience with ${b}. ${t ? `We faced serious issues with ${t.toLowerCase()}. ` : ""}The service fell far short of acceptable standards and what was promised. Submitting this directly so management can take immediate corrective action.`,
  (b, t) =>
    `Unfortunately, my experience with ${b} was very poor. ${t ? `The main problem was ${t.toLowerCase()}. ` : ""}We encountered avoidable delays, lack of responsiveness, and substandard quality. Sharing this feedback for urgent review.`,
  (b, t) =>
    `Not satisfied with the service provided by ${b}. ${t ? `Particularly frustrated with ${t.toLowerCase()}. ` : ""}Communication was poor and our concerns were not addressed. Expecting management to resolve this promptly.`,
];

// Hindi (हिंदी) Templates
const TEMPLATES_5_STAR_HI = [
  (b, t) => `${b} के साथ बहुत ही शानदार और सुखद अनुभव रहा। ${t ? `${t} विशेष रूप से बहुत अच्छा था। ` : ""}काम पूरी ईमानदारी और स्वच्छता के साथ हुआ। स्टाफ बहुत विनम्र और सहयोगी है। 100% अनुशंसित! ⭐⭐⭐⭐⭐`,
  (b, t) => `${b} की सेवा और गुणवत्ता से बेहद प्रभावित हुए। ${t ? `खासकर ${t} को लेकर पूरी संतुष्टि मिली। ` : ""}बिना किसी देरी के सब कुछ समय पर पूरा हुआ। निश्चित रूप से हमारे बेहतरीन अनुभवों में से एक।`,
  (b, t) => `${b} से सेवा ली और पूर्णतः संतुष्ट रहे। ${t ? `${t} का स्तर अत्यंत सराहनीय था। ` : ""}टीम ने उच्च स्तरीय कार्यप्रणाली और पारदर्शी व्यवहार बनाए रखा। हम आगे भी इन्हीं से सेवा लेंगे और सभी को सिफारिश करेंगे।`,
  (b, t) => `उत्कृष्ट सेवा और भरोसेमंद गुणवत्ता। ${b} की पूरी टीम ने बहुत ही जिम्मेदारी से काम किया। ${t ? `${t} ने हमारा दिल जीत लिया। ` : ""}पूरे दिल से 5 स्टार रेटिंग!`,
];

const TEMPLATES_4_STAR_HI = [
  (b, t) => `${b} के साथ काफी अच्छा अनुभव रहा। ${t ? `${t} का काम संतोषजनक था। ` : ""}स्टाफ का सहयोग अच्छा रहा और बातचीत सुगम रही। भरोसेमंद टीम जो अच्छी गुणवत्ता प्रदान करती है।`,
  (b, t) => `${b} की सेवाएं सुखद और संतोषजनक रहीं। ${t ? `${t} पसंद आया। ` : ""}कुल मिलाकर परिणाम से बहुत खुश हैं और निश्चित रूप से दूसरों को भी सलाह देंगे।`,
];

// Hinglish (Conversational) Templates
const TEMPLATES_5_STAR_HINGLISH = [
  (b, t) => `${b} ke sath bohot hi badhiya experience raha! ${t ? `${t} was genuinely impressive. ` : ""}Fast turnaround, courteous staff aur ekdum top-notch service. 100% recommended! ⭐⭐⭐⭐⭐`,
  (b, t) => `Really impressed with the service of ${b}! ${t ? `Special mention for ${t}. ` : ""}Saara kaam bina kisi unnecessary delay ke smoothly ho gaya. Easily one of the best experiences!`,
  (b, t) => `${b} ki service ekdum first class hai. ${t ? `${t} bohot achha laga. ` : ""}Polite team, transparent pricing aur proper guidance throughout. Definitely friends ko recommend karunga!`,
  (b, t) => `An exceptional experience with ${b} from start to finish. ${t ? `Liked the ${t}. ` : ""}Consistent quality, attentive support aur fair value. Full 5-star rating!`,
];

const TEMPLATES_4_STAR_HINGLISH = [
  (b, t) => `Solid 4-star experience with ${b}. ${t ? `${t} was quite good. ` : ""}Professional team aur prompt service. Definitely worth checking out!`,
  (b, t) => `${b} ke sath experience kafi pleasant aur accha raha. ${t ? `Appreciated ${t}. ` : ""}Minor improvements ho sakte hain, but overall very happy with the service.`,
];

export function generateSmartReview(options = {}) {
  const { title = "", star = 5, businessName = "the team", tags = [], seed = 0, lang = "en" } = options;

  let templateList = TEMPLATES_5_STAR;
  if (lang === "hi") {
    templateList = star === 4 ? TEMPLATES_4_STAR_HI : TEMPLATES_5_STAR_HI;
  } else if (lang === "hinglish") {
    templateList = star === 4 ? TEMPLATES_4_STAR_HINGLISH : TEMPLATES_5_STAR_HINGLISH;
  } else {
    if (star === 4) {
      templateList = TEMPLATES_4_STAR;
    } else if (star === 3) {
      templateList = TEMPLATES_3_STAR;
    } else if (star <= 2) {
      templateList = TEMPLATES_1_2_STAR;
    }
  }

  // Format selected tags cleanly
  const cleanTags = tags
    .map((tag) => tag.replace(/^[^\w\s]+/, "").trim())
    .filter(Boolean);

  let tagString = "";
  if (cleanTags.length === 1) {
    tagString = cleanTags[0];
  } else if (cleanTags.length === 2) {
    tagString = `${cleanTags[0]} and ${cleanTags[1]}`;
  } else if (cleanTags.length > 2) {
    tagString = `${cleanTags.slice(0, -1).join(", ")}, and ${cleanTags[cleanTags.length - 1]}`;
  }

  // Combine title/context if user provided custom text
  const context = [title.trim(), tagString].filter(Boolean).join(" - ");

  // Select template by seed
  const index =
    typeof seed === "number"
      ? Math.abs(seed) % templateList.length
      : Math.floor(Math.random() * templateList.length);

  const generatorFn = templateList[index] || templateList[0];
  return generatorFn(businessName, context);
}

export function generateSmartReviewOptions(options = {}) {
  const { title = "", star = 5, businessName = "the team", tags = [], seed = 0, lang = "en" } = options;

  // Format selected tags cleanly
  const cleanTags = tags
    .map((tag) => tag.replace(/^[^\w\s]+/, "").trim())
    .filter(Boolean);

  let tagString = "";
  if (cleanTags.length === 1) {
    tagString = cleanTags[0];
  } else if (cleanTags.length === 2) {
    tagString = `${cleanTags[0]} and ${cleanTags[1]}`;
  } else if (cleanTags.length > 2) {
    tagString = `${cleanTags.slice(0, -1).join(", ")}, and ${cleanTags[cleanTags.length - 1]}`;
  }

  const context = [title.trim(), tagString].filter(Boolean).join(" - ");

  // HINDI
  if (lang === "hi") {
    if (star >= 5) {
      const quickPool = [
        (b, t) => `${b} के साथ बहुत ही शानदार और सुखद अनुभव रहा। ${t ? `${t} विशेष रूप से बहुत अच्छा था। ` : ""}काम समय पर हुआ और स्टाफ का व्यवहार बहुत विनम्र था। 100% अनुशंसित! ⭐⭐⭐⭐⭐`,
        (b, t) => `${b} की सेवा से बेहद प्रभावित हुए। ${t ? `${t} सचमुच बहुत सराहनीय रहा। ` : ""}पूरी टीम ने बहुत ही जिम्मेदारी से काम किया। ज़रूर दोबारा आएंगे।`,
      ];
      const detailedPool = [
        (b, t) => `${b} के साथ हमारा अनुभव अत्यंत संतोषजनक रहा। ${t ? `खासकर ${t} को लेकर पूरी संतुष्टि मिली। ` : ""}पूरी टीम ने विनम्रता और उच्च गुणवत्ता के साथ काम किया। छोटी-छोटी बातों का भी पूरा ध्यान रखा गया। हम सभी को यहां आने की सलाह देंगे!`,
        (b, t) => `${b} के यहां बहुत ही बढ़िया माहौल और सेवा मिली। ${t ? `${t} का अनुभव बहुत सुखद रहा। ` : ""}हर सवाल का धैर्यपूर्वक समाधान मिला और कोई अनावश्यक देरी नहीं हुई। पूरे दिल से 5 स्टार!`,
      ];
      const trustedPool = [
        (b, t) => `क्षेत्र में सबसे भरोसेमंद और बेहतरीन सेवा प्रदाताओं में से एक हैं ${b}। ${t ? `${t} पर इनका ध्यान लाजवाब है। ` : ""}उचित मूल्य, पारदर्शी व्यवहार और समयबद्ध कार्य। एक सच्चा 5-स्टार अनुभव!`,
        (b, t) => `यदि आप गुणवत्ता और ईमानदारी चाहते हैं, तो ${b} सबसे उत्तम विकल्प है। ${t ? `${t} में इनकी गुणवत्ता साफ दिखाई देती है। ` : ""}हमारी अपेक्षाओं से बढ़कर सेवा प्रदान की। अत्यधिक अनुशंसित!`,
      ];

      const qIdx = Math.abs(seed) % quickPool.length;
      const dIdx = Math.abs(seed) % detailedPool.length;
      const tIdx = Math.abs(seed) % trustedPool.length;

      return [
        {
          id: "quick",
          tone: "⚡ संक्षिप्त व उत्तम",
          tagline: "कम शब्दों में सटीक",
          text: quickPool[qIdx](businessName, context),
        },
        {
          id: "detailed",
          tone: "🤝 विस्तृत व विनम्र",
          tagline: "सम्मान व अनुभव सहित",
          text: detailedPool[dIdx](businessName, context),
        },
        {
          id: "trusted",
          tone: "🏆 प्रतिष्ठित व विश्वसनीय",
          tagline: "उच्च गुणवत्ता व भरोसा",
          text: trustedPool[tIdx](businessName, context),
        },
      ];
    } else if (star === 4) {
      return [
        {
          id: "quick",
          tone: "⚡ संक्षिप्त समीक्षा",
          tagline: "सटीक 4-स्टार",
          text: `${businessName} के साथ काफी अच्छा अनुभव रहा। ${context ? `${context} संतोषजनक था। ` : ""}स्टाफ सहयोगी है और काम समय पर हुआ। एक मजबूत 4-स्टार रेटिंग।`,
        },
        {
          id: "detailed",
          tone: "🤝 सुखद व संतोषजनक",
          tagline: "विस्तृत राय",
          text: `${businessName} की सेवाएं सुखद और संतोषजनक रहीं। ${context ? `${context} पसंद आया। ` : ""}कुल मिलाकर परिणाम से बहुत खुश हैं और निश्चित रूप से दूसरों को भी सलाह देंगे।`,
        },
        {
          id: "trusted",
          tone: "👍 भरोसेमंद टीम",
          tagline: "गुणवत्ता रेटिंग",
          text: `भरोसेमंद टीम और अच्छा काम। ${businessName} के साथ अनुभव सुखद रहा। ${context ? `${context} का स्तर अच्छा था। ` : ""}हम दूसरों को भी इनकी सिफारिश करेंगे।`,
        },
      ];
    }
  }

  // HINGLISH
  if (lang === "hinglish") {
    if (star >= 5) {
      const quickPool = [
        (b, t) => `${b} ke sath bohot hi badhiya experience raha! ${t ? `${t} was genuinely impressive. ` : ""}Fast turnaround, courteous staff aur ekdum top-notch service. 100% recommended! ⭐⭐⭐⭐⭐`,
        (b, t) => `Really impressed with ${b}! ${t ? `Special mention for ${t}. ` : ""}Saara kaam bina kisi unnecessary delay ke smoothly ho gaya. Easily one of the best experiences!`,
      ];
      const detailedPool = [
        (b, t) => `${b} ke sath experience bohot hi wonderful aur satisfying raha. ${t ? `Particularly ${t} ne bohot impress kiya. ` : ""}Team bohot responsive aur helpful thi, aur har cheez ka dhyan rakha. Definitely visit again karunga!`,
        (b, t) => `${b} ke yahan service aur customer care dono top level hain. ${t ? `${t} was handled smoothly. ` : ""}Staff ka behavior bohot polite tha aur transparent communication mila. Full 5 stars!`,
      ];
      const trustedPool = [
        (b, t) => `Area ke sabse reliable aur trustworthy teams me se ek hai ${b}. ${t ? `Their focus on ${t} is great. ` : ""}Genuine pricing aur consistent quality deliver karte hain. A solid 5-star rating all the way!`,
        (b, t) => `Agar aapko proper quality aur honest service chahiye toh ${b} is definitely the best choice. ${t ? `${t} was top tier. ` : ""}Expectations se badhkar deliver kiya. Highly recommended!`,
      ];

      const qIdx = Math.abs(seed) % quickPool.length;
      const dIdx = Math.abs(seed) % detailedPool.length;
      const tIdx = Math.abs(seed) % trustedPool.length;

      return [
        {
          id: "quick",
          tone: "⚡ Quick & Badhiya",
          tagline: "Short & mobile-friendly",
          text: quickPool[qIdx](businessName, context),
        },
        {
          id: "detailed",
          tone: "🤝 Detailed & Shandar",
          tagline: "Polite & warm",
          text: detailedPool[dIdx](businessName, context),
        },
        {
          id: "trusted",
          tone: "🏆 Local Favorite & Trusted",
          tagline: "High reputation star",
          text: trustedPool[tIdx](businessName, context),
        },
      ];
    } else if (star === 4) {
      return [
        {
          id: "quick",
          tone: "⚡ Quick & Good",
          tagline: "Short & crisp",
          text: `Solid 4-star experience with ${businessName}. ${context ? `${context} was quite good. ` : ""}Professional staff aur prompt handling. Definitely worth checking out!`,
        },
        {
          id: "detailed",
          tone: "🤝 Pleasant & Helpful",
          tagline: "Detailed feedback",
          text: `${businessName} ke sath experience kafi pleasant aur accha raha. ${context ? `Appreciated ${context}. ` : ""}Minor improvements ho sakte hain, but overall very happy with the service!`,
        },
        {
          id: "trusted",
          tone: "👍 Dependable Service",
          tagline: "Reliable choice",
          text: `Dependable service by ${businessName}. ${context ? `${context} was good. ` : ""}Good communication aur respectful team. Happily recommend karunga.`,
        },
      ];
    }
  }

  // DEFAULT: ENGLISH
  if (star >= 5) {
    const quickPool = [
      (b, t) => `Top-notch service and reliable quality from ${b}. ${t ? `The ${t.toLowerCase()} was impressive. ` : ""}Fast turnaround, courteous staff, and 100% recommended! ⭐⭐⭐⭐⭐`,
      (b, t) => `Really impressed with ${b}! ${t ? `Special mention for the ${t.toLowerCase()}. ` : ""}Everything was handled smoothly and professionally with zero hassle. Highly recommended!`,
      (b, t) => `Exceptional experience with ${b} from start to finish. ${t ? `Appreciated the ${t.toLowerCase()}. ` : ""}Prompt communication, attentive support, and fair value. A solid 5-star recommendation!`,
    ];

    const detailedPool = [
      (b, t) => `Had a truly wonderful experience with ${b}. ${t ? `The ${t.toLowerCase()} was particularly noteworthy. ` : ""}Everything was handled professionally, smoothly, and with genuine attention to detail. The team was responsive, helpful, and courteous throughout.`,
      (b, t) => `Worked with / visited ${b} and was thoroughly satisfied. ${t ? `Appreciated the ${t.toLowerCase()}. ` : ""}The team maintained high standards, transparent communication, and genuine professionalism. Will definitely be returning and recommending them to others!`,
      (b, t) => `Outstanding experience! From the moment we contacted ${b}, their customer service and dedication were evident. ${t ? `The ${t.toLowerCase()} made a significant difference. ` : ""}Commendable work by the entire team.`,
    ];

    const trustedPool = [
      (b, t) => `Easily one of the most dependable and professional teams around. ${t ? `The ${t.toLowerCase()} was top tier. ` : ""}Quick turnaround, respectful staff, and consistently reliable results. They clearly take pride in what they do.`,
      (b, t) => `If you are looking for genuine quality and trustworthiness, ${b} is the best choice. ${t ? `Their focus on ${t.toLowerCase()} stands out. ` : ""}Exceeded our expectations in every single way. 5 stars all the way!`,
      (b, t) => `A truly 5-star rating for ${b}. ${t ? `Great execution on ${t.toLowerCase()}. ` : ""}Consistent quality, transparent pricing, and excellent customer care. Highly trusted!`,
    ];

    const qIdx = (Math.abs(seed) + 0) % quickPool.length;
    const dIdx = (Math.abs(seed) + 1) % detailedPool.length;
    const tIdx = (Math.abs(seed) + 2) % trustedPool.length;

    return [
      {
        id: "quick",
        tone: "⚡ Quick & Punchy",
        tagline: "Short & impactful",
        text: quickPool[qIdx](businessName, context),
      },
      {
        id: "detailed",
        tone: "🤝 Detailed & Friendly",
        tagline: "Personal & thorough",
        text: detailedPool[dIdx](businessName, context),
      },
      {
        id: "trusted",
        tone: "🏆 Quality & Trusted",
        tagline: "SEO & reputation star",
        text: trustedPool[tIdx](businessName, context),
      },
    ];
  } else if (star === 4) {
    const quickPool = [
      (b, t) => `Solid 4-star experience with ${b}. ${t ? `Particularly appreciated the ${t.toLowerCase()}. ` : ""}Professional team and quick turnaround. Definitely worth working with!`,
      (b, t) => `Had a very good experience with ${b}. ${t ? `The ${t.toLowerCase()} was well executed. ` : ""}Communication was prompt and our requirements were handled smoothly.`,
    ];
    const detailedPool = [
      (b, t) => `Pleasant and satisfying experience with ${b}. ${t ? `Liked the ${t.toLowerCase()}. ` : ""}Helpful team and efficient service. Overall very happy with the outcome and would gladly recommend.`,
      (b, t) => `Very positive experience with ${b}. ${t ? `Special mention for ${t.toLowerCase()}. ` : ""}Courteous coordination throughout and minor scope for small refinements, but overall great service.`,
    ];
    const trustedPool = [
      (b, t) => `Good quality and dependable service from ${b}. ${t ? `The ${t.toLowerCase()} was good. ` : ""}A reliable team that definitely delivers on its promises.`,
      (b, t) => `Dependable team at ${b}. ${t ? `The ${t.toLowerCase()} made for a good experience. ` : ""}Solid 4-star service that we would happily recommend to friends and colleagues.`,
    ];

    const qIdx = Math.abs(seed) % quickPool.length;
    const dIdx = Math.abs(seed) % detailedPool.length;
    const tIdx = Math.abs(seed) % trustedPool.length;

    return [
      {
        id: "quick",
        tone: "⚡ Quick & Punchy",
        tagline: "Direct & positive",
        text: quickPool[qIdx](businessName, context),
      },
      {
        id: "detailed",
        tone: "🤝 Detailed & Friendly",
        tagline: "Helpful & courteous",
        text: detailedPool[dIdx](businessName, context),
      },
      {
        id: "trusted",
        tone: "👍 Solid & Dependable",
        tagline: "Quality-focused",
        text: trustedPool[tIdx](businessName, context),
      },
    ];
  }

  return [];
}
