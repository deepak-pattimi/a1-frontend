import React, { useState, useEffect } from "react";
import Shieldpic from "../../assets/sheildpic.png";
import CallIcon from "@mui/icons-material/Call";
import Button from "@mui/material/Button";
import Madampic from "../../assets/madampic.png";
import { useRouter } from 'next/router';
import Image from 'next/image';
import axiosInstance from "../../utils/axiosConfig";
import { getImageUrl } from "@/utils/imageUtils";

function AboutDoctor({ generalSettings: initialSettings }) {
  const router = useRouter();
  const [aboutPage, setAboutPage] = useState(null);
  const [settings, setSettings] = useState(initialSettings || null);

  useEffect(() => {
    axiosInstance
      .get("get-about-page")
      .then((res) => setAboutPage(res.data))
      .catch((err) => console.log(err));

    if (!initialSettings) {
      axiosInstance
        .get("general-settings")
        .then((res) => setSettings(res.data))
        .catch((err) => console.log(err));
    }
  }, [initialSettings]);

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
                  {aboutPage?.doctor_designations && aboutPage.doctor_designations.map((designation, index) => (
                    <p key={index}>{designation}</p>
                  ))}
                </div>
              </div>
            </div>

            {aboutPage?.custom_sections && aboutPage.custom_sections.length > 0 && (
              aboutPage.custom_sections.map((sec, idx) => {
                const lines = sec.content ? sec.content.split('\n').filter(l => l.trim().length > 0) : [];
                const isList = lines.length > 1;

                return (
                  <div key={idx} className="doctor-custom-section mt-5">
                    {sec.heading && <h2>{sec.heading}</h2>}
                    {isList ? (
                      <ul>
                        {lines.map((item, itemIdx) => (
                          <li key={itemIdx}>{item}</li>
                        ))}
                      </ul>
                    ) : lines.length === 1 ? (
                      <p>{lines[0]}</p>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>

          <div className="col-lg-4">
            <div className="clinic-contact-card p-4 rounded shadow">
              <h3>Contact Information</h3>
              <div className="contact-details mt-3">
                <p>
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {settings?.address ? (
                    settings.address.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < settings.address.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      A1 Laparoscopy Hospital, <br /> C.S. Mangamma Hospital building, Main Rd, <br /> opposite KGH Outgate, Opp KGH OP Gate, <br /> Maharani Peta, Visakhapatnam, Andhra Pradesh 530002
                    </>
                  )}
                </p>
                <p>
                  <i className="fas fa-phone me-2"></i>
                  {settings?.header_phone || settings?.footer_phone || '+91 78292 22111'}
                </p>
                <p>
                  <i className="fas fa-envelope me-2"></i>
                  {settings?.header_email || settings?.footer_email || 'contact@a1laparoscopyhospital.com'}
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
