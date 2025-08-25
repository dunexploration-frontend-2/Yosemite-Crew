import React, { useState } from 'react';
import './SignUp.css';
import PropTypes from 'prop-types';
import { MainBtn } from '../Appointment/page';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Container, Form } from 'react-bootstrap';
import axios from 'axios';
// import { useAuth } from '../../context/useAuth';

function SignOtp({ show, onHide, email }) {
  // const { initializeUser } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // console.log('email', email);
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.includes('')) {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Please enter the full OTP',
      });
      return;
    }
    console.log(
      `${import.meta.env.VITE_BASE_URL}api/auth/verifyUser`,
      email
    );
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/auth/verifyUser`,
        { email, otp: otp.join('') }
      );

      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `${response.data.message}`,
        });
        onHide();
        console.log('response', response.data.token);
        sessionStorage.setItem('token', response.data.token);
        // initializeUser();
        navigate('/signupdetails', {
          state: { cognitoId: response.data.cognitoId },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `OTP verification failed: ${
          error.response?.data.message || 'Unable to connect to the server.'
        }`,
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Body>
        <div className="SignIninner">
          <div className="signhed">
            <h2>
              <span>Verify</span> Code
            </h2>
            <p>
              Enter the code sent to your email to proceed with resetting your
              password.
            </p>
          </div>

          <Form>
            <div className="verifyInput">
              {otp.map((digit, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={digit}
                  id={`otp-input-${index}`}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength="1"
                />
              ))}
            </div>

            <div className="sinbtn">
              <MainBtn btext="Verify Code" onClick={handleVerifyOtp} />
              <h6>
                Didn’t receive the code?{' '}
                <Link to="/signup">Request New Code.</Link>
              </h6>
            </div>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const SignUp = () => {
  // types of business

  const [selectedType, setSelectedType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const businessTypes = [
    'Hospital',
    'Clinic',
    'Breeding facility',
    'Pet Sitter',
    'Groomer Shop',
  ];

  const handleSelectType = (type) => {
    setSelectedType(type);
  };
  const [modalShow, setModalShow] = React.useState(false);
  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match!',
        text: 'Please make sure both passwords are the same.',
      });
      return;
    }

    let formData = {
      email,
      password,
      businessType: selectedType,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          // credentials: "include", // Important to include credentials (cookies)
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Successfully signed up!',
          text: `${data.message}`,
        });
        setModalShow(true);
      } else if (response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'You are already signup',
          text: `${data.message}`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Something went wrong.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Sign Up failed: Unable to connect to the server.',
      });
    }
  };

  return (
    <section className="SignUpSec" style={{"--dynamic-bg-image": `url(${import.meta.env.VITE_BASE_IMAGE_URL}/Signupbg.jpg)`,}}>
      <Container>

        <div className="SignupData">

          <div className="SignUpText">
            <h1> <span>Join the Future</span> of <br /> Veterinary Practice <br />{' '} Management </h1>
            <p> Streamline your operations, improve patient care, and grow your practice with our comprehensive PIMS. </p>
          </div>

          <div className="SignUpFormDiv">
            <Form onSubmit={handleSubmit}>
              <div className="TopSignUp">

                <HeadText Spntext="Sign up" blktext="now" />

                <div className="SignFormItems">
                  <Forminput inlabel="Email Address" intype="text" inname="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} />

                  <div className="pasdiv">
                    <FormPassw paswlabel="Password" intype="password" inname="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                    <p>Password must be at least 8 characters long, including an uppercase letter, a number, and a special character. </p>
                  </div>

                  <FormPassw paswlabel="Confirm Password" intype="password" inname="confirmPassword" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>

                <div className="business-type-container">
                  <p>Select Your Business Type</p>
                  <div className="button-group">
                    <ul>
                      {businessTypes.map((type) => (
                        <li key={type} className={`business-button ${ selectedType === type ? 'selected' : ''  }`} onClick={() => handleSelectType(type)} >
                          {type}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              <div className="Sign_check">
                <Form.Check type="checkbox"  label={
                  <>
                    <p>I agree to Yosemite Crew’s <span>Terms and Conditions</span>{' '}
                      and <span>Privacy Policy</span></p>
                  </> } />
              </div>

              <div className="sinbtn">
                <MainBtn
                  btntyp="submit"
                  bimg={`${import.meta.env.VITE_BASE_IMAGE_URL}/whtcheck.png`}
                  btext="Sign Up"
                  // onClick={handleSubmit}
                />
                <h6> Already have an account? <Link to="/signin">Login</Link></h6>
              </div>

              <SignOtp
                show={modalShow}
                onHide={() => setModalShow(false)}
                email={email}
              />
            </Form>
          </div>

        </div>

      </Container>
    </section>
  );
};

export default SignUp;

// form input
Forminput.propTypes = {
  inlabel: PropTypes.string.isRequired,
  intype: PropTypes.string.isRequired,
  inname: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool, // Add this line
};
export function Forminput({
  inlabel,
  intype,
  inname,
  value,
  onChange,
  readOnly,
}) {
  return (
    <div className="signup__field">
      <input
        className="signup__input"
        type={intype}
        name={inname}
        id={inname}
        value={value??""}
        onChange={onChange}
        readOnly={readOnly} // Add this line
        required
      />
      <label className="signup__label" htmlFor={inname}>
        {inlabel}
      </label>
    </div>
    
  );
}

FormPassw.propTypes = {
  paswlabel: PropTypes.string.isRequired,
  intype: PropTypes.string.isRequired,
  inname: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export function FormPassw({ paswlabel, intype, inname, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup__field passfield">
      <input
        className="signup__input"
        type={showPassword ? 'text' : intype} // Toggle between 'text' and original input type
        name={inname}
        id={inname}
        value={value??""}
        onChange={onChange}
        required
      />
      <label className="signup__label" htmlFor={inname}>
        {paswlabel}
      </label>
      <Link type="button" onClick={togglePasswordVisibility}>
        <img src={`${import.meta.env.VITE_BASE_IMAGE_URL}/eys.png`} alt="eyes" />
      </Link>
    </div>
  );
}



// headtext
HeadText.propTypes = {
  Spntext: PropTypes.string.isRequired,
  blktext: PropTypes.string.isRequired,
};
export function HeadText({ Spntext, blktext }) {
  return (
    <div className="Headingtext">
      <h2> <span>{Spntext}</span> {blktext} </h2>
    </div>
  );
}
