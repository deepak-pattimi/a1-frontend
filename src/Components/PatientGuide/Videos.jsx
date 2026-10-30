import React from "react";
function Videos() {
  return (
    <div>
      <div className="main-area">
        <div className="container">
          <div className="breadcrums py-1">
            <div className="row pt-4">
              <div className="col-auto col-md-10">
                <nav aria-label="breadcrumb " className="second">
                  <ol className="breadcrumb indigo lighten-6 first">
                    <li className="breadcrumb-item font-weight-bold ">
                      <a className="black-text text-uppercase bread_a" href="#">
                        <span className="mr-md-3 mr-2">Home</span>
                      </a>
                      <i
                        className="fa fa-angle-double-right "
                        aria-hidden="true"
                      />
                    </li>
                    <li className="breadcrumb-item font-weight-bold">
                      <a className="black-text text-uppercase bread_a" href="#">
                        <span className="mr-md-3 mr-2">Patient Guide</span>
                      </a>
                      <i
                        className="fa fa-angle-double-right text-uppercase "
                        aria-hidden="true"
                      />
                    </li>
                    <li className="breadcrumb-item font-weight-bold">
                      <a
                        className="black-text text-uppercase bread_a active-2"
                        href="#"
                      >
                        <span>Reviews & Videos</span>
                      </a>
                    </li>
                  </ol>
                </nav>
              </div>


              <div className="container">
                <div className="bookappointment my-4">
                  <div className="row">
                    <div className="col-md-8">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15219.318009617673!2d78.396404!3d17.5156505!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91530ac9ecf7%3A0x1946e7ee6bcc884d!2sDr.%20Padmanabha%20Varma&#39;s%20Hormone%20Clinic%20-%20Diabetes%20%2CThyroid%20%26%20Endocrine%20Super%20Speciality%20Centre!5e0!3m2!1sen!2sin!4v1691808841355!5m2!1sen!2sin"
                        className="ifrmae2"
                        style={{ border: "0" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                    <div className="col-md-4">
                      <div className="formSubmit">
                        <p>We Are Ready To Help You With A Smile!</p>
                        <h4 className="font-weight-bold">
                          <i className="fa fa-cell"></i>Call Us:{" "}
                          <span className="colorora">+91 81002 77610</span>
                        </h4>

                        <form>
                          <input
                            type="text"
                            placeholder="Fullname*"
                            className="form-control mb-3"
                          />

                          <input
                            type="text"
                            placeholder="Mobile*"
                            className="form-control mb-3"
                          />

                          <input
                            type="text"
                            placeholder="Email*"
                            className="form-control mb-3"
                          />

                          <select className="form-control mb-3">
                            <option value="Diabetes">Diabetes</option>
                            <option value="Thyroid">Thyroid</option>
                            <option value="Adrenal">Adrenal</option>
                            <option value="Pituitary">Pituitary</option>
                            <option value="Gonaos">Gonaos</option>
                            <option value="VitaminD & Calcium">
                              VitaminD & Calcium
                            </option>
                            <option value="Growth">Growth</option>
                            <option value="Obesity">Obesity</option>
                          </select>
                          <div className="my-3">
                            <textarea
                              placeholder="Please tell us your conern in detail"
                              className="form-control my-3"
                            ></textarea>
                          </div>
                        </form>

                        <div className="my-3">
                          <a href="" className="bookapp my-4 w-100">
                            Book Appointment
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default Videos;
