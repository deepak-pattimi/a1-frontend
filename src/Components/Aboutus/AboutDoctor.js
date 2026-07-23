import React, { useState, useEffect } from "react";
import Shieldpic from "../../assets/sheildpic.png";
import CallIcon from "@mui/icons-material/Call";
import Button from "@mui/material/Button";
import Madampic from "../../assets/madampic.png";
import { useRouter } from 'next/router';
import Image from 'next/image';
import axiosInstance from "../../utils/axiosConfig";
import { getImageUrl } from "@/utils/imageUtils";

function AboutDoctor() {
  const router = useRouter();
  const [aboutPage, setAboutPage] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("get-about-page")
      .then((res) => setAboutPage(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="about-dr">
      <div className="hspbanner">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb" className="second my-3">
                <ol className="breadcrumb indigo lighten-6">
                  <li className="breadcrumb-item font-weight-bold">
                    <a className="black-text text-uppercase" href="/">Home</a>
                    <i className="fa fa-angle-double-right mx-2" aria-hidden="true" />
                  </li>
                  <li className="breadcrumb-item font-weight-bold">
                    <span className="black-text text-uppercase active-2">About Doctor</span>
                  </li>
                </ol>
              </nav>
              <h1 className="nameDr blueone text-center">{aboutPage?.doctor_heading || 'Meet Dr. Naveen Kumar Anem'}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="doctor-profile mt-5">
              <div className="row mt-4 align-items-center">
                <div className="col-4 col-md-3">
                  <Image 
                    src={aboutPage?.doctor_image ? getImageUrl(aboutPage.doctor_image) : Madampic.src} 
                    alt={aboutPage?.doctor_name || 'Dr. Naveen Kumar Anem'} 
                    className="img-fluid rounded-circle" 
                    width={200} 
                    height={200} 
                    style={{ width: "100%", height: "auto" }} 
                  />
                </div>
                <div className="col-8 col-md-9">
                  <h3>{aboutPage?.doctor_name || 'Dr. Naveen Kumar Anem'}</h3>
                  {(aboutPage?.doctor_designations || [
                    'Consultant - Laparoscopic Surgeon',
                    'MBBS, MS (General Surgery)',
                    'Advanced Training in Minimal Access Surgery',
                    'Specialist in Laparoscopic and Bariatric Procedures'
                  ]).map((designation, index) => (
                    <p key={index}>{designation}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="doctor-overview mt-5">
              <h2>Overview</h2>
              {aboutPage?.doctor_overview ? (
                aboutPage.doctor_overview.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    Dr. Naveen Kumar Anem is a highly skilled laparoscopic surgeon specializing in minimally invasive surgical procedures. He completed his MBBS followed by MS in General Surgery. He has undergone advanced training in minimal access surgery and is specialized in laparoscopic and bariatric procedures.
                  </p>
                  <p>
                    At A1 Laparoscopy Hospital, Dr. Anem combines years of clinical expertise with the latest in laparoscopic technology to ensure quicker recovery, less pain, and minimal scarring for patients. With a focus on patient safety and personalized care, he provides comprehensive treatment solutions for various surgical conditions.
                  </p>
                </>
              )}
            </div>

            <div className="doctor-expertise mt-5">
              <h2>Areas of Expertise</h2>
              <ul>
                {(aboutPage?.doctor_expertise || [
                  'Laparoscopic Gallbladder Removal',
                  'Minimally Invasive Hernia Repair',
                  'Laparoscopic Appendectomy',
                  'Weight Loss Surgery (Bariatric Procedures)',
                  'Laser Treatment for Varicose Veins',
                  'Laparoscopic Hysterectomy',
                  'Ovarian Cyst Removal',
                  'Fibroid Removal',
                  'General Surgery',
                  'Gynecological Procedures'
                ]).map((expertise, index) => (
                  <li key={index}>{expertise}</li>
                ))}
              </ul>
            </div>

            <div className="doctor-awards mt-5">
              <h2>{aboutPage?.doctor_awards_heading || 'Awards and Recognitions'}</h2>
              <ul>
                {(aboutPage?.doctor_awards || [
                  'Gold Medal in DM Neurology',
                  'Gold Medal in MBBS (3 subjects)',
                  'Best Case Presentation Award - API Karnataka Chapter (2016)',
                  'Gold Medal - Movement Disorder Society of India (2020)'
                ]).map((award, index) => (
                  <li key={index}>{award}</li>
                ))}
              </ul>
            </div>

            <div className="doctor-memberships mt-5">
              <h2>{aboutPage?.doctor_memberships_heading || 'Memberships'}</h2>
              <ul>
                {(aboutPage?.doctor_memberships || [
                  'International Parkinson and Movement Disorder Society',
                  'Movement Disorder Society of India',
                  'American Academy of Neurology',
                  'Indian Academy of Neurology',
                  'Indian Medical Association'
                ]).map((membership, index) => (
                  <li key={index}>{membership}</li>
                ))}
              </ul>
            </div>

            <div className="doctor-research mt-5">
              <h2>{aboutPage?.doctor_research_heading || 'Research Work and Publications'}</h2>
              <ul>
                {(aboutPage?.doctor_research || [
                  'Co-Author: "Medical Management of Movement Disorders" in the 4th edition of the textbook of Neurosurgery',
                  'Study: "Clinical Profile of Lower Body Parkinsonism in a Tertiary Care Hospital in Southern India"',
                  'Original Article: "Clinical Spectrum of Movement Disorders in Neurology Inpatients"',
                  'Review Article: "Primary Angitis of Central Nervous System – A Challenging Diagnosis"'
                ]).map((research, index) => (
                  <li key={index}>{research}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="clinic-contact-card p-4 rounded shadow">
              <h3>Contact Information</h3>
              <div className="contact-details mt-3">
                <p>
                  <i className="fas fa-map-marker-alt me-2"></i>
                  A1 Laparoscopy Hospital, <br /> C.S. Mangamma Hospital building, Main Rd, <br /> opposite KGH Outgate, Opp KGH OP Gate, <br /> Maharani Peta, Visakhapatnam, Andhra Pradesh 530002
                </p>
                <p>
                  <i className="fas fa-phone me-2"></i>
                  +91 78292 22111
                </p>
                <p>
                  <i className="fas fa-envelope me-2"></i>
                  contact@a1laparoscopyhospital.com
                </p>
              </div>

              <div className="appointment-button mt-4">
                <Button
                  variant="contained"
                  className="w-100"
                  onClick={() => router.push('/contact')}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutDoctor;
