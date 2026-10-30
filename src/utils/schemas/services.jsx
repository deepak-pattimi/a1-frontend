// Service Pages Schema Configuration
const siteUrl = 'https://www.a1laparoscopyhospital.com';

export const getBariatricSurgerySchema = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `${siteUrl}/bariatric-surgery-visakhapatnam#procedure`,
        name: 'Bariatric Surgery (Weight Loss Surgery)',
        alternateName: 'Weight Loss Surgery',
        url: `${siteUrl}/bariatric-surgery-visakhapatnam`,
        description: 'Bariatric surgery at A1 Laparoscopy Hospital involves laparoscopic weight loss procedures for patients with obesity. Performed by Dr. Naveen Kumar Anem with 17+ years of surgical experience in Visakhapatnam.',
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: 'Abdomen',
        preparation: 'Pre-operative evaluation including blood tests, ECG, cardiac assessment, and dietary counselling.',
        followup: 'Regular post-operative consultations, dietary guidance, and monitoring of weight loss progress.',
        howPerformed: 'Performed laparoscopically through 3–5 small incisions under general anaesthesia.',
        performer: { '@id': `${siteUrl}/dr-naveen-kumar-anem#physician` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: 'Bariatric Surgery Visakhapatnam', item: `${siteUrl}/bariatric-surgery-visakhapatnam` }
        ]
      }
    ]
  };
};

export const getHerniaRepairSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `${siteUrl}/hernia-repair-visakhapatnam#procedure`,
        name: 'Laparoscopic Hernia Repair',
        url: `${siteUrl}/hernia-repair-visakhapatnam`,
        description: 'Laparoscopic hernia repair at A1 Laparoscopy Hospital treats inguinal, umbilical, and incisional hernias using minimally invasive mesh reinforcement techniques in Visakhapatnam.',
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: 'Abdominal Wall',
        howPerformed: 'Performed laparoscopically under general anaesthesia; mesh placed to reinforce the weakened abdominal wall through 3 small incisions.',
        followup: 'Recovery typically 1–2 weeks; follow-up consultation at 1 week and 1 month post-surgery.',
        performer: { '@id': `${siteUrl}/dr-naveen-kumar-anem#physician` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: 'Hernia Repair Visakhapatnam', item: `${siteUrl}/hernia-repair-visakhapatnam` }
        ]
      }
    ]
  };
};

export const getLaparoscopicSurgerySchema = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `${siteUrl}/laparoscopic-surgery-visakhapatnam#procedure`,
        name: 'Laparoscopic Surgery',
        url: `${siteUrl}/laparoscopic-surgery-visakhapatnam`,
        description: 'A1 Laparoscopy Hospital in Visakhapatnam specialises in advanced minimally invasive laparoscopic surgery for gallstones, hernia, appendix, and other abdominal conditions, performed by Dr. Naveen Kumar Anem.',
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: 'Abdomen',
        howPerformed: 'Minimally invasive surgery using a laparoscope (camera) and small incisions instead of a large open cut, under general anaesthesia.',
        performer: { '@id': `${siteUrl}/dr-naveen-kumar-anem#physician` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: 'Laparoscopic Surgery Visakhapatnam', item: `${siteUrl}/laparoscopic-surgery-visakhapatnam` }
        ]
      }
    ]
  };
};

export const getGallstoneSurgerySchema = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `${siteUrl}/gallstone-surgery-visakhapatnam#procedure`,
        name: 'Laparoscopic Cholecystectomy (Gallstone Surgery)',
        alternateName: 'Gallstone Removal Surgery',
        url: `${siteUrl}/gallstone-surgery-visakhapatnam`,
        description: 'Laparoscopic cholecystectomy (gallbladder removal) at A1 Laparoscopy Hospital in Visakhapatnam treats gallstones and gallbladder disease using minimally invasive techniques with same-day or next-day discharge.',
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: 'Gallbladder',
        howPerformed: 'Gallbladder removed laparoscopically through 3–4 small incisions under general anaesthesia. Most patients discharged within 24 hours.',
        performer: { '@id': `${siteUrl}/dr-naveen-kumar-anem#physician` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: 'Gallstone Surgery Visakhapatnam', item: `${siteUrl}/gallstone-surgery-visakhapatnam` }
        ]
      }
    ]
  };
};

export const getAppendectomySchema = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `${siteUrl}/appendectomy-visakhapatnam#procedure`,
        name: 'Laparoscopic Appendectomy',
        url: `${siteUrl}/appendectomy-visakhapatnam`,
        description: 'Laparoscopic appendectomy (appendix removal) at A1 Laparoscopy Hospital treats appendicitis through minimally invasive surgery with 24/7 emergency availability in Visakhapatnam.',
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: 'Appendix',
        howPerformed: 'Appendix removed laparoscopically through 2–3 small incisions under general anaesthesia. Emergency surgery available 24/7.',
        performer: { '@id': `${siteUrl}/dr-naveen-kumar-anem#physician` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: 'Appendectomy Visakhapatnam', item: `${siteUrl}/appendectomy-visakhapatnam` }
        ]
      }
    ]
  };
};

export const getHysterectomySchema = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `${siteUrl}/hysterectomy-visakhapatnam#procedure`,
        name: 'Laparoscopic Hysterectomy',
        url: `${siteUrl}/hysterectomy-visakhapatnam`,
        description: 'Laparoscopic hysterectomy at A1 Laparoscopy Hospital in Visakhapatnam is performed by Dr. I.S. Prathyusha (OB-GYN specialist) using minimally invasive techniques for faster recovery and less pain.',
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: 'Uterus',
        howPerformed: 'Uterus removed laparoscopically through small incisions under general anaesthesia, avoiding large open incisions.',
        followup: 'Follow-up at 1 week and 6 weeks post-surgery; pelvic rest for 6 weeks.',
        performer: { '@id': `${siteUrl}/dr-prathyusha-gynecologist#physician` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: 'Hysterectomy Visakhapatnam', item: `${siteUrl}/hysterectomy-visakhapatnam` }
        ]
      }
    ]
  };
};

export const getHysteroscopySchema = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `${siteUrl}/hysteroscopy-visakhapatnam#procedure`,
        name: 'Hysteroscopy',
        url: `${siteUrl}/hysteroscopy-visakhapatnam`,
        description: 'Hysteroscopy at A1 Laparoscopy Hospital allows Dr. I.S. Prathyusha to diagnose and treat uterine conditions including fibroids, polyps, and abnormal bleeding using a thin camera with no external incisions.',
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: 'Uterus',
        howPerformed: 'A thin camera (hysteroscope) is passed through the cervix into the uterus — no skin incisions required. Performed under general or local anaesthesia.',
        performer: { '@id': `${siteUrl}/dr-prathyusha-gynecologist#physician` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: 'Hysteroscopy Visakhapatnam', item: `${siteUrl}/hysteroscopy-visakhapatnam` }
        ]
      }
    ]
  };
};

export const getPilesFistulaSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `${siteUrl}/piles-fistula-treatment-visakhapatnam#procedure`,
        name: 'Piles and Fistula Treatment',
        alternateName: 'Haemorrhoids and Fistula Surgery',
        url: `${siteUrl}/piles-fistula-treatment-visakhapatnam`,
        description: 'Minimally invasive piles (haemorrhoids) and fistula treatment at A1 Laparoscopy Hospital in Visakhapatnam. Laser and laparoscopic options available for faster recovery with less pain.',
        procedureType: 'https://schema.org/SurgicalProcedure',
        bodyLocation: 'Rectum and Anal Canal',
        howPerformed: 'Laser or laparoscopic techniques used depending on severity. Day-care procedures available for most cases.',
        performer: { '@id': `${siteUrl}/dr-naveen-kumar-anem#physician` }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
          { '@type': 'ListItem', position: 3, name: 'Piles Fistula Treatment Visakhapatnam', item: `${siteUrl}/piles-fistula-treatment-visakhapatnam` }
        ]
      }
    ]
  };
};
