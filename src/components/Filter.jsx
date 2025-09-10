import React, { useState, useEffect, useRef } from "react";
import { Offcanvas, Form, Dropdown, Button } from "react-bootstrap";
import { Sliders } from "react-bootstrap-icons";
import { useSearchContext } from "../contexts/SearchContext";

const Filter = ({
  show,
  handleClose,
<<<<<<< HEAD

  // testimonyCnt,
  // fuzzyTranscripts,
  // fuzzyWitnesses,
  // sendSearchCToParent,
  // sendSearchBToParent,
=======
  sendTranscriptToParent,
  sendWitnessToParent,
  sendWitnessTypeToParent,
  totalCount,
  fuzzyTranscripts,
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
}) => {
  const {
    searchA,
    setSearchA,
    selectedWitness,
    setSelectedWitness,
    selectedTranscripts,
    setSelectedTranscripts,
    selectedWitnessType,
    setSelectedWitnessType,
    fuzzyTranscripts,
    setFuzzyTranscripts,
    fuzzyWitnesses,
    setFuzzyWitnesses,
  } = useSearchContext();
  const didMountTranscript = useRef(false);
  const didMountWitness = useRef(false);
  const didMountType = useRef(false);

  const didInit = useRef(false);

  const [transcript, setTranscript] = useState([]);
  const [witness, setWitness] = useState([]);
  const [witnessType, setWitnessType] = useState([]);
  const [witnessAlignment, setWitnessAlignment] = useState([]);
  // const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  // const [selectedWitnesses, setSelectedWitnesses] = useState([]);
  const [selectedAlignments, setSelectedAlignments] = useState([]);
  const [selectedWitnessTypes, setSelectedWitnessTypes] = useState([]);
  const handleReset = () => {
    setSelectedWitness([]);
    setSelectedTranscripts([]);
  };

<<<<<<< HEAD
=======
  const fetchWitness = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness/`
      );
      const data = await res.json();
      setWitness(data.witnesses);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchWitnessType = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness-type/`
      );
      const data = await res.json();
      setWitnessType(data.witnesses);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchWitnessAlignment = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness-alignment/`
      );
      const data = await res.json();
      setWitnessAlighment(data.witnesses);
    } catch (err) {
      console.error(err.message);
    }
  };

>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transcripts, witnesses, types, alignments] = await Promise.all([
          fetch(`${process.env.REACT_APP_PROD_API_URL}/api/transcript/`).then(
            (res) => res.json()
          ),
          fetch(`${process.env.REACT_APP_PROD_API_URL}/api/witness/`).then(
            (res) => res.json()
          ),
          fetch(`${process.env.REACT_APP_PROD_API_URL}/api/witness-type/`).then(
            (res) => res.json()
          ),
          fetch(
            `${process.env.REACT_APP_PROD_API_URL}/api/witness-alignment/`
          ).then((res) => res.json()),
        ]);

        setTranscript(transcripts.transcripts);
        setWitness(witnesses.witnesses);
        setWitnessType(types.witnesses);
        setWitnessAlignment(alignments.witnesses);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      }
    };

    fetchData();
  }, []);

<<<<<<< HEAD
=======
  // Deduplicate by name
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
  const uniqueTranscripts = Array.from(
    new Map(transcript.map((item) => [item.name, item])).values()
  );
  const uniqueWitnesses = Array.from(
    new Map(witness.map((item) => [item.fullname, item])).values()
  );

<<<<<<< HEAD
  // useEffect(() => {
  //   if (didMountTranscript.current) {
  //     sendTranscriptToParent?.(selectedTranscripts);
  //   } else {
  //     didMountTranscript.current = true;
  //   }
  // }, [selectedTranscripts]);
=======
  // Send to parent on change
  useEffect(() => {
    if (typeof sendTranscriptToParent === "function") {
      sendTranscriptToParent(selectedTranscripts);
    }
  }, [selectedTranscripts]);

  useEffect(() => {
    setSelectedTranscripts(fuzzyTranscripts);
  }, [fuzzyTranscripts]);

  useEffect(() => {
    if (typeof sendWitnessToParent === "function") {
      sendWitnessToParent(selectedWitnesses); // ✅ Will run on every change
    }
  }, [selectedWitnesses]);
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998

  useEffect(() => {
    setSelectedTranscripts(fuzzyTranscripts);
  }, [fuzzyTranscripts]);

  // useEffect(() => {
  //   if (didMountWitness.current) {
  //     sendWitnessToParent?.(selectedWitness);
  //   } else {
  //     didMountWitness.current = true;
  //   }
  // }, [selectedWitness]);

  useEffect(() => {
    setSelectedWitness(fuzzyWitnesses);
  }, [fuzzyWitnesses]);
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }

    setSelectedTranscripts(fuzzyTranscripts);
  }, [fuzzyTranscripts]);

  // useEffect(() => {
  //   if (didMountType.current) {
  //     sendWitnessTypeToParent?.(selectedWitnessTypes);
  //   } else {
  //     didMountType.current = true;
  //   }
  // }, [selectedWitnessTypes]);

  const handleTranscriptCheck = (option) => {
    setSelectedTranscripts((prev) =>
      prev.includes(option.name)
        ? prev.filter((name) => name !== option.name)
        : [...prev, option.name]
    );
    // sendSearchCToParent("");
  };

<<<<<<< HEAD
  const handleWitnessCheck = (option) => {
    const fullName = option.fullname;
    setSelectedWitness((prev) =>
      prev.includes(fullName)
        ? prev.filter((name) => name !== fullName)
        : [...prev, fullName]
    );
    // sendSearchBToParent("");
=======
  // Store only witness full names (string)
  const handleWitnessCheck = (option) => {
    const fullName = option.fullname;
    setSelectedWitnesses((prev) => {
      const updated = prev.includes(fullName)
        ? prev.filter((name) => name !== fullName)
        : [...prev, fullName];

      return updated;
    });
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
  };

  const handleAlignmentChange = (alignment) => {
    setSelectedAlignments((prev) =>
      prev.includes(alignment)
        ? prev.filter((item) => item !== alignment)
        : [...prev, alignment]
    );
  };

  const handleWitnessTypeChange = (type) => {
    setSelectedWitnessTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="fw-semibold">
          <Sliders className="me-2" /> Filter Options
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bg-light">
        <div className="filter-sorath-card">
          {/* Transcript Filter */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Transcript</Form.Label>
            <Dropdown className="w-100">
              <Dropdown.Toggle
                variant="light"
                className="w-100 text-start border rounded-2"
              >
                {selectedTranscripts.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
                    {selectedTranscripts.map((name, idx) => (
<<<<<<< HEAD
                      <span key={idx} className="badge bg-primary">
=======
                      <span
                        key={idx}
                        className="badge bg-primary text-truncate"
                        title={name}
                        style={{
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Select transcript(s)"
                )}
              </Dropdown.Toggle>
<<<<<<< HEAD
=======

>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
              <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                {uniqueTranscripts.map((option) => (
                  <Form.Check
                    key={option.id}
                    type="checkbox"
<<<<<<< HEAD
                    label={option.name}
                    className="px-3 py-1"
                    style={{ whiteSpace: "nowrap" }}
                    checked={selectedTranscripts.includes(option.name)}
                    onChange={() => handleTranscriptCheck(option)}
                    onClick={(e) => e.stopPropagation()} // 🔒 Prevent dropdown from closing
=======
                    className="px-3 py-1"
                    checked={selectedTranscripts.includes(option.name)}
                    onChange={() => handleTranscriptCheck(option)}
                    label={
                      <span
                        title={option.name}
                        className="d-inline-block text-truncate"
                        style={{
                          maxWidth: "240px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {option.name}
                      </span>
                    }
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {/* Witness Filter */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Witness</Form.Label>
            <Dropdown className="w-100">
              <Dropdown.Toggle
                variant="light"
                className="w-100 text-start border rounded-2"
              >
                {selectedWitness.length > 0 ? (
                  <div className="d-flex flex-wrap gap-1">
<<<<<<< HEAD
                    {selectedWitness.map((name, idx) => (
                      <span key={idx} className="badge bg-success">
=======
                    {selectedWitnesses.map((name, idx) => (
                      <span
                        key={idx}
                        className="badge bg-success text-truncate"
                        title={name}
                        style={{
                          maxWidth: "160px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Select witness(es)"
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                {uniqueWitnesses.map((option) => (
                  <Form.Check
                    key={option.id}
                    type="checkbox"
                    className="px-3 py-1"
                    checked={selectedWitness.includes(option.fullname)}
                    onChange={() => handleWitnessCheck(option)}
                    label={
                      <span
                        title={option.fullname}
                        className="d-inline-block text-truncate"
                        style={{
                          maxWidth: "240px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {option.fullname}
                      </span>
                    }
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          {/* Witness Alignment */}
          {/* <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Witness Alignment</Form.Label>
            <div className="d-flex flex-wrap gap-3 ps-1">
              {witnessAlignment.map((alignment) => (
                <Form.Check
                  key={alignment.alignment}
                  type="checkbox"
                  label={alignment.alignment}
                  value={alignment.alignment}
                  checked={selectedAlignments.includes(alignment.alignment)}
                  onChange={() => handleAlignmentChange(alignment.alignment)}
                />
              ))}
            </div>
          </Form.Group> */}

          {/* Witness Type */}
          {/* <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Witness Type</Form.Label>
            <div className="d-flex flex-wrap gap-3 ps-1">
              {witnessType.map((typeObj) => (
                <Form.Check
                  key={typeObj.type}
                  type="checkbox"
                  label={typeObj.type}
                  value={typeObj.type}
                  checked={selectedWitnessTypes.includes(typeObj.type)}
                  onChange={() => handleWitnessTypeChange(typeObj.type)}
                />
              ))}
            </div>
          </Form.Group> */}

          {/* Testimony Count */}
<<<<<<< HEAD
          {/* <div className="bg-primary text-white text-center py-3 px-2 rounded-3"> */}
          {/* <h5 className="mb-1 fw-bold">Testimony Count</h5> */}
          {/* <h5 className=" mb-0">{testimonyCnt}</h5> */}
          {/* </div> */}
=======
          {/* <div className="bg-primary text-white text-center py-3 px-2 rounded-3">
            <h5 className="mb-1 fw-bold">Testimony Count</h5>
            <h5 className=" mb-0">{totalCount}</h5>
          </div> */}
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
<<<<<<< HEAD
            <Button variant="primary" onClick={handleReset}>
              Reset
=======
            <Button className="btn-sorath-main" onClick={handleClose}>
              Apply Filters
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Filter;
