import React, { useState, useEffect } from "react";
import Shieldpic from "../../assets/sheildpic.png";
import CallIcon from "@mui/icons-material/Call";
import Button from "@mui/material/Button";
import { useRouter } from 'next/router';
import Image from 'next/image';
import axiosInstance from "../../utils/axiosConfig";
import { getImageUrl } from "@/utils/imageUtils";

function AboutClinic() {
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
                    <span className="black-text text-uppercase active-2">About Clinic</span>
                  </li>
                </ol>
              </nav>
              <h1 className="nameDr blueone text-center">A1 Laparoscopy Hospital</h1>
              <p className="clinic-tagline text-center">{aboutPage?.tagline || 'Committed to Surgical Excellence'}</p>
              <p className="text-center">{aboutPage?.sub_tagline || 'Advanced and Affordable Laparoscopic and Bariatric Surgeries'}</p>
              <div className="social-proof text-center my-3">
                <div className="ratings d-inline-block me-3">
                  <i className="fa fa-star starsize"></i>
                  <span className="mx-2">Trusted by hundreds of patients • Experienced surgeons</span>
                </div>
                <div className="verification d-inline-block">
                  <Image src={Shieldpic.src} alt="Verified" className="img-fluid" width={30} height={30} style={{ width: "30px", height: "auto" }} />
                  <span className="ms-2">Accredited Medical Facility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="clinic-description">
              <h2>{aboutPage?.clinic_heading || 'About Our Clinic'}</h2>
              <p>
                {aboutPage?.clinic_description || 'A1 Laparoscopy Hospital, located in Maharanipet, Visakhapatnam, is committed to delivering advanced and affordable laparoscopic and bariatric surgeries. Led by experienced specialists like Dr. Naveen Kumar Anem and Dr. I.S. Prathyusha, our hospital provides 24×7 comprehensive care with in-house ICU, diagnostic lab, pharmacy, and anesthesia support. From general surgery to gynecology and minimally invasive treatments, we offer expert-led care across specialties, all under one roof.'}
              </p>
              <ul className="mt-3">
                {(aboutPage?.clinic_services || [
                  'Diagnosis and treatment for 20+ surgical conditions',
                  'Complete care from consultation to post-op recovery',
                  'Laparoscopic Gallbladder Removal',
                  'Minimally Invasive Hernia Repair',
                  'Laparoscopic Appendectomy',
                  'Laparoscopic Bariatric Procedures',
                  'Laser Vein Treatment',
                  'Laparoscopic Hysterectomy'
                ]).map((service, index) => (
                  <li key={index}>{service}</li>
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

export default AboutClinic;
