export default function MdtsLogo({ size = 36, bg = '#ffffff' }) {
  const s = size
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── 흰 배경 원 ── */}
      <circle cx="50" cy="58" r="52" fill={bg} />

      {/* ── 링 (앵커 샤클) ── */}
      <circle cx="50" cy="11" r="8.5" stroke="#0d1535" strokeWidth="5.5" fill="none" />
      <circle cx="50" cy="11" r="3"   fill="#0d1535" />

      {/* ── 칼라 (링 → 스톡 연결부) ── */}
      <rect x="44" y="18" width="12" height="10" rx="2.5" fill="#0d1535" />

      {/* ── 스톡 (수평 가로대, 덤벨 형태) ── */}
      <rect x="18" y="29" width="64" height="11" rx="5.5" fill="#0d1535" />
      <circle cx="18" cy="34.5" r="5.5" fill="#0d1535" />
      <circle cx="82" cy="34.5" r="5.5" fill="#0d1535" />

      {/* ── 샤프트 이중선 (세로) ── */}
      <rect x="43.5" y="38" width="5"   height="58" rx="2.5" fill="#0d1535" />
      <rect x="51.5" y="38" width="5"   height="58" rx="2.5" fill="#0d1535" />

      {/* ── 크로스 암 이중선 (가로) ── */}
      <rect x="26"   y="57" width="48" height="5"   rx="2.5" fill="#0d1535" />
      <rect x="26"   y="65" width="48" height="5"   rx="2.5" fill="#0d1535" />

      {/* ── 교차점 채움 ── */}
      <rect x="43.5" y="57" width="13" height="13" fill="#0d1535" />

      {/* ── 좌측 플루크 ── */}
      <path
        d="M44,86 C36,84 14,79 7,89 C3,96 9,106 19,102 C31,97 43,90 44,88Z"
        fill="#0d1535"
      />

      {/* ── 우측 플루크 ── */}
      <path
        d="M56,86 C64,84 86,79 93,89 C97,96 91,106 81,102 C69,97 57,90 56,88Z"
        fill="#0d1535"
      />

      {/* ── 크라운 (바텀 곡선) ── */}
      <path
        d="M44.5,93 Q50,104 55.5,93"
        stroke="#0d1535"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
