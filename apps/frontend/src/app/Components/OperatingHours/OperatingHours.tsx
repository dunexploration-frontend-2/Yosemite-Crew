import React, { useState, useEffect } from "react";
import "./OperatingHours.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
// import DynamicSelect from "../DynamicSelect/DynamicSelect";

export type Time = {
  hour: string;
  minute: string;
  period: "AM" | "PM";
};

export type TimeSlot = {
  from: Time;
  to: Time;
};

export type DayHours = {
  day: string;
  times: TimeSlot[];
  checked: boolean;
};

export type Option = {
  value: string;
  label: string;
};

export type OperatingHoursProps = {
  onSave?: (hours: DayHours[]) => void;
  // onChange?: (duration: string) => void;
  value?: DayHours[];
  // Timeduration: string;
};

const defaultDays: DayHours[] = [
  { day: "Monday", times: [{ from: { hour: "8", minute: "30", period: "AM" }, to: { hour: "11", minute: "00", period: "AM" } }], checked: true },
  { day: "Tuesday", times: [{ from: { hour: "10", minute: "00", period: "AM" }, to: { hour: "5", minute: "00", period: "PM" } }], checked: true },
  { day: "Wednesday", times: [{ from: { hour: "10", minute: "00", period: "AM" }, to: { hour: "5", minute: "30", period: "PM" } }], checked: true },
  { day: "Thursday", times: [{ from: { hour: "10", minute: "00", period: "AM" }, to: { hour: "5", minute: "30", period: "PM" } }], checked: true },
  { day: "Friday", times: [{ from: { hour: "10", minute: "00", period: "AM" }, to: { hour: "5", minute: "30", period: "PM" } }], checked: true },
  { day: "Saturday", times: [{ from: { hour: "8", minute: "30", period: "AM" }, to: { hour: "11", minute: "00", period: "AM" } }], checked: true },
  { day: "Sunday", times: [{ from: { hour: "", minute: "", period: "AM" }, to: { hour: "", minute: "", period: "AM" } }], checked: false },
];

// const durations: Option[] = [
//   { value: "15 min", label: "15 minutes" },
//   { value: "30 min", label: "30 minutes" },
//   { value: "45 min", label: "45 minutes" },
//   { value: "60 min", label: "60 minutes" },
// ];

const OperatingHours: React.FC<OperatingHoursProps> = ({ onSave,   value }) => {
  const [hours, setHours] = useState<DayHours[]>([]);
  // const [duration, setDuration] = useState<string>(Timeduration);

  // Initialize hours with value or fallback to default

  console.log("value",value)
  useEffect(() => {
    const updated = defaultDays.map((defaultDay) => {
      const matched = value?.find((v) => v.day === defaultDay.day);

      if (matched) {
        return {
          day: matched.day,
          times: matched.times.map(({ from, to }) => ({ from, to })),
          checked: true,
        };
      } else {
        return { ...defaultDay, checked: false };
      }
    });

    setHours(updated);
  }, [value]);

  // Sync duration from props initially
  // useEffect(() => {
  //   if (Timeduration !== duration) {
  //     setDuration(Timeduration);
  //   }
  // }, [Timeduration]);

  // Save operating hours on change
  useEffect(() => {
    if (onSave) {
      const checkedDays = hours.filter((day) => day.checked);
      onSave(checkedDays);
    }
  }, [hours, onSave]);

  const handleCheckboxChange = (index: number) => {
    setHours((prev) =>
      prev.map((hour, i) =>
        i === index ? { ...hour, checked: !hour.checked } : hour
      )
    );
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    setHours((prev) =>
      prev.map((hour, i) =>
        i === dayIndex
          ? {
              ...hour,
              times: [...hour.times, { from: { hour: "", minute: "", period: "AM" }, to: { hour: "", minute: "", period: "AM" } }],
            }
          : hour
      )
    );
  };

  const handleRemoveTimeSlot = (dayIndex: number, timeIndex: number) => {
    setHours((prev) =>
      prev.map((hour, i) =>
        i === dayIndex
          ? { ...hour, times: hour.times.filter((_, idx) => idx !== timeIndex) }
          : hour
      )
    );
  };

  const handleTimeChange = (
    dayIndex: number,
    timeIndex: number,
    type: "from" | "to",
    field: keyof Time,
    value: string
  ) => {
    setHours((prev) =>
      prev.map((hour, i) =>
        i === dayIndex
          ? {
              ...hour,
              times: hour.times.map((time, idx) =>
                idx === timeIndex
                  ? { ...time, [type]: { ...time[type], [field]: value } }
                  : time
              ),
            }
          : hour
      )
    );
  };

  return (
    <div className="ss">
      <h6>Availability</h6>
      <div className="ss">
        {/* <div className="s">
          <h4>Set Appointment Duration</h4>
          <p>Set the default time for appointments.</p>
        </div> */}
        {/* <div className="s">
          <DynamicSelect
            options={durations}
            value={duration}
            onChange={(val: string) => {
              setDuration(val);
              onChange?.(val); // Trigger only on user change
            }}
            inname="duration"
          />
        </div> */}
      </div>

      <div className="operating-hours">
        <div className="Hours_List">
          <div className="TopHoursTitle">
            <p>Days</p>
            <p>From</p>
            <p>To</p>
            <p></p>
          </div>

          {hours.map((hour, dayIndex) => (
            <div className="DaysRow" key={hour.day}>
              <div className="day_checkbox">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={hour.checked}
                  onChange={() => handleCheckboxChange(dayIndex)}
                />
                <label>{hour.day}</label>
              </div>

              <div className="from-section">
                {hour.times.map((time, timeIndex) => (
                  <div key={timeIndex} className="time-slot">
                    <input
                      type="text"
                      value={time.from.hour}
                      placeholder="HH"
                      onChange={(e) =>
                        handleTimeChange(dayIndex, timeIndex, "from", "hour", e.target.value)
                      }
                    />
                    :
                    <input
                      type="text"
                      value={time.from.minute}
                      placeholder="MM"
                      onChange={(e) =>
                        handleTimeChange(dayIndex, timeIndex, "from", "minute", e.target.value)
                      }
                    />
                    <div className="TimeRadioGroup">
                      <label>
                        <input
                          type="radio"
                          name={`from-period-${dayIndex}-${timeIndex}`}
                          checked={time.from.period === "AM"}
                          onChange={() =>
                            handleTimeChange(dayIndex, timeIndex, "from", "period", "AM")
                          }
                        />
                        AM
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`from-period-${dayIndex}-${timeIndex}`}
                          checked={time.from.period === "PM"}
                          onChange={() =>
                            handleTimeChange(dayIndex, timeIndex, "from", "period", "PM")
                          }
                        />
                        PM
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="to-section">
                {hour.times.map((time, timeIndex) => (
                  <div key={timeIndex} className="time-slot">
                    <input
                      type="text"
                      value={time.to.hour}
                      placeholder="HH"
                      onChange={(e) =>
                        handleTimeChange(dayIndex, timeIndex, "to", "hour", e.target.value)
                      }
                    />
                    :
                    <input
                      type="text"
                      value={time.to.minute}
                      placeholder="MM"
                      onChange={(e) =>
                        handleTimeChange(dayIndex, timeIndex, "to", "minute", e.target.value)
                      }
                    />
                    <div className="TimeRadioGroup">
                      <label>
                        <input
                          type="radio"
                          name={`to-period-${dayIndex}-${timeIndex}`}
                          checked={time.to.period === "AM"}
                          onChange={() =>
                            handleTimeChange(dayIndex, timeIndex, "to", "period", "AM")
                          }
                        />
                        AM
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`to-period-${dayIndex}-${timeIndex}`}
                          checked={time.to.period === "PM"}
                          onChange={() =>
                            handleTimeChange(dayIndex, timeIndex, "to", "period", "PM")
                          }
                        />
                        PM
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="actions-section">
                {hour.times.map((_, timeIndex) => (
                  <div key={timeIndex} className="action-buttons">
                    {hour.times.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveTimeSlot(dayIndex, timeIndex)}
                      >
                        <RiDeleteBin6Line />
                      </button>
                    )}
                    {timeIndex === hour.times.length - 1 && (
                      <button
                        type="button"
                        className="add-btn"
                        onClick={() => handleAddTimeSlot(dayIndex)}
                      >
                        <IoAddCircleOutline />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatingHours;
