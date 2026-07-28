/** 골든두들 클럽 · 메인 콘텐츠 */

export const CLUB_NAV = [
  { href: "/#breed", label: "Breed" },
  { href: "/#types", label: "Types" },
  { href: "/#traits", label: "Traits" },
  { href: "/#price", label: "Price" },
  { href: "/#care", label: "Care" },
  { href: "/#club", label: "Club" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
] as const;

export const BREED_TRAITS = [
  {
    en: "Hybrid Heritage",
    ko: "이종 교배의 탄생",
    text: "골든두들은 골든리트리버와 푸들의 이종교배로 태어난 하이브리드견입니다. 리트리버의 온화함과 푸들의 영리함·코트 특성이 조화를 이룹니다.",
  },
  {
    en: "Family Companion",
    ko: "가족과 함께하는 성격",
    text: "사람을 잘 따르고 아이·다른 반려동물과도 비교적 잘 어울리는 편입니다. 활발하면서도 애교 많은 컴패니언으로 사랑받습니다.",
  },
  {
    en: "Coat Variety",
    ko: "다양한 코트",
    text: "직모·웨이브·컬리까지 개체별 코트 차이가 큽니다. 세대(F1·F1B 등)와 부모 조합에 따라 털빠짐·미용 주기도 달라집니다.",
  },
  {
    en: "Size Spectrum",
    ko: "미니부터 스탠다드까지",
    text: "미니골든두들부터 미디엄·스탠다드까지 크기 스펙트럼이 넓어, 주거 환경과 라이프스타일에 맞춰 선택할 수 있습니다.",
  },
] as const;

export const DOODLE_TYPES = [
  {
    en: "Goldendoodle",
    ko: "골든두들",
    text: "골든리트리버 × 푸들. 밝고 친화적인 성격과 부드러운 외모로 가장 널리 알려진 두들 계열입니다. 골든두들분양의 대표 품종입니다.",
  },
  {
    en: "Mini Goldendoodle",
    ko: "미니골든두들",
    text: "소형·미니 푸들을 조합해 체구를 줄인 타입. 아파트·소형 주거에도 적합하며 미니골든두들분양 문의가 많습니다.",
  },
  {
    en: "Aussiedoodle",
    ko: "오시두들",
    text: "오스트레일리안 셰퍼드 × 푸들. 영리하고 활동량이 많아 훈련·운동을 즐기는 가정에 잘 맞습니다.",
  },
  {
    en: "Bernedoodle",
    ko: "버니두들",
    text: "버니즈 마운틴 독 × 푸들. 온화하고 충성심이 강하며, 삼색·바이컬러 코트가 인상적입니다.",
  },
  {
    en: "Partidoodle",
    ko: "파티두들",
    text: "파티(파티컬러) 패턴을 가진 두들. 화이트와 다른 컬러가 섞인 독특한 마킹이 특징으로, 골든두들종류 중에서도 개성이 뚜렷합니다.",
  },
  {
    en: "Other Doodles",
    ko: "그 외 두들",
    text: "래브라두들, 말티푸 등 푸들 기반 하이브리드도 함께 상담합니다. 원하시는 크기·성격·코트에 맞춰 안내드립니다.",
  },
] as const;

export const SIZE_FACTS = [
  { label: "체고 Height", value: "약 30–60cm", note: "미니~스탠다드" },
  { label: "체중 Weight", value: "약 7–35kg", note: "개체·세대별 차이" },
  { label: "수명 Lifespan", value: "10–15년+", note: "건강한 관리 시" },
  { label: "에너지 Energy", value: "중~높음", note: "산책·놀이 필수" },
] as const;

export const PRICE_POINTS = [
  {
    en: "Adoption Price",
    ko: "분양가 · 분양가격",
    text: "골든두들분양가는 크기(미니·미디엄·스탠다드), 세대(F1·F1B 등), 코트·컬러, 부모견 혈통·건강 검사 여부에 따라 달라집니다. 정확한 분양가격은 상담 시 현재 가능한 아이 기준으로 안내합니다.",
  },
  {
    en: "Total Cost",
    ko: "골든두들비용 구성",
    text: "초기 비용에는 분양가 외에 필수 접종·구충·기본 검진, 이동·용품(사료·목줄·하우스) 등이 포함될 수 있습니다. 이후 미용·사료·정기 검진 등 유지 비용도 함께 안내드립니다.",
  },
  {
    en: "What Affects Price",
    ko: "가격에 영향을 주는 요소",
    text: "미니골든두들분양은 희소성과 수요에 따라 스탠다드와 가격대가 다를 수 있습니다. 파티 마킹, 저탈모 성향 코트, 건강 검사 완료 개체는 분양가가 달라질 수 있습니다.",
  },
  {
    en: "Transparent Quote",
    ko: "투명한 견적 상담",
    text: "골든두들 클럽은 무리한 유도 없이, 원하시는 조건(크기·성격·털빠짐·예산)을 듣고 맞는 옵션만 제안합니다. 전화·카톡으로 편하게 문의해 주세요.",
  },
] as const;

export const CARE_POINTS = [
  {
    en: "Shedding",
    ko: "털빠짐",
    text: "푸들 유전자 비율과 코트 타입에 따라 털빠짐이 적거나 중간 수준일 수 있습니다. ‘완전 무탈모’를 보장하지는 않으며, 개체별로 차이가 있음을 분양 전 안내합니다.",
  },
  {
    en: "Grooming",
    ko: "미용과 빗질",
    text: "웨이브·컬리 코트는 엉김 방지를 위해 정기 빗질과 전문 미용이 필요합니다. 컷 스타일에 따라 관리 난이도가 달라집니다.",
  },
  {
    en: "Exercise",
    ko: "운동과 자극",
    text: "리트리버·푸들 성향이 섞여 산책과 놀이, 간단한 훈련을 즐깁니다. 실내 위주라도 하루 적정 활동량을 채워 주는 것이 중요합니다.",
  },
  {
    en: "Training",
    ko: "사회화와 훈련",
    text: "영리하고 사람을 좋아해 기초 예절·사회화에 잘 반응합니다. 이른 시기의 긍정 강화 훈련이 안정된 성격을 만듭니다.",
  },
] as const;

export const CLUB_PROMISES = [
  {
    num: "01",
    en: "Honest Matching",
    ko: "정직한 매칭",
    text: "크기·성격·털빠짐·예산에 맞는 골든두들만 신중히 소개합니다.",
  },
  {
    num: "02",
    en: "Clear Guidance",
    ko: "명확한 안내",
    text: "분양가부터 케어·미용까지, 분양 전후 궁금증을 투명하게 설명합니다.",
  },
  {
    num: "03",
    en: "Aftercare",
    ko: "분양 이후 동행",
    text: "적응·식사·미용 주기 등 입양 후에도 상담을 이어 갑니다.",
  },
] as const;

export const CLUB_REVIEWS = [
  {
    name: "김서연",
    location: "서울 · Gangnam",
    text: "미니골든두들분양을 고민하다 클럽에서 크기와 털빠짐까지 자세히 설명해 주셨어요. 아이와 잘 어울리고 집 분위기가 밝아졌습니다.",
    imageIndex: 3,
    rating: 5,
  },
  {
    name: "이준호",
    location: "부산 · Haeundae",
    text: "골든두들비용·분양가 구성이 투명해서 안심됐습니다. 성격이 밝고 사람을 잘 따라요.",
    imageIndex: 7,
    rating: 5,
  },
  {
    name: "박민지",
    location: "경기 · Bundang",
    text: "오시두들과 골든두들 차이를 비교해 주셔서 저희 라이프스타일에 맞는 아이를 고를 수 있었어요.",
    imageIndex: 11,
    rating: 5,
  },
  {
    name: "최현우",
    location: "대구 · Suseong",
    text: "파티두들 마킹이 너무 예뻐요. 미용 주기도 미리 알려주셔서 관리가 수월합니다.",
    imageIndex: 14,
    rating: 5,
  },
  {
    name: "정유진",
    location: "인천 · Songdo",
    text: "골든리트리버와 푸들 하이브리드 특성이 사이트에 잘 정리돼 있어 사전 공부에 도움이 됐습니다.",
    imageIndex: 18,
    rating: 5,
  },
  {
    name: "한도윤",
    location: "대전 · Yuseong",
    text: "버니두들 상담도 친절했습니다. 온화한 성격이 가족 모두와 잘 맞아요.",
    imageIndex: 21,
    rating: 5,
  },
  {
    name: "오수빈",
    location: "광주 · Buk-gu",
    text: "털빠짐이 걱정이었는데, 개체별 차이를 솔직히 말씀해 주셔서 신뢰가 갔어요.",
    imageIndex: 24,
    rating: 5,
  },
  {
    name: "윤재혁",
    location: "제주 · Jeju",
    text: "분양가격과 초기 용품 비용까지 견적으로 받아보니 계획이 수월했습니다.",
    imageIndex: 27,
    rating: 5,
  },
  {
    name: "신예린",
    location: "서울 · Seongsu",
    text: "골든두들분양 후 적응 케어 팁을 카톡으로 받을 수 있어 든든했어요. 지금 우리 집의 중심입니다.",
    imageIndex: 30,
    rating: 5,
  },
] as const;

export const GALLERY_INDICES = [1, 5, 9, 12, 16, 20, 23, 26, 28, 4, 8, 15] as const;
