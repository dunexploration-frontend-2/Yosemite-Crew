/* eslint-disable react-refresh/only-export-components */

import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Doctor_Dashboard.css";
import {
  CanceledAndAcceptFHIRConverter,
  FHIRParser,
  FHIRSlotService,
  FHIRToRating,
  NormalAppointmentConverter,
} from "../../utils/FhirMapper";
import { BoxDiv, DivHeading, SeeAll } from "../Dashboard/page";
// import box1 from '../../../../public/Images/box1.png';
// import box7 from '../../../../public/Images/box7.png';
// import box8 from '../../../../public/Images/box8.png';
// import doctprofile from '../../../../public/Images/doctprofile.png';
// import reviw from '../../../../public/Images/reviw.png';
// import review1 from '../../../../public/Images/review1.png';
// import review2 from '../../../../public/Images/review2.png';
// import review3 from '../../../../public/Images/review3.png';
import ActionsTable from "../../Components/ActionsTable/ActionsTable";
// import Accpt from '../../../../public/Images/acpt.png';
// import Decln from '../../../../public/Images/decline.png';
import StatusTable from "../../Components/StatusTable/StatusTable";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCheckCircle } from "react-icons/fa";
import { BsPatchCheck } from "react-icons/bs";

import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/useAuth";
import { getData } from "../../services/apiService";

const Doctor_Dashboard = () => {
  const { doctorProfile, userId, onLogout } = useAuth();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [duration, setduration] = useState(null);
  const [date, setDate] = useState(new Date());
  const [Day, setDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [profile, setprofile] = useState([]);
  const [status, setStatus] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  console.log("timeSlots ", timeSlots);
  useEffect(() => {
    if (doctorProfile) {
      setduration(doctorProfile.timeDuration);
      setprofile(doctorProfile.personalInfo);
    }
  }, [doctorProfile]);

  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleShowLess = () => {
    setShowMore(false);
  };

  const [showModal, setShowModal] = useState(false);
  const getStatus = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/doctors/getAvailabilityStatus?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("response.data", response.data.isAvailable);
      setStatus(response.data.isAvailable.toString());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Session expired. Redirecting to signin...");
        onLogout(navigate);
      }
      console.log("error", error);
    }
  }, [navigate, onLogout, userId]);

  const handleToggle = async () => {
    const newStatus = status === "1" ? "0" : "1";
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/doctors/updateAvailability?userId=${userId}&status=${newStatus}`,
        {}, // Empty body, since you're using query parameters
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response) {
        getStatus();
        Swal.fire({
          title: "Success",
          text: "Availability updated successfully",
          icon: "success",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Session expired. Redirecting to signin...");
        onLogout(navigate);
      }
      console.log("error", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update availability",
        icon: "error",
      });
    }
  };
  const opneModel = () => {
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const day = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    setDay(day);

    if (doctorProfile) {
      const filteredAvailability = doctorProfile.availability
        ?.filter((v) => v.day === day)
        .flatMap((v) => v.times)
        .map((v) => ({
          from: `${v.from.hour}:${v.from.minute} ${v.from.period}`,
          to: `${v.to.hour}:${v.to.minute} ${v.to.period}`,
        }));
      console.log("dayclicked", day);
      genrateSlotes(filteredAvailability, duration, userId, day, selectedDate);
    }
  };

  const genrateSlotes = async (
    filteredAvailability,
    duration,
    userId,
    day,
    selectedDate
  ) => {
    const slots = [];
    console.log(
      " filteredAvailability, duration,userId,day,selectedDate",
      filteredAvailability,
      duration,
      userId,
      day,
      selectedDate
    );

    filteredAvailability?.forEach(({ from, to }) => {
      const fromDate = parseTime(from); // Parse the 'from' time into a Date object
      const toDate = parseTime(to); // Parse the 'to' time into a Date object

      let current = new Date(fromDate);

      // Generate slots while the current time is less than the 'to' time
      while (current < toDate) {
        const nextSlot = new Date(current.getTime() + duration * 60 * 1000); // Add duration in minutes

        // Break if the next slot exceeds the 'to' time
        if (nextSlot > toDate) break;

        slots.push({
          time: formatTime(current), // Format current time into 'HH:MM AM/PM'
          selected: false,
        });

        current = nextSlot;
      }
    });
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/doctors/getDoctorsSlotes`,
        {
          params: {
            doctorId: userId,
            day,

            date: `${new Date(selectedDate).getFullYear()}-${(
              new Date(selectedDate).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${new Date(selectedDate)
              .getDate()
              .toString()
              .padStart(2, "0")}`,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("hello");
      setTimeSlots(data.timeSlots);
    } catch (error) {
      console.error(
        "Error fetching doctor slots:",
        error.response?.data || error
      );

      if (error.response?.status === 404) {
        console.log("Generated Slots:", slots);
        setTimeSlots(slots);
      }
    }
  };

  const parseTime = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isPM = hours >= 12;

    const formattedHours = isPM ? hours % 12 || 12 : hours || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const period = isPM ? "PM" : "AM";

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const toggleSlot = (index) => {
    const updatedSlots = timeSlots.map((slot, i) =>
      i === index ? { ...slot, selected: !slot.selected } : slot
    );
    setTimeSlots(updatedSlots);
  };

  const selectAllSlots = () => {
    const allSelected = timeSlots.every((slot) => slot.selected);
    const updatedSlots = timeSlots.map((slot) => ({
      ...slot,
      selected: !allSelected,
    }));
    setTimeSlots(updatedSlots);
  };

  const handleSlotes = async () => {
    const fhirSlotService = new FHIRSlotService(timeSlots);

    const slotsBundle = fhirSlotService.createBundle(userId);

    console.log("Generated FHIR Slots Bundle:", slotsBundle);
    try {
      // console.log("hello");
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/doctors/addDoctorsSlots/${userId}`,
        { slots: slotsBundle, day: Day },
        {
          headers: {
            Authorization: `$Bearer ${token}`,
          },
        }
      );
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Slot Added Successfully",
        });
        closeModal();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Session expired. Redirecting to signin...");
        onLogout(navigate);
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to Add the Slot . Please try again later.",
      });
    }
  };

  const [allAppointments, setAllAppointments] = useState([]);
  const [total, setTotal] = useState();
  // console.log('allappointments', allAppointments);
  const getAllAppointments = useCallback(
    async (offset, itemsPerPage) => {
      console.log("offset", offset, typeof itemsPerPage);
      try {
        const response = await getData(
          `fhir/v1/Appointment?organization=Practitioner/${userId}&offset=${offset}&limit=${itemsPerPage}&type=${"AppointmentLists"}`
        );
        if (response.status === 200 && response.data.status === 1) {


          const normalAppointments =
            NormalAppointmentConverter.convertAppointments({
              totalAppointments: response.data.data.total,
              appointments: response.data.data.entry.map(
                (entry) => entry.resource
              ),
            });
          setAllAppointments(normalAppointments.appointments);
          setTotal(normalAppointments.totalAppointments);
        } else if (response.status === 200 && response.data.status === 0) {
          // new Swal({
          //   title: "Not Found",
          //   text: response.data?.message || "Requested data not found.",
          //   icon: "error",
          // });
          console.log("error");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Session expired. Redirecting to signin...");
          onLogout(navigate);
        }
      }
    },
    [navigate, userId, onLogout]
  );
  const [Last_7DaysCounts, setLast_7DaysCounts] = useState({});



  console.log("last7days",Last_7DaysCounts);
  const getlast7daysAppointMentsCount = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}fhir/v1/MeasureReport?type=DoctorDashOverview&doctorId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        const data = new FHIRParser(response.data).overviewConvertToNormal();

        setLast_7DaysCounts(data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Session expired. Redirecting to signin...");
        onLogout(navigate);
      }
    }
  }, [onLogout, navigate, userId]);

  const AppointmentActions = async (id, status, offset) => {
    try {
      const token = sessionStorage.getItem("token");

      // Prepare FHIR-compliant payload
      const fhirAppointment = CanceledAndAcceptFHIRConverter.toFHIR({
        id,
        status,
      });

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}fhir/v1/Appointment/${id}?userId=${userId}`,
        fhirAppointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Appointment Status Changed",
          text: "Appointment Status Changed Successfully",
          icon: "success",
        });
      }

      getAllAppointments(offset, 6);
      getlast7daysAppointMentsCount();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        onLogout(navigate);
      }

      Swal.fire({
        title: "Error",
        text: "Failed to Change Appointment Status",
        icon: "error",
      });
    }
  };

  const userFeedBacks = useCallback(async () => {
    try {
      const response = await getData("fhir/v1/Rating", {
        params: { doctorId: userId },
      });
      if (response.status === 200) {
        const val = new FHIRToRating(
          response.data.rating
        ).ratingConvertToNormal();
        console.log("response", val);
        setFeedbacks(val);
      }
    } catch (error) {
      console.log("", error);
    }
  }, [userId]);

  useEffect(() => {
    getAllAppointments(0, 6);
    getlast7daysAppointMentsCount();
    getStatus();
    if (userId) {
      userFeedBacks(userId);
    }
  }, [
    userId,
    getlast7daysAppointMentsCount,
    userFeedBacks,
    getStatus,
    getAllAppointments,
  ]);

  return (
    <section className="DoctorDashBoardSec">
      <div className="container">
        <div className="MainDash">
          <div className="DoctDashTop">
            <div className="TopDashSlot">
              <div className="ProfileDash">
                <img src={profile.image} alt="" />
                <div className="doctnameText">
                  <span>
                    Welcome, Dr. {`${profile.firstName} ${profile.lastName}`}
                  </span>
                  <h2>Your Dashboard</h2>
                </div>
              </div>

              <div className="toggleAvavilty">
                <h6>Availability Status</h6>
                <div className="togalrt">
                  <div
                    className={`toggle-switch ${
                      status === "1" ? "active" : ""
                    }`}
                    onClick={handleToggle}
                  >
                    <div className="toggle-circle"></div>
                  </div>
                  <p
                    className="avlbl"
                    style={{ color: status === "1" ? "#8AC1B1" : "gray" }}
                  >
                    {status === "1" ? "Available" : ""}
                  </p>
                </div>
                <p onClick={opneModel} className="mngevigible">
                  Manage Availability
                </p>
              </div>

              <Modal
                className="DoctToogleDiv"
                show={showModal}
                onHide={closeModal}
                centered
              >
                <Modal.Header>
                  <h3>Manage Availability</h3>
                  <div className="avltog">
                    <h6>Availability Status</h6>
                    <div
                      className={`toggle-switch ${
                        status === "1" ? "active" : ""
                      }`}
                      onClick={handleToggle}
                    >
                      <div className="toggle-circle"></div>
                    </div>
                    <p style={{ color: status === "1" ? "#8AC1B1" : "gray" }}>
                      {status === "1" ? "Available" : ""}
                    </p>
                  </div>
                </Modal.Header>
                <Modal.Body>
                  <div className="DoctAvailBody">
                    <h5>Select Date</h5>
                    <Calendar
                      onChange={handleDateChange}
                      value={date}
                      className="custom-calendar"
                    />
                  </div>
                  <div className="Slectmodal">
                    <div className="TopSlctDiv">
                      <div className="lftSlot">
                        <h5>Select your available slots</h5>
                        <p>
                          Click a slot to toggle your availability for
                          appointments.
                        </p>
                      </div>
                      <div className="RytSlot">
                        <Button onClick={selectAllSlots}>
                          {" "}
                          <FaCheckCircle />{" "}
                          {timeSlots.every((slot) => slot.selected)
                            ? "Deselect All"
                            : "Select All"}{" "}
                        </Button>
                      </div>
                    </div>

                    {timeSlots.length === 0 ? (
                      "No Slotes Available"
                    ) : (
                      <div className="time-slot-selector">
                        <div className="time-slots">
                          {timeSlots.map((slot, index) => (
                            <button
                              key={index}
                              className={`time-slot ${
                                slot.selected ? "selected" : ""
                              }`}
                              onClick={() => toggleSlot(index)}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <div className="ModlslotBtn">
                    <Button onClick={closeModal}> Cancel </Button>
                    <Button className="active" onClick={handleSlotes}>
                      {" "}
                      <BsPatchCheck /> Save Changes{" "}
                    </Button>
                  </div>
                </Modal.Footer>
              </Modal>
            </div>

            <div className="overviewitem">
              <BoxDiv
                boximg={`${import.meta.env.VITE_BASE_IMAGE_URL}/box1.png`}
                ovradcls="chillibg"
                ovrtxt="Appointments"
                spanText="(Last 7 days)"
                boxcoltext="ciltext"
                overnumb={Last_7DaysCounts.totalAppointments}
              />
              <BoxDiv
                boximg={`${import.meta.env.VITE_BASE_IMAGE_URL}/box7.png`}
                ovradcls="purple"
                ovrtxt="Assessments"
                spanText="(Last 7 days)"
                boxcoltext="purpletext"
                overnumb="04"
              />
              <BoxDiv
                boximg={`${import.meta.env.VITE_BASE_IMAGE_URL}/box8.png`}
                ovradcls=" cambrageblue"
                ovrtxt="Reviews"
                boxcoltext="greentext"
                overnumb={Last_7DaysCounts.totalRating}
              />
            </div>
          </div>
          <div>
            <DivHeading
              TableHead="New Appointments"
              tablespan={`(${total ? total : 0})`}
            />
            <ActionsTable
              onClick={getAllAppointments}
              appointments={allAppointments}
              actimg1={`${import.meta.env.VITE_BASE_IMAGE_URL}/acpt.png`}
              actimg2={`${import.meta.env.VITE_BASE_IMAGE_URL}/decline.png`}
              onClicked={AppointmentActions}
            />
            {/* <SeeAll seehrf="/appointment" seetext="See All" /> */}
          </div>
          <div>
            <DivHeading TableHead="Upcoming Assessments" tablespan="(3)" />
            <StatusTable />
          </div>
          <div className="ReviewsDiv">
            <DashHeadtext htxt="Reviews " hspan="(24)" />
            <div className="ReviewPading">
              <div className="ReviewsData">
                {feedbacks?.slice(0, 3).map((feedback) => (
                  <ReviewCard
                    key={feedback._id}
                    Revimg={feedback.image}
                    Revname={feedback.name}
                    Revpetname={feedback.PetName}
                    Revdate={feedback.date}
                    rating={feedback.rating}
                    Revpara1={feedback.feedback}
                    isNew={feedback.status === "New" ? feedback.status : ""}
                  />
                ))}
              </div>
              {!showMore && (
                <div className="show-more">
                  <Link to="#" onClick={handleShowMore}>
                    View More
                  </Link>
                </div>
              )}
              {showMore && (
                <div className="ReviewsData">
                  <ReviewCard
                    Revimg={`${import.meta.env.VITE_BASE_IMAGE_URL}/review1.png`}
                    Revname="Sky B"
                    Revpetname="Kizie"
                    Revdate="25 August 2024"
                    rating="5.0"
                    Revpara1="We are very happy with the services so far. Dr. Brown has been extremely thorough and generous with his time and explaining everything to us. When one is dealing with serious health issues it makes a huge difference to understand what's going on and know that the health providers are doing their best. Thanks!"
                  />
                  <ReviewCard
                    Revimg={`${import.meta.env.VITE_BASE_IMAGE_URL}/review2.png`}
                    Revname="Pika"
                    Revpetname="Oscar"
                    Revdate="30 August 2024"
                    rating="4.7"
                    Revpara1="Dr. Brown, the Gastroenterology Specialist was very thorough with Oscar. Zoey was pre diabetic so Doc changed her meds from Prednisolone to Budesonide. In 5 days, Oscar’s glucose numbers were lower and in normal range. We are staying with Dr. Brown as Oscar’s vet as I don’t feel any anxiety dealing with Oscar’s illness now."
                  />
                  <ReviewCard
                    Revimg={`${import.meta.env.VITE_BASE_IMAGE_URL}/review3.png`}
                    Revname="Henry C"
                    Revpetname="Kizie"
                    Revdate="15 August 2024"
                    rating="4.9"
                    Revpara1="SFAMC and Dr. Brown in particular are the very best veterinary professionals I have ever encountered. The clinic is open 24 hours a day in case of an emergency, and is clean and well staffed."
                    Revpara2="Dr Brown is a compassionate veterinarian with both my horse and myself, listens and responds to my questions, and her mere pre.."
                  />
                  <div className="show-more">
                    <Link to="#" onClick={handleShowLess}>
                      View less
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctor_Dashboard;

ReviewCard.propTypes = {
  isNew: PropTypes.string.isRequired,
  Revimg: PropTypes.string.isRequired,
  Revname: PropTypes.string.isRequired,
  Revpetname: PropTypes.string.isRequired,
  Revdate: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  Revpara1: PropTypes.string.isRequired,
  Revpara2: PropTypes.string.isRequired,
};
function ReviewCard({
  Revimg,
  isNew,
  Revname,
  Revpetname,
  Revdate,
  rating,
  Revpara1,
  Revpara2,
}) {
  return (
    <div className="Reviewcard">
      <div className="Reviwtop">
        <img src={Revimg} alt="review" />
        <div className="rbtext">
          <h6>{Revname}</h6>
          <p>
            <img
              src={`${import.meta.env.VITE_BASE_IMAGE_URL}/reviw.png`}
              alt="reviw"
            />{" "}
            {Revpetname}
          </p>
        </div>
      </div>
      <div className="Reviwmid">
        <h6>{Revdate}</h6>
        <span>
          <i className="ri-star-fill"></i> {rating}
        </span>
      </div>

      <div className="reviwEnd">
        <p>
          {Revpara1} {Revpara2 && <p>{Revpara2}</p>}{" "}
        </p>
      </div>

      {isNew && (
        <span className="new-badge">
          <i className="ri-flashlight-fill"></i> New
        </span>
      )}
    </div>
  );
}

// Heading Text
DashHeadtext.propTypes = {
  htxt: PropTypes.string.isRequired,
  hspan: PropTypes.string.isRequired,
};
export function DashHeadtext({ htxt, hspan }) {
  return (
    <div className="DashHeading">
      <h5>
        {htxt} {hspan && <span>{hspan}</span>}
      </h5>
    </div>
  );
}
