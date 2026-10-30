// Blog Post Schema Configuration
const siteUrl = 'https://www.a1laparoscopyhospital.com';

export const getBlogPostSchema = (postData) => {
  const { 
    slug, 
    title, 
    description, 
    image, 
    datePublished, 
    dateModified,
    authorType = 'dr-naveen' // 'dr-naveen' or 'dr-prathyusha'
  } = postData;

  const authorId = authorType === 'dr-prathyusha' 
    ? `${siteUrl}/dr-prathyusha-gynecologist#physician`
    : `${siteUrl}/dr-naveen-kumar-anem#physician`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${siteUrl}/page/${slug}#article`,
        headline: title || '[FILL IN - exact post title]',
        url: `${siteUrl}/page/${slug}`,
        description: description || '[FILL IN - 150-character summary of the post]',
        image: {
          '@type': 'ImageObject',
          url: image || `${siteUrl}/images/blog/${slug}.jpg`,
          width: 1200,
          height: 628
        },
        datePublished: datePublished || '[FILL IN - YYYY-MM-DD]',
        dateModified: dateModified || '[FILL IN - YYYY-MM-DD]',
        author: {
          '@id': authorId
        },
        reviewedBy: {
          '@id': authorId
        },
        publisher: {
          '@id': `${siteUrl}/#hospital`
        },
        inLanguage: 'en-IN',
        about: {
          '@type': 'MedicalProcedure',
          name: postData.about || '[FILL IN - e.g. Laparoscopic Surgery, Bariatric Surgery]'
        },
        medicalAudience: {
          '@type': 'MedicalAudience',
          audienceType: 'Patient'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blogs` },
          { '@type': 'ListItem', position: 3, name: title || '[FILL IN - post title]', item: `${siteUrl}/page/${slug}` }
        ]
      }
    ]
  };
};

// Blog post mapping for reference
export const blogPostMapping = [
  {
    slug: 'benefits-of-laparoscopic-surgery',
    author: 'dr-naveen-kumar-anem',
    about: 'Laparoscopic Surgery'
  },
  {
    slug: 'gallstone-surgery-causes-and-treatment-options',
    author: 'dr-naveen-kumar-anem',
    about: 'Laparoscopic Cholecystectomy'
  },
  {
    slug: 'hernia-repair-laparoscopic-approach',
    author: 'dr-naveen-kumar-anem',
    about: 'Laparoscopic Hernia Repair'
  },
  {
    slug: 'appendectomy-laparoscopic-procedure',
    author: 'dr-naveen-kumar-anem',
    about: 'Laparoscopic Appendectomy'
  },
  {
    slug: 'laparoscopic-hysterectomy',
    author: 'dr-prathyusha-gynecologist',
    about: 'Laparoscopic Hysterectomy'
  },
  {
    slug: 'hysteroscopy-care-of-uterus',
    author: 'dr-prathyusha-gynecologist',
    about: 'Hysteroscopy'
  },
  {
    slug: 'bariatric-surgery-and-weight-loss-what-to-expect',
    author: 'dr-naveen-kumar-anem',
    about: 'Bariatric Surgery'
  },
  {
    slug: 'post-surgery-care-tips-for-quick-recovery',
    author: 'dr-naveen-kumar-anem',
    about: 'Laparoscopic Surgery'
  },
  {
    slug: 'diet-after-laparoscopic-surgery-what-to-eat',
    author: 'dr-naveen-kumar-anem',
    about: 'Laparoscopic Surgery'
  },
  {
    slug: 'exercise-and-physical-activity-after-laparoscopic-surgery',
    author: 'dr-naveen-kumar-anem',
    about: 'Laparoscopic Surgery'
  }
];
