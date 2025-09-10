import React, { useEffect, useState, useRef } from "react";
import { Collapse } from "react-bootstrap";
import axios from "axios";
import { FiFilter, FiSearch } from "react-icons/fi";
import {
  Container,
  Table,
  Form,
  Button,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownButton,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import Filter from "../../components/Filter";
import CommentSidebar from "../../components/Comment";
import BASE_URL from "../../api";
import { FaCommentAlt } from "react-icons/fa";
import Comments from "../../components/Comments";
import { useSearchContext } from "../../contexts/SearchContext";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ClipLoader from "react-spinners/ClipLoader";

const TestimonySearchPage = () => {
  const {
    searchA,
    searchB,
    searchC,
    searchAType,
    searchBType,
    searchCType,
    setSearchA,
    setSearchB,
    setSearchC,
    setSearchAType,
    setSearchBType,
    setSearchCType,
    selectedWitness,
    selectedTranscripts,
    selectedWitnessType,
    fuzzyTranscripts,
    fuzzyWitnesses,
    setFuzzyTranscripts,
    setFuzzyWitnesses,
  } = useSearchContext();
  const [offset, setOffset] = useState(0);
  const rowsPerPage = 100;
  const [limit] = useState(100); // batch size
  const [hasMore, setHasMore] = useState(true); // stop when no more data
  const [sources, setSources] = useState(["default", "farrar"]);
  // Help modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [testimonyId, setTestimonyId] = useState();
  const databases = [
    "DocsSHBLaguenesse",
    "DocsSHBPMProctor",
    "DocsSHBPMCummings",
    "DocsSHBPMRuckdeschel",
    "DocsSHBPMProchaska",
  ];
  // const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  // const [fuzzyTranscripts, setFuzzyTranscripts] = useState([]);
  // const [fuzzyWitnesses, setFuzzyWitnesses] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const handleTranscriptFromChild = (data) => {
    setSelectedTranscripts(data);
  };

  const handleSearchCFromChild = (data) => {
    setSearchC(data);
  };

  const handleSearchBFromChild = (data) => {
    setSearchB(data);
  };
  // const [selectedWitness, setSelectedWitness] = useState([]);

  const initials = getInitials(name);

    function getInitials(name) {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    const firstInitial = words[0]?.[0] || "";
    const secondInitial = words[1]?.[0] || "";
    return (firstInitial + secondInitial).toUpperCase();
  }

  const handleWitnessFromChild = (data) => {
    setSelectedWitness(data);
  };

<<<<<<< HEAD
  const handleDbChange = (data) => {
    setSelectedDatabases(data);
  };

  const handleDownloadExcel = async () => {
    try {
      // Load template
      const response = await fetch("/template.xlsx");
      const buffer = await response.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];

      // Fill data
      qaPairs.forEach((row, index) => {
        const rowIndex = index + 2;

        worksheet.getCell(`A${rowIndex}`).value = row.transcript_name || "";
        worksheet.getCell(`B${rowIndex}`).value = row.question || "";
        worksheet.getCell(`C${rowIndex}`).value = row.answer || "";
        worksheet.getCell(`D${rowIndex}`).value = row.cite || "";
      });

      // Adjust column widths based on content
      worksheet.columns.forEach((col) => {
        let maxLength = 10; // minimum width
        col.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          if (cellValue.length > maxLength) {
            maxLength = cellValue.length;
          }
        });
        col.width = maxLength + 2; // add padding
      });

      // Save file
      const excelBuffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([excelBuffer]), "testimnony_pairs.xlsx");
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  // const [selectedWitnessType, setSelectedWitnessType] = useState([]);
=======
  const [selectedWitnessType, setSelectedWitnessType] = useState([]);
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998

  const handleWitnessTypeFromChild = (data) => {
    setSelectedWitnessType(data);
  };
  const [loading, setLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [filenameCnt, setFilenameCnt] = useState(0);
  const [witnessNameCnt, setWitnessNameCnt] = useState(0);

  const [initialTestimonyCnt, setInitialTestimonyCnt] = useState(0);
  const [testimonyCnt, setTestimonyCnt] = useState(0);
  const [showInitialTestimonyCnt, setShowInitialTestimonyCnt] = useState(true);
  const handleShowFilters = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);
  const handleShowComments = (id) => {
    setTestimonyId(id);
    setShowComments(true);
  };
  const handleCloseComments = () => setShowComments(false);
  const scrollContainerRef = useRef(null);

  const fetchWitness = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/witness/`
      );
      const data = await res.json();
      console.log("witnesses", data.witnesses.length);
      setWitnessNameCnt(data.witnesses.length);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchTranscripts = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PROD_API_URL}/api/transcript/`
      );
      const data = await res.json();
      console.log("witnesses", data.transcripts.length);
      setFilenameCnt(data.transcripts.length);
    } catch (err) {
      console.error(err.message);
    }
  };
  // API call
  const fetchPaginatedData = async (offsetValue = 0) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/`,
        {
          params: {
            offset: offsetValue,
            limit: rowsPerPage,
          },
        }
      );

      // setTestimonyCnt((prev) => prev + res.data.results.length);

      if (res.data.results.length === 0) {
        setHasMore(false);
      } else {
        setQaPairs((prev) => [...prev, ...res.data.results]);
        setInitialTestimonyCnt(res.data.total);
        setShowInitialTestimonyCnt(true);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedData(offset);
    fetchWitness();
    fetchTranscripts();
  }, [offset]);

<<<<<<< HEAD
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      setOffset((prev) => prev + rowsPerPage);
    }
  };
  // useEffect(() => {
  //   fetchPaginatedData(currentPage, rowsPerPage);
  // }, [currentPage, rowsPerPage]);
=======


  // comment sidebar

  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
const [commentSidebarData, setCommentSidebarData] = useState(null);

const handleCommentClick = (rowData) => {
  setCommentSidebarData(rowData);
  setShowCommentSidebar(true);
};

const handleCloseCommentSidebar = () => {
  setShowCommentSidebar(false);
  setCommentSidebarData(null);
};


// end comment sidebar



  const [showSearchSection, setShowSearchSection] = useState(false);
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998

  const [showSearchSection, setShowSearchSection] = useState(true);

  // const [searchA, setSearchA] = useState("");
  // const [searchB, setSearchB] = useState("");
  // const [searchC, setSearchC] = useState("");

  // const [searchAType, setSearchAType] = useState("exact");
  // const [searchBType, setSearchBType] = useState("exact");
  // const [searchCType, setSearchCType] = useState("exact");

  const [appliedSearch, setAppliedSearch] = useState({
    A: "",
    B: "",
    C: "",
    AType: "exact",
    BType: "exact",
    CType: "exact",
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const getFuzzyTranscripts = async (query) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/transcript/get-transcripts/`,
        { transcript_name: query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("namesss", res.data.matching_transcripts);
      setFuzzyTranscripts(res.data.matching_transcripts);
<<<<<<< HEAD
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };
  const getFuzzyWitnesses = async (query) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/transcript/get-witnesses/`,
        { witness_name: query },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("namesss", res.data.matching_witnesses);
      setFilenameCnt(res.data.matching_witnesses);
=======
      console.log("transcript names", res);
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };

<<<<<<< HEAD
  // const handleSearchSubmit = async () => {
  //   setAppliedSearch({
  //     A: searchA,
  //     B: searchB,
  //     C: searchC,
  //     AType: searchAType,
  //     BType: searchBType,
  //     CType: searchCType,
  //   });
  //   console.log("BType", searchBType);
  //   setLoading(true); // start loading spinner

  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
  //       {
  //         q1: searchA,
  //         mode1: searchAType,
  //         q2: searchB,
  //         mode2: searchBType,
  //         q3: searchC,
  //         mode3: searchCType,
  //         witness_names: searchB.trim() ? [searchB.trim()] : [], // ✅ FIXED
  //         transcript_names: searchC.trim() ? [searchC.trim()] : [], // ✅ FIXED
  //       },
  //       {
  //         params: {
  //           page: currentPage,
  //           page_size: rowsPerPage,
  //         },
  //       }
  //     );

  //     // Filename count
  //     const uniqueFilenames = new Set(
  //       res.data.results.map((item) =>
  //         item.transcript_name.trim().toLowerCase()
  //       )
  //     );

  //     const uniqueCount = uniqueFilenames.size;
  //     setTotalCount(res.data.count);
  //     setTestimonyCnt(res.data.count)
  //     // Witness name count
  //     const uniqueWitnessNames = new Set(
  //       res.data.results.map((item) => item.witness_name.trim().toLowerCase())
  //     );
  //     const uniqueWitnessCount = uniqueWitnessNames.size;
  //     setWitnessNameCnt(uniqueWitnessCount);

  //     setQaPairs(res.data.results);
  //     setFilenameCnt(uniqueCount);
  //   } catch (err) {
  //     console.error("Failed to fetch paginated data:", err);
  //   } finally {
  //     setLoading(false);
  //   }

  //   // getFuzzyTranscripts(searchC);
  //   // getFuzzyWitnesses(searchB);
  // };

  const highlightText = (text, keyword) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{ backgroundColor: "yellow", fontWeight: "bold" }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, [
    searchB,
    searchA,
    searchC,
    searchBType,
    searchAType,
    searchCType,
    selectedTranscripts,
    selectedWitness,
  ]);

  const fetchData = async () => {
=======
  const handleSearchSubmit = async (page = 1, pageSize) => {
    setAppliedSearch({
      A: searchA,
      B: searchB,
      C: searchC,
      AType: searchAType,
      BType: searchBType,
      CType: searchCType,
    });

>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
        {
          q1: searchA,
          mode1: searchAType,
          q2: searchB,
          mode2: searchBType,
          q3: searchC,
          mode3: searchCType,
          witness_names: selectedWitness,
          transcript_names: selectedTranscripts,
          witness_types: selectedWitnessType,
          sources: ["farrar", "default"],
        },
        {
          params: {
            page: currentPage,
            page_size: rowsPerPage,
          },
        }
      );

      const results = res.data.results;

      const uniqueFilenames = new Set(
        results.map((item) => item.transcript_name.trim().toLowerCase())
      );
      {
        console.log("uniqueFilenames", uniqueFilenames);
      }
      setFilenameCnt(uniqueFilenames.size);

      const uniqueWitnessNames = new Set(
        results.map((item) => item.witness_name.trim().toLowerCase())
      );
      setWitnessNameCnt(uniqueWitnessNames.size);

      setQaPairs(results);
      setTotalCount(res.data.count);
      setShowInitialTestimonyCnt(false);
      setTestimonyCnt(res.data.count);
    } catch (err) {
      console.error("❌ Failed to fetch paginated data:", err);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const isFirstRender = useRef(true);
=======


  useEffect(() => {
    const fetchData = async () => {
      console.log(selectedWitness.length, "selectedWitness");
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
          {
            q: searchA,
            mode: searchAType,
            witness_names: selectedWitness,
            transcript_names: selectedTranscripts,
            witness_types: selectedWitnessType,
          },
          {
            params: {
              page: currentPage,
              page_size: rowsPerPage,
            },
          }
        );
        setQaPairs(res.data.results);
        setTotalCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch paginated data:", err);
      } finally {
        setLoading(false);
      }
    };

  
    fetchData();
   
  }, [
    selectedTranscripts,
    selectedWitness,
    selectedWitnessType,
    currentPage,
    rowsPerPage,
    searchA,
    searchAType,
  ]);
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998

  const handleResetSearch = () => {
    setSearchA("");
    setSearchB("");
    setSearchC("");
    setSearchAType("exact");
    setSearchBType("exact");
    setSearchCType("exact");
    setAppliedSearch({
      A: "",
      B: "",
      C: "",
      AType: "exact",
      BType: "exact",
      CType: "exact",
    });
    fetchPaginatedData();
  };

  const matchType = (text, query, type) => {
    if (!query) return true;
    text = text.toLowerCase();
    query = query.toLowerCase();
    switch (type) {
      case "Exact":
        return text === query;
      case "Partial":
        return text.includes(query);
      default:
        return true;
    }
  };

  const getColorFromString = (str) => {
    const colors = [
      "#6c63ff",
      "#ff6b6b",
      "#1abc9c",
      "#e67e22",
      "#f39c12",
      "#3498db",
      "#9b59b6",
      "#2ecc71",
      "#e84393",
      "#fd79a8",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  return (
    <Container fluid className=" px-3">
<<<<<<< HEAD
      <Modal show={show} onHide={handleClose} scrollable centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold mb-0">General instructions:</p>
          <p className="mb-2">
            You will need to wait for 2-3 seconds for the search to apply.
          </p>
          <p className="fw-bold mb-1">Searching rules:</p>
          <ol>
            <li className="fw-bold mb-1">Exact search</li>
            <ul>
              <li>
                <p className="mb-1">This will find only "exact" hits.</p>
              </li>
              <li>
                <p className="mb-1">
                  It is not tolerant to{" "}
                  <b>capitalization, spacing or puntuation.</b> This happend in
                  fuzzy search
                </p>
              </li>
              <li>
                <p className="mb-1">
                  It will not find exact hits inside of longer words. That is
                  the behaviour of fuzzy search.
                </p>
              </li>
              <li>
                <p>
                  Wildcards are not permitted. That is available in Boolean
                  search
                </p>
              </li>
            </ul>
            <li className="fw-bold mb-1">Boolean search</li>
            <ul>
              <li>
                <p className="mb-1">
                  If we use <b>AND</b> operator between two words, only those
                  records will be fetched that have both the words
                </p>
                <p>Example: contract AND damages</p>
              </li>
              <li>
                <li>
                  <p className="mb-1">
                    If we use <b>OR</b> operator between two words, those
                    records will be fetched that have either of them or both of
                    the words
                  </p>
                  <p>Example: attorney OR lawyer</p>
                </li>
                <li>
                  <p className="mb-1">
                    If we use <b>NOT</b> operator before a word, those records
                    will be fetched that do not have that word
                  </p>
                  <p>Example: settlement NOT class</p>
                </li>
                <li>
                  <p className="mb-1">
                    Wildcard operator <b>asterisk (*)</b> is allowed.
                  </p>
                  <p>Example: litigat*</p>
                </li>
                <li>
                  <p className="mb-1">
                    <b>Double or single quotes</b> or around the word is
                    allowed.
                  </p>
                  <p>Exapmle: "summary judgment"</p>
                </li>
                <li>
                  <p className="mb-1">
                    <b>Parentheses</b> group logic for clarity
                  </p>
                  <p>Example: (price OR rate) AND fixing</p>
                </li>
              </li>
            </ul>
            <li className="fw-bold mb-1">Fuzzy search</li>
            <ul>
              <li>
                <p className="mb-1">
                  It will match <b>spelling mistakes</b> by 2 characters.
                </p>
              </li>
              <li>
                <p className="mb-1">
                  It is tolerant to{" "}
                  <b>punctuation, capitalization and spacing.</b>
                </p>
              </li>
            </ul>
            <li className="fw-bold mb-1 mt-1">
              Hit count under search options.
            </li>
            <ul>
              <li>
                <p>
                  <b>Search by Filename:</b> Counts the testimony pairs that
                  belong to that specific transcript. It has boolean, fuzzy and
                  exact matching enabled.
                </p>
              </li>
              <li>
                <p>
                  <b>Search by Witness:</b> Counts the testimony pairs that
                  belong to the searched witness. It has boolean, fuzzy and
                  exact matching enabled.
                </p>
              </li>
              <li>
                <p>
                  <b>Search All Testimony:</b> Counts the testimony pairs that
                  belong to the searched keyword. It has boolean, fuzzy and
                  exact matching enabled.
                </p>
              </li>
            </ul>
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className="p-3 show-page-sorath">
        {/* Search & Filter */}
        <Row className="align-items-center">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Database</Form.Label>
              <Dropdown className="w-100">
                <Dropdown.Toggle
                  variant="light"
                  className="w-100 text-start border rounded-2"
                >
                  {selectedDatabases.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {selectedDatabases.map((db, idx) => (
                        <span key={idx} className="badge bg-primary">
                          {db.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "Select Database(s)"
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {databases.map((option) => (
                    <Form.Check
                      key={option.id}
                      type="checkbox"
                      label={option}
                      className="px-3 py-1"
                      style={{ whiteSpace: "nowrap" }}
                      checked={selectedDatabases.some(
                        (db) => db.id === option.id
                      )}
                      onChange={() => handleDbChange(option)}
                      onClick={(e) => e.stopPropagation()} // 🔒 Prevent dropdown from closing
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
          <Col md={6}>
            <div className="d-flex justify-content-end align-items-center">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowSearchSection((prev) => !prev)}
                className="filter-sorath-btn"
              >
                <FiSearch className="filter-sorath" />
              </Button>

=======
      <Card className="p-3 my-2 show-page-sorath">
        {/* Search & Filter */}
        {console.log("tscp[t", fuzzyTranscripts)}

        <Row className="mb-3 align-items-center">
          <Col md={6}>
            
            <h4 className="mb-0">Testimonies</h4>
            {selectedWitness}
          </Col>
          <Col md={6}>
            <div className="left-side-search-filter-button d-flex justify-content-md-end">
              <Button
                size="sm"
                onClick={() => setShowSearchSection((prev) => !prev)}
                className="filter-sorath-btn-color"
              >
                <FiSearch className="filter-sorath" />
              </Button>

>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleShowFilters}
<<<<<<< HEAD
                className="filter-sorath-btn ms-3"
=======
                className="filter-sorath-btn-color ms-3"
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
              >
                <FiFilter className="filter-sorath" />
              </Button>
            </div>
<<<<<<< HEAD
=======
            {selectedWitness}
            <div className="Filter-data-come"></div>
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
          </Col>

          {/* <Col md={6} className="text-end">
            <h5>
              Total Testimonies :{" "}
              <span className="alternate-highlight">{totalCount}</span>
            </h5>
          </Col> */}
        </Row>
        {/* Conditional Search Section */}

        <Collapse in={showSearchSection}>
          <div className="p-3 bg-light rounded border mb-3">
            <Row>
              {/* Search C */}
              <Col md={4}>
                <Form.Label>Search by Filename</Form.Label>
<<<<<<< HEAD
                <div className="d-flex align-items-center gap-3">
                  <Form.Control
                    value={searchC}
                    onChange={(e) => {
                      fetchData();
                      setSearchC(e.target.value);
                    }}
                    placeholder="Search by Filename"
                    className="show-page-sorath"
                  />
                  <div
                    className=""
                    style={{
                      width: "65px",
                      height: "40px",
                      border: "2px solid #11b3ef",
                      borderRadius: "10px",
                      boxShadow: "4px 4px 10px grey", // blue shadow
                      display: "flex", // 🔹 Flexbox to center content
                      justifyContent: "center", // 🔹 Center horizontally
                      alignItems: "center", // 🔹 Center vertically
                      fontWeight: "bold", // Optional: makes number more prominent
                    }}
                  >
                    {filenameCnt}
                  </div>
                </div>

=======
                <Form.Control
                  value={searchC}
                  onChange={(e) => setSearchC(e.target.value)}
                  placeholder="Search by Filename"
                  className="form-sorath-input"
                />
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={`searchC-${opt}`}
                      type="radio"
                      name="searchCType" // ✅ UNIQUE name
                      label={opt}
                      value={opt}
                      checked={searchCType === opt}
                      onChange={(e) => {
                        fetchData();
                        setSearchCType(e.target.value);
                      }}
                    />
                  ))}{" "}
                  <i
                    onClick={handleShow}
                    style={{ cursor: "pointer" }}
                    className="bi bi-question-circle-fill"
                  ></i>{" "}
                </div>
              </Col>
              {/* Search B */}
              <Col md={4}>
                <Form.Label>Search by Witness</Form.Label>
<<<<<<< HEAD
                <div className="d-flex align-items-center gap-3">
                  <Form.Control
                    value={searchB}
                    onChange={(e) => {
                      setSearchB(e.target.value);
                    }}
                    placeholder="Search by Witness"
                    className="show-page-sorath"
                  />
                  <div
                    className=""
                    style={{
                      width: "65px",
                      height: "40px",
                      border: "2px solid #11b3ef",
                      borderRadius: "10px",
                      boxShadow: "4px 4px 10px grey", // blue shadow
                      display: "flex", // 🔹 Flexbox to center content
                      justifyContent: "center", // 🔹 Center horizontally
                      alignItems: "center", // 🔹 Center vertically
                      fontWeight: "bold", // Optional: makes number more prominent
                    }}
                  >
                    {witnessNameCnt}
                  </div>
                </div>

=======
                <Form.Control
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  placeholder="Search by Witness"
                  className="form-sorath-input"
                />
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={`searchB-${opt}`}
                      type="radio"
                      name="searchBType" // ✅ UNIQUE name
                      label={opt}
                      value={opt}
                      checked={searchBType === opt}
                      onChange={(e) => {
                        setSearchBType(e.target.value);

                        // fetchData()
                      }}
                    />
                  ))}{" "}
                  <i
                    onClick={handleShow}
                    style={{ cursor: "pointer" }}
                    className="bi bi-question-circle-fill"
                  ></i>{" "}
                </div>
              </Col>
              {/* Search A */}
              <Col md={4}>
                <Form.Label>Search All Testimony</Form.Label>
<<<<<<< HEAD
                <div className="d-flex align-items-center gap-3">
                  <Form.Control
                    value={searchA}
                    onChange={(e) => {
                      fetchData();
                      setSearchA(e.target.value);
                    }}
                    placeholder="Search by test"
                    className="show-page-sorath"
                  />

                  <div
                    className=""
                    style={{
                      width: "65px",
                      height: "40px",
                      border: "2px solid #11b3ef",
                      borderRadius: "10px",
                      boxShadow: "4px 4px 10px grey", // blue shadow
                      display: "flex", // 🔹 Flexbox to center content
                      justifyContent: "center", // 🔹 Center horizontally
                      alignItems: "center", // 🔹 Center vertically
                      fontWeight: "bold", // Optional: makes number more prominent
                    }}
                  >
                    {showInitialTestimonyCnt
                      ? initialTestimonyCnt
                      : testimonyCnt}
                  </div>
                </div>

=======
                <Form.Control
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  placeholder="Search by test"
                  className="form-sorath-input"
                />
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={`searchA-${opt}`}
                      type="radio"
                      name="searchAType" // ✅ UNIQUE name
                      label={opt}
                      value={opt}
                      checked={searchAType === opt}
                      onChange={(e) => {
                        fetchData();
                        setSearchAType(e.target.value);
                      }}
                    />
                  ))}{" "}
                  <i
                    onClick={handleShow}
                    style={{ cursor: "pointer" }}
                    className="bi bi-question-circle-fill"
                  ></i>{" "}
                </div>
              </Col>
<<<<<<< HEAD

              <Col md={1}>
                    <div className="mt-3 d-flex justify-content-end gap-2">
                      <Button
                        variant="secondary"
                        // size="sm"
                        onClick={handleResetSearch}
                      >
                        Reset
                      </Button>
                      {/* <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          handleSearchSubmit(currentPage, rowsPerPage)
                        }
                      >
                        Apply Search
                      </Button> */}
                    </div>
                  </Col>
            </Row>
=======
            </Row>

            <div className="mt-3 d-flex justify-content-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleResetSearch}>
                Reset
              </Button>
              <Button
                size="sm"
                onClick={() => handleSearchSubmit(currentPage, rowsPerPage)}
                className="btn-sorath-main"
              >
                Apply Search
              </Button>
            </div>
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
          </div>
        </Collapse>

        {/* Table */}
<<<<<<< HEAD

        <div
          class="container"
          style={{ height: "600px", overflowY: "auto" }}
          // ref={scrollContainerRef}
          // onScroll={handleScroll}
        >
          <Button
            variant="success"
            className="mb-3"
            onClick={handleDownloadExcel}
          >
            Download Excel
          </Button>
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div style={{ textAlign: "center", padding: "20px" }}>
                <ClipLoader color="#007bff" size={50} /> {/* Blue spinner */}
              </div>
            </div>
          ) : (
            <Table
              responsive
              bordered
              className="align-middle rounded-3 qa-table"
            >
              <colgroup>
                <col style={{ width: "20%" }} /> {/* Filename and Cite */}
                <col style={{ width: "55%" }} /> {/* Question and Answers */}
                <col style={{ width: "25%" }} /> {/* Comments */}
              </colgroup>

              <thead className="table-sorath-three">
                <tr>
                  <th>Filename and Cite</th>
                  <th>Question and Answers</th>
                  <th>Comments</th>
                </tr>
              </thead>

              <tbody className="t-body">
                {qaPairs.map((row) => (
                  <tr key={row.id ?? row.transcript_name}>
                    <td>
                      {row.transcript_name}
                      <br />
                      {row.cite}
                    </td>

                    <td>
                      <div className="truncate-wrap">
                        {highlightText(row.question, searchA)}
                      </div>
                      <br />
                      <div className="truncate-wrap">
                        {highlightText(row.answer, searchA)}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        {/* Comment Icon */}
                        <FaCommentAlt
                          size={22}
                          onClick={() => handleShowComments(row.id)}
                          style={{ cursor: "pointer", marginTop: "4px" }}
                        />

                        {/* Comments in a column */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {row.comments &&
                            row.comments.map((commenter, i) => {
                              const initials = commenter.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase();

                              const bgColor = getColorFromString(
                                commenter.email || commenter.name
                              );

                              return (
                                <div
                                  key={i}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <div
                                    onClick={() => handleShowComments(row.id)}
                                    className="ms-2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 32,
                                      height: 32,
                                      borderRadius: "50%",
                                      backgroundColor: bgColor,
                                      color: "white",
                                      fontWeight: "bold",
                                      fontSize: "14px",
                                      flexShrink: 0,
                                    }}
                                    title={commenter.name}
                                  >
                                    {initials}
                                  </div>
                                  <p style={{ margin: 0 }}>
                                    {commenter.content}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {/* Loading Spinner */}
          {/* {loading && <div className="text-center p-2">Loading more...</div>} */}
        </div>
=======
        <Table responsive bordered className="align-middle rounded-3">
          <thead className="table-sorath-three">
            <tr>
              <th style={{ width: "100px" }}>Filename and Cite</th>
              <th style={{ width: "10%" }}>Comments</th> {/* Reduced width */}
              <th style={{ width: "10%" }}>User</th> {/* Reduced width */}
              <th style={{ width: "100px" }}>Question and Answers</th>
            </tr>
          </thead>
          <tbody>
            {qaPairs.map((row, idx) => (
              <tr key={idx}>
                <td style={{ width: "100px" }}>
                  {row.transcript_name}
                  <br />
                  {row.cite}
                </td>
                {/* comment */}
                <td
                  style={{
                    width: "10%", // Reduced width
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  onClick={() => handleCommentClick(row)}
                >
                  <div className="comment-icon-sorath">
                    <svg
                      id="Layer_1"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 61.05 57.58"
                    >
                      <title>comment</title>
                      <path
                        d="M443.76,490.72V479.29c-8.71-1.55-10.18-8-9.76-15.94.31-6-.05-12,.1-18,.17-7.08,4.24-11.17,11.26-11.23q19.22-.15,38.43,0c7,.06,11,4.16,11.12,11.28.09,7.48.1,15,0,22.46-.11,7.06-4.11,11-11.29,11.1-6.32.11-12.67-.26-19,.16a16.64,16.64,0,0,0-7.95,2.91c-4.12,2.86-7.8,6.35-11.66,9.57Zm2.94-4a86.26,86.26,0,0,0,7-5.93c3.43-3.67,7.38-5.06,12.44-4.68,5.79.42,11.64.16,17.46.07,5.54-.09,8.55-2.76,8.68-8.11q.28-11.49,0-23c-.14-5.4-3.09-8.15-8.61-8.19q-19.22-.13-38.44,0c-5.22,0-8.21,2.85-8.34,7.94-.19,7.81-.11,15.64,0,23.46,0,3.72,1.93,7,5.49,7.37,5.1.46,5,3.17,4.41,6.76A35.67,35.67,0,0,0,446.7,486.76Z"
                        transform="translate(-433.93 -434.09)"
                      />
                      <circle cx="14.52" cy="20.91" r="3" />
                      <circle cx="30.52" cy="20.91" r="3" />
                      <circle cx="46.52" cy="20.91" r="3" />
                    </svg>
                  </div>

                  {/* You can put something like an icon or tooltip here later */}
                </td>
                {/* user */}
                <td
                  style={{
                    width: "10%", // Reduced width
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "center",
                  }}
                >
                  <button
            className="btn dropdown-toggle p-0"
            type="button"
            id="profileDropdown"
          >
            <div
              style={{
                backgroundImage: 'url("https://i.pravatar.cc/150?img=4")',
              }}
              title={name}
            >
              {getInitials(name)}
            </div>
            {/* <span className="d-none d-md-inline">Profile</span> */}
          </button>
                </td>
                {/* question */}
                <td style={{ width: "100px" }}>
                  {row.question}
                  <br />
                  {row.answer}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998

        {/* Pagination Footer */}
        <Row className="px-1 py-3 align-items-center">
          {/* <Col>
            <span className="text-muted small">
              {qaPairs.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1}–${
                    (currentPage - 1) * rowsPerPage + qaPairs.length
                  }`
                : "0"}{" "}
              of {totalCount}
            </span>
          </Col> */}

          {/* <Col className="text-center">
            <DropdownButton
              title={`Rows per page: ${rowsPerPage}`}
              variant="outline-secondary"
              className="custom-rows-dropdown"
              size="sm"
            >
              {[5, 10, 15, 20, 50, 100].map((n) => (
                <Dropdown.Item
                  key={n}
                  onClick={() => handlePageSizeChange(n)}
                  active={n === rowsPerPage}
                >
                  {n}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col> */}

          {/* <Col className="text-end">
            <div className="d-inline-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
              <span className="fw-semibold d-flex align-center">
                {currentPage}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </Col> */}
        </Row>
      </Card>
      <Filter
        show={showFilters}
        handleClose={handleCloseFilters}
        testimonyCnt={testimonyCnt}
        // fuzzyTranscripts={fuzzyTranscripts}
        // fuzzyWitnesses={fuzzyWitnesses}
      />

<<<<<<< HEAD
      <Comments
        showComments={showComments}
        handleClose={handleCloseComments}
        testimonyId={testimonyId}
      ></Comments>
=======
      <CommentSidebar
  show={showCommentSidebar}
  handleClose={handleCloseCommentSidebar}
  data={commentSidebarData}
/>
>>>>>>> fb12ab84a2972781f4ce021f7aaf36c437c35998
    </Container>
  );
};

export default TestimonySearchPage;
