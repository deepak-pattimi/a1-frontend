import React, { useEffect, useState } from "react";
import Header from "./Header";
import Home from "./Home";
import Footer from "./Footer";
import Pcod from "./Gynaecology/pcod";
import Endometriosis from "../Components/Gynaecology/Endometriosis";
import GyaecologicalDisorders from "../Components/Gynaecology/GynaecologicalDisorders";
import Menstrualproblems from "../Components/Gynaecology/Menstrualproblems";
import UterineFibroid from "../Components/Gynaecology/UterineFibroid";
import Cystoscopy from "../Components/Gynaecology/Cystoscopy";
import PelvicReconstruction from "../Components/Gynaecology/PelvicReconstruction";
import Prolapse from "../Components/Gynaecology/Prolapse";
import UrineIncontience from "./Gynaecology/UrineIncontience";
import Hymenoplasty from "../Components/Gynaecology/Hymenoplasty";
import LabialReconstruction from "../Components/Gynaecology/LabialReconstruction";
import VaginalReconstruction from "../Components/Gynaecology/VaginalReconstruction";
import Breastcancer from "./Cancers/Breastcancer";
import Cervicalcancer from "./Cancers/Cervicalcancer";
import Endometrialcancer from "./Cancers/Endormetrialcancer";
import Ovariancancer from "./Cancers/Ovariancancer";
import Vulvarcancer from "./Cancers/Vulvarcancer";
import Aboutclinic from "../Components/Aboutus/Aboutclinic";
import Aboutdr from "../Components/Aboutus/Aboutdr";
import Contact from "../Components/Aboutus/Contact";
import Azoospermia from "./Infertility/Azoospermia";
import Casa from "./Infertility/Casa";
import Follicularstudy from "./Infertility/Follicularstudy";
import Geneticscreening from "../Components/Infertility/Geneticscreening";
import Infertilityassessments from "./Infertility/Infertilityassessments";
import Lowamh from "./Infertility/Lowamh";
import PerinealReconstruction from "../Components/Gynaecology/PerinealReconstruction";
import Ovulationinduction from "../Components/Infertility/Ovulationinduction";
import Stemcellivf from "./Infertility/Stemcellivf";
import Diagnosticlaparscopy from "../Components/LaparoscopicSurgery/Diagnosticlaparscopy";
import Laparscopichysterectomy from "./LaparoscopicSurgery/Laparoscopicmyomectomy";
import Laparoscopicmyomectomy from "../Components/LaparoscopicSurgery/Laparoscopicmyomectomy";
import Operativehysteroscopy from "../Components/LaparoscopicSurgery/Operativehysteroscopy";
import Amniocentesistests from "./Maternity/Amniocentesistests";
import Cesareandelivery from "../Components/Maternity/Cesareandelivery";
import Doublemarker from "../Components/Maternity/Doublemarker";
import Forcepsdelivery from "./Maternity/Forcepsdelivery";
import Highriskpregnancy from "../Components/Maternity/Highriskpregnancy";
import Nipt from "../Components/Maternity/Nipt";
import Normaldelivery from "./Maternity/normaldelivery";
import Obygynultrasound from "./Maternity/Obygynultrasound";
import Painlessdelivery from "./Maternity/Painlessdelivery";
import Prepregnancycounselling from "./Maternity/Prepregnancycounselling";
import Quadrupletest from "./Maternity/Quadrupletest";
import Triplemarker from "./Maternity/Triplemarker";
import Twinstriplepregnancy from "./Maternity/Twinstriplepregnancy";
import Ultrasound3d4d from "./Maternity/ultrasound3d4d";
import Vaccumdelivery from "./Maternity/Vaccumdelivery";
import Blogs from "../Components/PatientGuide/Blogs";
import Reviews from "../Components/PatientGuide/Reviews";
import Videos from "../Components/PatientGuide/Videos";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./Navbar.css";


function Routing() {
  return (
    <div>
      <Header />

      <Router>
      </Router>

      <Footer />
    </div>
  );
}

export default Routing;
