import "./PayPage.css";
import GradientText from "../../comp/Gradtext/GradientText";

export default function PayPage() {
  return (
    <div className="pay-page">
      <div className="ticket">
        <div className="ticket-inner">
          <div className="ticket-header">
            <div className="agency-name">
              <GradientText
                colors={["#2F3B69", "#a4add0ff", "#2F3B69", "#d4d5ceff"]}
                animationSpeed={9}              
              >
                PULSE
              </GradientText>
              <GradientText
                colors={["#2F3B69", "#a4add0ff", "#2F3B69", "#d4d5ceff"]}
                animationSpeed={9}
              >
                TOUR
              </GradientText>

              {/* <span>PULSE</span>
              <span>TOUR</span> */}
            </div>
            <div className="icon">
              <svg
                className="pulse-icon"
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                height="45px"
                viewBox="0 0 472.000000 455.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,455.000000) scale(0.100000,-0.100000)"
                  fill="#7779a0ff"
                  stroke="none"
                >
                  <path
                    d="M0 2275 l0 -2275 2360 0 2360 0 0 2275 0 2275 -2360 0 -2360 0 0
-2275z m2940 1461 c109 -26 241 -79 308 -124 96 -66 185 -169 236 -274 52
-108 70 -174 87 -318 23 -201 -6 -415 -77 -568 -76 -167 -212 -309 -367 -385
-202 -98 -263 -107 -773 -107 l-404 0 0 -570 0 -570 -340 0 -340 0 0 1470 0
1471 798 -4 c719 -3 804 -5 872 -21z"
                  />
                  <path
                    d="M2388 3347 c-9 -12 -39 -31 -69 -42 -29 -11 -57 -21 -61 -23 -4 -2
-17 13 -29 32 -29 50 -42 45 -19 -6 l19 -42 -42 -29 c-56 -39 -115 -112 -154
-189 -18 -35 -32 -67 -32 -71 -1 -4 27 -20 61 -35 l61 -28 -2 -75 c-1 -49 4
-92 14 -124 20 -57 27 -48 -98 -123 -74 -45 -92 -71 -26 -38 18 9 33 16 33 16
1 0 19 -25 41 -55 45 -62 123 -127 191 -157 l45 -19 -7 -45 c-8 -54 4 -56 33
-5 22 38 23 39 60 30 21 -5 52 -9 69 -9 17 0 37 -7 44 -15 18 -22 43 -18 68
10 12 14 30 25 41 25 10 0 52 17 92 37 93 46 183 134 228 225 l33 65 36 -8
c32 -7 53 -5 41 4 -9 8 -176 67 -188 67 -9 0 -11 16 -6 68 6 60 2 93 -21 173
-3 11 12 27 47 50 61 39 53 48 -17 19 l-49 -22 -25 34 c-37 48 -80 87 -122
109 -41 21 -42 22 -29 122 9 73 -4 70 -47 -11 l-33 -62 -67 0 c-38 -1 -90 -9
-119 -19 -59 -20 -65 -17 -97 45 -18 37 -13 44 47 65 29 10 44 11 69 1 38 -14
68 -1 68 31 0 48 -56 65 -82 24z m-121 -154 l22 -47 -53 -50 c-28 -28 -62 -72
-75 -98 -25 -53 -24 -53 -87 -37 -42 11 -45 14 -39 38 13 51 66 130 126 185
33 31 66 56 72 56 7 -1 22 -22 34 -47z m283 -18 c0 -6 -62 -120 -90 -168 -13
-21 -19 -25 -27 -15 -23 29 -93 151 -89 155 22 23 206 47 206 28z m157 -68
c38 -27 102 -103 92 -110 -11 -8 -160 -67 -170 -67 -10 0 -8 56 7 178 6 46 4
46 71 -1z m-378 -44 c40 -81 62 -135 51 -128 -5 3 -39 26 -77 50 -37 24 -70
42 -73 39 -3 -4 24 -33 60 -65 35 -32 58 -59 50 -59 -22 1 -170 37 -176 43
-16 16 100 177 128 177 4 0 21 -26 37 -57z m503 -130 c12 -31 17 -177 6 -188
-3 -4 -49 8 -102 26 -91 32 -119 49 -77 49 36 0 120 23 115 32 -3 4 -33 8 -67
8 l-62 0 37 25 c20 14 40 25 43 25 3 0 23 11 43 25 46 31 50 31 64 -2z m-611
-57 c104 -39 121 -48 107 -58 -7 -4 -25 -8 -40 -8 -60 0 -63 -14 -4 -25 l58
-10 -82 -49 c-90 -53 -91 -53 -110 14 -16 56 -12 160 5 160 2 0 31 -11 66 -24z
m307 -26 c12 -12 22 -29 22 -40 0 -24 -37 -60 -62 -60 -23 0 -58 35 -58 58 0
28 29 62 54 62 12 0 32 -9 44 -20z m215 -136 c84 -19 89 -28 47 -81 l-18 -23
-38 34 c-98 85 -109 98 -89 93 11 -3 55 -13 98 -23z m4 -125 c3 -14 -56 -65
-72 -62 -7 2 -85 167 -85 180 0 11 155 -105 157 -118z m-403 19 c-3 -51 -8
-95 -10 -97 -6 -6 -114 81 -125 100 -14 27 -14 27 54 58 92 43 90 46 81 -61z
m569 66 c47 -8 47 -23 1 -100 -63 -105 -155 -180 -268 -218 -44 -15 -50 -15
-66 -1 -23 21 -46 19 -64 -6 -13 -19 -20 -20 -75 -14 -34 4 -61 9 -61 12 0 3
12 27 27 54 25 48 28 49 72 49 44 1 95 9 152 24 22 6 29 2 54 -34 35 -50 43
-41 16 15 l-20 40 22 18 c12 9 33 27 46 38 17 14 32 19 50 14 24 -6 25 -5 9
11 -15 16 -15 20 10 65 18 32 32 47 42 44 8 -2 32 -7 53 -11z m-318 -101 l45
-68 -31 -13 c-37 -15 -159 -28 -159 -17 0 10 90 165 96 165 2 0 24 -30 49 -67z
m-316 -53 l52 -35 -4 -52 c-2 -29 -7 -56 -11 -60 -23 -23 -197 111 -232 179
l-15 28 53 23 53 23 26 -35 c14 -20 49 -52 78 -71z"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div className="barcode"></div>
        </div>
        <div className="cut-lines"></div>
        <div className="ticket-bottom">
          <div className="ticket-time-details">
            <div className="to">
              <span className="sub-text">TO</span>
              <div className="dest-name">Верхняя балкария</div>
            </div>
            <div className="at ">
              <span className="sub-text">AT</span>
              <div className="tour-time">18:00</div>
              <div className="tour-date">1 DEC</div>
            </div>
          </div>

          <div className="ticket-price-box">
            <div className="ticket-price-details">
              <div className="check-id-box price-part">
                <span className="sub-text">CHECK ID</span>
                <div className="check-id price-numbers">2</div>
              </div>
              <div className="passenger price-part">
                <span className="sub-text">NUMBER OF PASSENGERS</span>
                <div className="passengers-number price-numbers">2</div>
              </div>
              <div className="seat price-part">
                <span className="sub-text">SEAT</span>
                <div className="seat-number price-numbers">-</div>
              </div>
              <div className="total-box">
                <span className="total-text">TOTAL:</span>
                <div className="total-price">4500RUB</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="select-button">Оплатить</div>
    </div>
  );
}
