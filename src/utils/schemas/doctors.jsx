// Doctor Schema Configuration
const siteUrl = 'https://www.a1laparoscopyhospital.com';

export const getDrNaveenSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${siteUrl}/dr-naveen-kumar-anem#physician`,
    name: 'Dr. Naveen Kumar Anem',
    givenName: 'Naveen Kumar',
    familyName: 'Anem',
    honorificPrefix: 'Dr.',
    url: `${siteUrl}/dr-naveen-kumar-anem`,
    image: `${siteUrl}/images/dr-naveen-kumar-anem.jpg`,
    description: 'Dr. Naveen Kumar Anem is a senior laparoscopic and bariatric surgeon with 17+ years of experience at A1 Laparoscopy Hospital, Visakhapatnam, specialising in hernia repair, bariatric surgery, appendectomy, and gallstone removal.',
    medicalSpecialty: [
      'https://schema.org/SurgicalProcedure',
      'https://schema.org/Gastroenterologic'
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: 'MBBS',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Dr. NTR University of Health Sciences'
        },
        dateCreated: '2007'
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: 'DNB — General Surgery',
        recognizedBy: {
          '@type': 'Organization',
          name: 'National Board of Examinations, India'
        },
        dateCreated: '2011'
      }
    ],
    knowsAbout: [
      'Laparoscopic Surgery',
      'Bariatric Surgery',
      'Hernia Repair',
      'Laparoscopic Appendectomy',
      'Laparoscopic Cholecystectomy',
      'Piles and Fistula Treatment',
      'Minimally Invasive Surgery'
    ],
    worksFor: {
      '@id': `${siteUrl}/#hospital`
    },
    workLocation: {
      '@type': 'PostalAddress',
      streetAddress: '17-1-17, Dr CS Mangamma Building, Opp KGH',
      addressLocality: 'Maharanipeta',
      addressRegion: 'Andhra Pradesh',
      postalCode: '530002',
      addressCountry: 'IN'
    }
  };
};

export const getDrPrathyushaSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${siteUrl}/dr-prathyusha-gynecologist#physician`,
    name: 'Dr. I.S. Prathyusha',
    honorificPrefix: 'Dr.',
    url: `${siteUrl}/dr-prathyusha-gynecologist`,
    image: `${siteUrl}/images/dr-prathyusha.jpg`,
    description: 'Dr. I.S. Prathyusha is a consultant obstetrician and gynaecologist at A1 Laparoscopy Hospital, Visakhapatnam, specialising in laparoscopic gynecological surgery including hysterectomy, hysteroscopy, ovarian cysts, fibroids, endometriosis, and ectopic pregnancies.',
    medicalSpecialty: [
      'https://schema.org/Obstetric',
      'https://schema.org/SurgicalProcedure'
    ],
    knowsAbout: [
      'Laparoscopic Gynecology',
      'Hysterectomy',
      'Hysteroscopy',
      'Ovarian Cyst Treatment',
      'Fibroid Removal',
      'Endometriosis Treatment',
      'Ectopic Pregnancy Management',
      'Obstetrics and Gynecology'
    ],
    worksFor: {
      '@id': `${siteUrl}/#hospital`
    },
    workLocation: {
      '@type': 'PostalAddress',
      streetAddress: '17-1-17, Dr CS Mangamma Building, Opp KGH',
      addressLocality: 'Maharanipeta',
      addressRegion: 'Andhra Pradesh',
      postalCode: '530002',
      addressCountry: 'IN'
    }
  };
};
