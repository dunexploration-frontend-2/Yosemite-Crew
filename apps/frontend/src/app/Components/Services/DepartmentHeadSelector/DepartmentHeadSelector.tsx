import React, { useCallback, useEffect, useMemo, useState} from 'react';
import './DepartmentHeadSelector.css';
import { Form } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";
import Image from 'next/image';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';

interface DepartmentHead {
  code: string;
  name: string;
  image: string;
}

interface Props {
  onSelectHead: (code: string) => void;
}

const departmentHeadsList = [
  { code: "E001", name: 'Dr. Sarah Mitchell', image: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'  },
  { code: "E001", name: 'Dr. James Carter',   image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { code: "E001", name: 'Dr. Laura Bennett', image: 'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { code: "E001", name: 'Dr. Michael Green', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { code: "E001", name: 'Dr. Emily Turner', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const DepartmentHeadSelector: React.FC<Props> = ({ onSelectHead }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedHead, setSelectedHead] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredHeads = useMemo(() =>
    departmentHeadsList.filter((head) =>
      head.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]
  );

  const handleSelectHead = useCallback((head: DepartmentHead) => {
    setSelectedHead(head.name);
    onSelectHead(head.code); // ✅ send back code
  }, [onSelectHead]);

  return (
    <div className="Departservices_dropdown">
      <div
        className={`ServHeadr ${isDropdownOpen ? "open" : ""}`}
        onClick={toggleDropdown}
      >
        <span>Department Head</span>
        <span className="arrow">
          {isDropdownOpen ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
        </span>
      </div>

      {isDropdownOpen && (
        <div className="ServDropcontent">
          <div className="serchbtn">
            <IoSearchOutline size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <ul className="services-list">
            {filteredHeads.map((head) => (
              <li
                key={head.code + head.name}
                className={`service-item ${selectedHead === head.name ? "selected" : ""}`}
              >
                <label>
                  <div className="doctimg">
                    <Image aria-hidden src={head.image} alt={head.name} width={40} height={40} />
                    <p>{head.name}</p>
                  </div>
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={selectedHead === head.name}
                    onChange={() => handleSelectHead(head)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DepartmentHeadSelector;
