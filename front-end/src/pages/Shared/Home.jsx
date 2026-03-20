import { useNavigate, Link } from "react-router-dom";

import "../../styles/Home.css";
import { useEffect } from "react";
import { message } from "antd";
import ProfileDropdown from "../../components/ProfileDropdown";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Bạn cần đăng nhập trước!");
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khi đăng xuất
    message.success("Đã đăng xuất!");
    navigate("/login");
  };

  return (
    <>
      <div className="screen active" id="home">
        <div className="home-screen">
          {/*  APP HEADER  */}
          <div className="app-header">
            <div className="app-logo">
              <div className="logo-dot">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-icon"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="logo-text">MCQ Training</span>
            </div>
            <nav className="app-nav">
              <a
                className="active cursor-pointer"
                onClick={() => navigate("/")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-icon"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>{" "}
                Trang chủ
              </a>
              <a
                onClick={() => console.log("Action triggered")}
                className="cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-icon"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>{" "}
                Bài thi
              </a>
              <a
                onClick={() => console.log("Action triggered")}
                className="cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-icon"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>{" "}
                Kết quả
              </a>
              <a
                onClick={() => console.log("Action triggered")}
                className="cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-icon"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>{" "}
                Hồ sơ
              </a>
            </nav>
            <div className="header-right">
              <div className="notification-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-icon"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <div className="notif-badge">3</div>
              </div>
              <ProfileDropdown>
                <div className="user-avatar">HS</div>
              </ProfileDropdown>
            </div>
          </div>

          {/*  HOME CONTENT  */}
          <div className="home-content">
            {/*  ANNOUNCE  */}
            <div className="announce-banner">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="svg-icon"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>{" "}
              <span>
                <strong>Thông báo mới:</strong> Đề thi thử TOEIC tháng 3 đã được
                cập nhật! Hãy đăng ký ngay hôm nay.
              </span>
              <button
                onClick={() => console.log("Action triggered")}
                className="announce-btn"
              >
                Xem ngay
              </button>
            </div>

            {/*  HERO BANNER  */}
            <div className="hero-banner">
              <div className="hero-text">
                <h2>
                  Chào buổi sáng, Học sinh!{" "}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hero-title-svg"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </h2>
                <p>
                  Bạn có <strong className="hero-p-highlight">3 bài thi</strong>{" "}
                  đang chờ hoàn thành và{" "}
                  <strong className="hero-p-highlight">1 thông báo</strong> mới
                  từ giảng viên. Hãy tiếp tục học ngay!
                </p>
                <button
                  className="btn-hero"
                  onClick={() => console.log("Action triggered")}
                >
                  Xem bài thi →
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat-box">
                  <div className="num">12</div>
                  <div className="lbl">Bài đã làm</div>
                </div>
                <div className="stat-box">
                  <div className="num">85%</div>
                  <div className="lbl">Điểm TB</div>
                </div>
                <div className="stat-box">
                  <div className="num">3</div>
                  <div className="lbl">Huy hiệu</div>
                </div>
              </div>
            </div>

            {/*  STAT CARDS  */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="icon icon-blue">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div className="trend">+2 mới</div>
                </div>
                <div className="big-num">48</div>
                <div className="desc">Bài thi có sẵn</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="icon icon-green">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="trend">+3 tuần này</div>
                </div>
                <div className="big-num">12</div>
                <div className="desc">Bài đã hoàn thành</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="icon icon-yellow">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="trend">Top 15%</div>
                </div>
                <div className="big-num">8.5</div>
                <div className="desc">Điểm trung bình</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="icon icon-purple">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                  </div>
                  <div className="trend">Streak!</div>
                </div>
                <div className="big-num">7</div>
                <div className="desc">Ngày học liên tiếp</div>
              </div>
            </div>

            {/*  AVAILABLE EXAMS  */}
            <div className="section-header">
              <h3>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="svg-icon"
                >
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                </svg>{" "}
                Bài thi nổi bật
              </h3>
              <a
                className="view-all view-all-link"
                onClick={() => console.log("Action triggered")}
              >
                Xem tất cả →
              </a>
            </div>

            <div className="exams-grid">
              <div className="exam-card">
                <div className="exam-banner banner-1">
                  <span className="exam-category">TOEIC</span>
                  <span className="exam-badge">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>{" "}
                    Phổ biến
                  </span>
                </div>
                <div className="exam-body">
                  <h4>TOEIC Listening & Reading - Đề 01</h4>
                  <div className="exam-meta">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>{" "}
                      120 phút
                    </span>
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>{" "}
                      200 câu
                    </span>
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>{" "}
                      1,234
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill progress-75"></div>
                  </div>
                  <div className="exam-footer">
                    <span className="attempts">
                      Đã làm: 3 lần | Điểm cao nhất: 785
                    </span>
                    <button
                      className="btn-take"
                      onClick={() => console.log("Action triggered")}
                    >
                      Làm lại
                    </button>
                  </div>
                </div>
              </div>

              <div className="exam-card">
                <div className="exam-banner banner-2">
                  <span className="exam-category">JavaScript</span>
                  <span className="exam-badge">🆕 Mới</span>
                </div>
                <div className="exam-body">
                  <h4>JavaScript Fundamentals - Module 3</h4>
                  <div className="exam-meta">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>{" "}
                      45 phút
                    </span>
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>{" "}
                      50 câu
                    </span>
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>{" "}
                      892
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill progress-0"></div>
                  </div>
                  <div className="exam-footer">
                    <span className="attempts">Chưa làm</span>
                    <button
                      className="btn-take"
                      onClick={() => console.log("Action triggered")}
                    >
                      Bắt đầu
                    </button>
                  </div>
                </div>
              </div>

              <div className="exam-card">
                <div className="exam-banner banner-3">
                  <span className="exam-category">SQL</span>
                  <span className="exam-badge">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>{" "}
                    Khó
                  </span>
                </div>
                <div className="exam-body">
                  <h4>SQL Advanced Queries & Optimization</h4>
                  <div className="exam-meta">
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>{" "}
                      60 phút
                    </span>
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>{" "}
                      40 câu
                    </span>
                    <span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="svg-icon"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>{" "}
                      456
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill progress-40"></div>
                  </div>
                  <div className="exam-footer">
                    <span className="attempts">Đã làm: 1 lần | Điểm: 6.5</span>
                    <button
                      className="btn-take"
                      onClick={() => console.log("Action triggered")}
                    >
                      Làm lại
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/*  BOTTOM GRID  */}
            <div className="bottom-grid">
              <div className="recent-card">
                <div className="section-header section-header-recent">
                  <h3>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>{" "}
                    Kết quả gần đây
                  </h3>
                  <a
                    className="view-all view-all-link"
                    onClick={() => console.log("Action triggered")}
                  >
                    Xem tất cả
                  </a>
                </div>
                <div className="recent-item">
                  <div className="recent-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <div className="recent-info">
                    <h5>TOEIC Reading - Đề 05</h5>
                    <p>Hoàn thành • 10/03/2026 • 120 phút</p>
                  </div>
                  <div className="score-chip score-high">9.0/10</div>
                </div>
                <div className="recent-item">
                  <div className="recent-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div className="recent-info">
                    <h5>HTML/CSS Basics Quiz</h5>
                    <p>Hoàn thành • 08/03/2026 • 30 phút</p>
                  </div>
                  <div className="score-chip score-mid">7.5/10</div>
                </div>
                <div className="recent-item">
                  <div className="recent-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                  </div>
                  <div className="recent-info">
                    <h5>Python OOP Fundamentals</h5>
                    <p>Hoàn thành • 06/03/2026 • 45 phút</p>
                  </div>
                  <div className="score-chip score-low">5.0/10</div>
                </div>
              </div>

              <div className="quick-panel">
                <div className="section-header section-header-quick">
                  <h3>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>{" "}
                    Truy cập nhanh
                  </h3>
                </div>
                <div className="quick-item">
                  <div className="qi-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                    </svg>
                  </div>
                  <div className="qi-text">
                    <h5>Danh sách bài thi</h5>
                    <p>Xem tất cả bài thi có sẵn</p>
                  </div>
                </div>
                <div className="quick-item">
                  <div className="qi-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="qi-text">
                    <h5>Hồ sơ cá nhân</h5>
                    <p>Cập nhật thông tin tài khoản</p>
                  </div>
                </div>
                <div className="quick-item">
                  <div className="qi-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div className="qi-text">
                    <h5>Lịch sử làm bài</h5>
                    <p>Xem lại kết quả các bài đã làm</p>
                  </div>
                </div>
                <div className="quick-item">
                  <div className="qi-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="svg-icon"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div className="qi-text">
                    <h5>Thông báo (3)</h5>
                    <p>Có 3 thông báo chưa đọc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  Mobile Bottom Nav (Student)  */}
          <nav className="mobile-bottom-nav">
            <a
              className="mbn-item active"
              onClick={() => console.log("Action triggered")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Trang chủ
            </a>
            <a
              className="mbn-item"
              onClick={() => console.log("Action triggered")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
              </svg>
              Bài thi
            </a>
            <a
              className="mbn-item"
              onClick={() => console.log("Action triggered")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              Kết quả
            </a>
            <a
              className="mbn-item"
              onClick={() => console.log("Action triggered")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Hồ sơ
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
