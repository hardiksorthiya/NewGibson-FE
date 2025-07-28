import React, { useEffect, useState } from "react";
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
} from "react-bootstrap";
import Filter from "../../components/Filter";
import CommentSidebar from "../../components/Comment";
import BASE_URL from "../../api";

const EnhancedTable = () => {
  const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  const [fuzzyTranscripts, setFuzzyTranscripts] = useState([]);

  const handleTranscriptFromChild = (data) => {
    setSelectedTranscripts(data);
  };

  const [selectedWitness, setSelectedWitness] = useState([]);

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

  const [selectedWitnessType, setSelectedWitnessType] = useState([]);

  const handleWitnessTypeFromChild = (data) => {
    setSelectedWitnessType(data);
  };
  const [loading, setLoading] = useState(false);
  const [qaPairs, setQaPairs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [showFilters, setShowFilters] = useState(false);

  const handleShowFilters = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);

  const fetchPaginatedData = async (page = 1, pageSize = rowsPerPage) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/`,
        {
          params: {
            page,
            page_size: pageSize,
            // q: searchA,
            // mode: searchAType
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

  useEffect(() => {
    fetchPaginatedData(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);



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

  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [searchC, setSearchC] = useState("");

  const [searchAType, setSearchAType] = useState("exact");
  const [searchBType, setSearchBType] = useState("exact");
  const [searchCType, setSearchCType] = useState("exact");

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
      console.log("transcript names", res);
    } catch (err) {
      console.error("API error:", err.response?.data || err.message);
    }
  };

  const handleSearchSubmit = async (page = 1, pageSize) => {
    setAppliedSearch({
      A: searchA,
      B: searchB,
      C: searchC,
      AType: searchAType,
      BType: searchBType,
      CType: searchCType,
    });

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_PROD_API_URL}/api/testimony/combined-search/`,
        {
          q: searchA,
          mode: searchAType,
          witness_names: searchB.trim() ? [searchB.trim()] : [], // ✅ FIXED
          transcript_names: searchC.trim() ? [searchC.trim()] : [], // ✅ FIXED
        },
        {
          params: {
            page,
            page_size: pageSize,
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

    getFuzzyTranscripts(searchC);
  };



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

  const handlePageSizeChange = (size) => {
    setRowsPerPage(size);
    setCurrentPage(1); // reset to first page
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <Container fluid className=" px-3">
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

              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleShowFilters}
                className="filter-sorath-btn-color ms-3"
              >
                <FiFilter className="filter-sorath" />
              </Button>
            </div>
            {selectedWitness}
            <div className="Filter-data-come"></div>
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
                <Form.Control
                  value={searchC}
                  onChange={(e) => setSearchC(e.target.value)}
                  placeholder="Search by Filename"
                  className="form-sorath-input"
                />
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={opt}
                      type="radio"
                      name="searchCType"
                      label={opt}
                      value={opt}
                      checked={searchCType === opt}
                      onChange={(e) => setSearchCType(e.target.value)}
                    />
                  ))}
                </div>
              </Col>
              {/* Search B */}
              <Col md={4}>
                <Form.Label>Search by Witness</Form.Label>
                <Form.Control
                  value={searchB}
                  onChange={(e) => setSearchB(e.target.value)}
                  placeholder="Search by Witness"
                  className="form-sorath-input"
                />
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={opt}
                      type="radio"
                      name="searchBType"
                      label={opt}
                      value={opt}
                      checked={searchBType === opt}
                      onChange={(e) => setSearchBType(e.target.value)}
                    />
                  ))}
                </div>
              </Col>
              {/* Search A */}
              <Col md={4}>
                <Form.Label>Search All Testimony</Form.Label>
                <Form.Control
                  value={searchA}
                  onChange={(e) => setSearchA(e.target.value)}
                  placeholder="Search by test"
                  className="form-sorath-input"
                />
                <div className="mt-2 d-flex gap-2">
                  {["fuzzy", "boolean", "exact"].map((opt) => (
                    <Form.Check
                      key={opt}
                      type="radio"
                      name="searchAType"
                      label={opt}
                      value={opt}
                      checked={searchAType === opt}
                      onChange={(e) => setSearchAType(e.target.value)}
                    />
                  ))}
                </div>
              </Col>
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
          </div>
        </Collapse>

        {/* Table */}
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

        {/* Pagination Footer */}
        <Row className="px-1 py-3 align-items-center">
          <Col>
            <span className="text-muted small">
              {qaPairs.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1}–${
                    (currentPage - 1) * rowsPerPage + qaPairs.length
                  }`
                : "0"}{" "}
              of {totalCount}
            </span>
          </Col>

          <Col className="text-center">
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
          </Col>

          <Col className="text-end">
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
          </Col>
        </Row>
      </Card>

      <Filter
        show={showFilters}
        handleClose={handleCloseFilters}
        sendTranscriptToParent={handleTranscriptFromChild}
        sendWitnessToParent={handleWitnessFromChild}
        sendWitnessTypeToParent={handleWitnessTypeFromChild}
        totalCount={totalCount}
        fuzzyTranscripts={fuzzyTranscripts}
      />

      <CommentSidebar
  show={showCommentSidebar}
  handleClose={handleCloseCommentSidebar}
  data={commentSidebarData}
/>
    </Container>
  );
};

export default EnhancedTable;
