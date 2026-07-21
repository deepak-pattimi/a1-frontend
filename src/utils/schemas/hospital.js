// Hospital and Homepage Schema Configuration
export const getHomepageSchema = (generalSettings = {}) => {
  const siteUrl = 'https://www.a1laparoscopyhospital.com';
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Hospital', 'MedicalOrganization'],
        '@id': `${siteUrl}/#hospital`,
        name: generalSettings.website_name || 'A1 Laparoscopy Hospital',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: generalSettings.logo || `${siteUrl}/images/logo.png`,
          width: 300,
          height: 100
        },
        image: generalSettings.cover_image || `${siteUrl}/images/hospital-exterior.jpg`,
        description: generalSettings.description || 'A1 Laparoscopy Hospital in Visakhapatnam offers advanced laparoscopic and bariatric surgeries led by Dr. Naveen Kumar Anem and Dr. I.S. Prathyusha, with 24/7 ICU, diagnostic lab, pharmacy, and anaesthesia support.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '17-1-17, Dr CS Mangamma Building, Opp KGH',
          addressLocality: 'Maharanipeta',
          addressRegion: 'Andhra Pradesh',
          postalCode: '530002',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          // TODO: Replace with actual coordinates from Google Maps
          latitude: '[FILL IN - Get from Google Maps]',
          longitude: '[FILL IN - Get from Google Maps]'
        },
        telephone: generalSettings.phone || '[FILL IN - Format: +91-891-XXXXXXXX]',
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59'
        },
        medicalSpecialty: ['SurgicalProcedure', 'Gastroenterologic', 'Obstetric'],
        availableService: [
          { '@type': 'MedicalProcedure', name: 'Laparoscopic Surgery' },
          { '@type': 'MedicalProcedure', name: 'Bariatric Surgery' },
          { '@type': 'MedicalProcedure', name: 'Laparoscopic Hernia Repair' },
          { '@type': 'MedicalProcedure', name: 'Laparoscopic Appendectomy' },
          { '@type': 'MedicalProcedure', name: 'Laparoscopic Cholecystectomy' },
          { '@type': 'MedicalProcedure', name: 'Laparoscopic Hysterectomy' },
          { '@type': 'MedicalProcedure', name: 'Hysteroscopy' },
          { '@type': 'MedicalProcedure', name: 'Piles and Fistula Treatment' }
        ],
        employee: [
          { '@id': `${siteUrl}/dr-naveen-kumar-anem#physician` },
          { '@id': `${siteUrl}/dr-prathyusha-gynecologist#physician` }
        ],
        hasMap: 'https://maps.google.com/?q=A1+Laparoscopy+Hospital+Maharanipeta+Visakhapatnam',
        sameAs: [
          'https://www.instagram.com/a1laparoscopyhospital/',
          'https://www.facebook.com/p/A1-Laparoscopy-Hospital-100083178528347/',
          'https://www.practo.com/visakhapatnam/clinic/a1-hospital-akkayyapalem-1',
          'https://www.justdial.com/Visakhapatnam/A1-Laparoscopy-Centre-Krishna-Nagar/0891PX891-X891-181219124949-E6L9_BZDET'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: generalSettings.website_name || 'A1 Laparoscopy Hospital',
        inLanguage: 'en-IN',
        publisher: {
          '@id': `${siteUrl}/#hospital`
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What laparoscopic surgeries are performed at A1 Laparoscopy Hospital?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A1 Laparoscopy Hospital performs laparoscopic surgery, bariatric (weight loss) surgery, hernia repair, appendectomy, gallstone (cholecystectomy) surgery, hysterectomy, hysteroscopy, and piles and fistula treatment. All procedures use minimally invasive techniques for faster recovery and less pain.'
            }
          },
          {
            '@type': 'Question',
            name: 'Who are the doctors at A1 Laparoscopy Hospital in Visakhapatnam?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A1 Laparoscopy Hospital is led by Dr. Naveen Kumar Anem (MBBS, DNB General Surgery, 17+ years of experience in laparoscopic and bariatric surgery) and Dr. I.S. Prathyusha (OB-GYN specialist in laparoscopic gynecology, hysterectomy, and hysteroscopy).'
            }
          },
          {
            '@type': 'Question',
            name: 'Does A1 Laparoscopy Hospital offer 24/7 emergency surgical care?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. A1 Laparoscopy Hospital provides 24/7 comprehensive surgical care with an in-house ICU, diagnostic laboratory, pharmacy, and anaesthesia support available at all times.'
            }
          },
          {
            '@type': 'Question',
            name: 'Where is A1 Laparoscopy Hospital located?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A1 Laparoscopy Hospital is located at 17-1-17, Dr CS Mangamma Building, opposite KGH, Maharanipeta, Visakhapatnam, Andhra Pradesh 530002, India.'
            }
          },
          {
            '@type': 'Question',
            name: 'What are the benefits of laparoscopic surgery over open surgery?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Laparoscopic surgery uses small incisions (5–10 mm) and a camera, offering faster recovery (days vs. weeks), less post-operative pain, lower infection risk, minimal scarring, and shorter hospital stay compared to traditional open surgery.'
            }
          }
        ]
      }
    ]
  };
};
