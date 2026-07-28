# -*- coding: utf-8 -*-
"""골든두들 클럽 - SEO 템플릿 콘텐츠 생성 (Gemini 없음).

src/lib 의 SeoPage 구조와 동일하게 키워드 H1, 소개/미션, 핵심 서비스 6개,
분양·케어 안내, 세 가지 약속, 4단계 절차, 관련 검색 의도, FAQ 6~7개,
전화 CTA를 파이썬으로 생성한다. 결과 dict 키는 Next.js SeoPage 타입과
1:1로 맞춰 public/seo-data/pages/*.json 으로 그대로 소비된다.
"""

from __future__ import annotations

import hashlib
import os
import random
import re
import string
from datetime import datetime
from typing import Any, Callable, Dict, List, Optional
from urllib.parse import quote

from cdn_images import pick_images as cdn_pick_images

BRAND = "골든두들 클럽"
DEFAULT_SITE_URL = "https://doodleclub.vercel.app"
BRAND_EN = "Golden Doodle Club"
SITE_NAME = "골든두들 클럽"
PHONE = os.environ.get("NEXT_PUBLIC_PHONE", "").strip() or "분양상담"
PHONE_TEL = "".join(c for c in PHONE if c.isdigit()) or ""
IMAGE_BASE = "https://image.cattery.co.kr/doodle"
IMAGE_COUNT = 40
AREA = "골든두들분양"
LOGO = "/logo.png"

# ------------------------------------------------------------------
# 시드 유틸 - 키워드+인덱스 조합마다 안정적으로 다른 결과를 만든다
# ------------------------------------------------------------------


def _seed_int(keyword: str, idx: int, salt: str = "gdc") -> int:
    return int(hashlib.md5(f"{keyword}|{idx}|{salt}".encode("utf-8")).hexdigest()[:8], 16)


def _rng(keyword: str, idx: int, salt: str = "gdc") -> random.Random:
    return random.Random(_seed_int(keyword, idx, salt))


def _pick(rng: random.Random, items: List[Any]) -> Any:
    return items[rng.randrange(len(items))]


def _shuffled(rng: random.Random, items: List[Any]) -> List[Any]:
    out = list(items)
    rng.shuffle(out)
    return out


def image_urls(
    count: int,
    seed: int,
    image_url: str = "",
    image_base: str = "",
    image_count: Optional[int] = None,
) -> List[str]:
    return cdn_pick_images(
        count=count,
        seed=seed,
        image_url=image_url,
        image_base=image_base or IMAGE_BASE,
        image_count=image_count,
        default_base=IMAGE_BASE,
        default_count=IMAGE_COUNT,
    )


def slugify(keyword: str, idx: int) -> str:
    base = "".join(
        c if c.isalnum() or c in "-_" else "-"
        for c in keyword.lower().replace(" ", "-")
    )
    base = base.strip("-")[:36] or "goldendoodle"
    tail = f"{idx:02d}{''.join(random.choices(string.ascii_lowercase + string.digits, k=4))}"
    return f"{base}-{tail}"


# ------------------------------------------------------------------
# 문구 풀
# ------------------------------------------------------------------

TONE_WORDS = ["차분하게", "꼼꼼하게", "따뜻하게", "세심하게", "신중하게"]
VERB_WORDS = ["안내", "상담", "조율"]

HERO_SUBTITLES = [
    "Golden Retriever × Poodle Hybrid · Goldendoodle",
    "골든리트리버와 푸들이 만난 하이브리드, 골든두들분양",
    "Soft Coat, Warm Heart - {brand}",
    "골든두들비용·성격·털빠짐까지 한눈에",
    "Mini Goldendoodle & Doodle Family Guide",
    "미니골든두들 · 오시두들 · 버니두들 비교 상담",
    "A Thoughtful Guide to Goldendoodle Adoption",
]

HERO_LINE2_POOL = [
    "함께할 가족을 만나요",
    "따뜻한 하이브리드를 만나요",
    "분양 전 궁금증을 풀어드려요",
    "사이즈·코트부터 맞춰드려요",
    "두들 라이프를 함께 준비해요",
]

HERO_BADGE_POOL = [
    "골든두들분양 · {brand}",
    "미니골든두들 상담 · {brand}",
    "전화 분양 상담 · {brand}",
    "두들 종류 비교 · {brand}",
]

LEAD_INS = [
    "{kw}를 고민 중이시라면, 혼자 결정하지 마시고 먼저 전화로 생활 환경을 나눠보세요.",
    "{kw} 검색으로 이 페이지를 찾으셨다면, 지금이 골든두들 정보를 정확히 확인할 때입니다.",
    "{kw}는 비용·사이즈·털관리까지 꼼꼼히 알아볼수록 만족도가 높아집니다. {brand}가 함께합니다.",
    "{kw}를 알아보고 계신 보호자님께, 골든리트리버×푸들 하이브리드의 특징부터 안내드립니다.",
    "{kw}, 급하게 결정하지 않으셔도 됩니다. 전화 한 통으로 분양가와 케어 포인트부터 확인하세요.",
]

MISSION_H2 = [
    "{kw}, 왜 {brand} 상담이 필요할까요",
    "{kw}, 골든두들을 제대로 이해하는 첫걸음",
    "{kw}를 고민하는 보호자님께 드리는 안내",
    "믿을 수 있는 {kw} 상담, {brand}가 함께합니다",
    "{kw} 전, 꼭 확인해야 할 것들",
    "{kw}, 사이즈·코트·성격까지 맞춰드립니다",
]

FACILITY_H2 = [
    "{kw} 전 알아두면 좋은 케어 포인트",
    "골든두들 일상 케어와 {brand} 안내",
    "{kw} 이후, 함께 준비하는 두들 라이프",
    "코트·사이즈·성격까지 짚어보는 {brand}",
]

RELATED_H2 = [
    "{kw}와 함께 찾는 검색어",
    "{kw} 보호자님이 함께 확인하는 정보",
    "{kw} 관련 검색 의도 모아보기",
    "{kw}만큼 자주 찾는 키워드",
]

SERVICES_H2 = [
    "{brand}의 핵심 서비스 6가지",
    "{kw} 상담부터 케어까지, {brand} 서비스 안내",
    "{kw}에 이어지는 {brand}의 분양 케어",
]

PROMISE_TITLE_SETS = [
    ["따뜻하게", "꼼꼼하게", "솔직하게"],
    ["세심하게", "끝까지", "투명하게"],
    ["신중하게", "꾸준히", "정직하게"],
    ["차분하게", "책임감 있게", "명확하게"],
]

PROMISE_H2 = [
    "{brand}의 세 가지 약속",
    "{kw} 상담에서 지키는 세 가지 약속",
    "분양 상담에서 지키는 세 가지 약속",
]

PROCESS_H2 = [
    "{kw} 진행 4단계",
    "처음이라 어려우신가요? 4단계로 안내합니다",
    "{brand}와 함께하는 분양 상담 4단계",
]

CTA_TEMPLATES = [
    "{kw} 상담은 전화 한 통이면 충분합니다 - {phone} · {brand}",
    "골든두들분양 상담 {phone} - {brand}",
    "{kw}, 지금 바로 {phone}로 문의하세요 - {brand}",
    "비용·사이즈·코트 궁금증, {phone} · {brand}가 함께합니다",
]

TITLE_TEMPLATES = [
    "{kw} | {brand} 골든두들분양 상담",
    "{kw} 안내 | {brand} - 골든리트리버×푸들 하이브리드",
    "{brand} {kw} - 미니골든두들·두들 종류 비교",
]

RELATED_SUFFIXES = ["비용", "분양가", "가격", "성격", "털빠짐", "종류", "미니"]

GENERIC_RELATED = [
    "골든두들분양",
    "미니골든두들분양",
    "골든두들비용",
    "오시두들",
    "버니두들",
    "파티두들",
    "골든두들털빠짐",
]

# 6가지 핵심 서비스: (key, 제목 후보, 설명 생성 함수)
ServiceDesc = Callable[[str, str, str, str], str]

SERVICE_DEFS: List[Dict[str, Any]] = [
    {
        "key": "phoneConsult",
        "titles": ["{kw} 전화 상담", "{kw} 1:1 분양 상담", "{kw} 사전 전화 상담"],
        "desc": lambda kw, brand, phone, tone: (
            f"{kw}{_eul_reul(kw)} 고민하신다면, {brand}가 생활 환경과 기대하는 사이즈·성격을 "
            f"{tone} 듣고 안내합니다. 상담 신청서 없이 전화({phone}) 한 통이면 충분합니다."
        ),
    },
    {
        "key": "sizeMatch",
        "titles": ["사이즈 매칭 안내", "미니·미디엄 사이즈 상담", "주거 맞춤 사이즈 매칭"],
        "desc": lambda kw, brand, phone, tone: (
            f"아파트·마당·가족 구성에 맞는 미니골든두들·미디엄 사이즈를 {tone} 비교해 드립니다. "
            f"{kw} 상담 시 성장 예상치와 활동량도 함께 안내합니다."
        ),
    },
    {
        "key": "coatShedding",
        "titles": ["코트·털빠짐 안내", "털관리·알레르기 상담", "푸들 코트 특성 설명"],
        "desc": lambda kw, brand, phone, tone: (
            f"골든두들은 푸들 유전으로 털빠짐이 상대적으로 적을 수 있으나, 개체·세대에 따라 다릅니다. "
            f"{kw} 전 브러싱·미용 주기와 코트 타입을 {tone} 설명해 드립니다."
        ),
    },
    {
        "key": "priceQuote",
        "titles": ["분양가·비용 안내", "골든두들비용 견적", "가격 상담 및 견적"],
        "desc": lambda kw, brand, phone, tone: (
            f"분양가·초기 준비물·예방접종·미용 등 예상 비용을 {tone} 정리해 드립니다. "
            f"{kw} 문의 시 사이즈·부모견 라인에 따른 가격대도 함께 안내합니다."
        ),
    },
    {
        "key": "typeCompare",
        "titles": ["두들 종류 비교", "오시·버니·파티두들 비교", "하이브리드 견종 비교"],
        "desc": lambda kw, brand, phone, tone: (
            f"골든두들뿐 아니라 오시두들·버니두들·파티두들 등 두들 계열의 성격·외형 차이를 "
            f"{tone} 비교합니다. {kw} 상담에서 가정에 맞는 타입을 함께 고릅니다."
        ),
    },
    {
        "key": "afterCare",
        "titles": ["분양 후 케어 안내", "입양 후 사후 상담", "일상 케어 팔로업"],
        "desc": lambda kw, brand, phone, tone: (
            f"분양 이후에도 사료·산책·미용·사회화 궁금증을 전화로 이어갑니다. "
            f"{kw}{_ro_euro(kw)} 시작된 두들 라이프가 안정적으로 자리 잡도록 {brand}가 돕습니다."
        ),
    },
]

# FAQ 후보 7종: (질문 변형 목록, 답변 생성 함수)
FAQ_DEFS: List[Dict[str, Any]] = [
    {
        "questions": [
            "{kw} 상담은 어떻게 하나요?",
            "{kw} 문의는 어떤 방법으로 하나요?",
            "{kw} 상담 신청은 어떻게 진행되나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"상담 폼 없이 {phone} 전화로만 접수합니다. 원하는 사이즈·생활 환경·{kw} 목적을 "
            f"알려주시면 {brand}가 비용과 케어 포인트를 안내합니다."
        ),
    },
    {
        "questions": [
            "골든두들은 어떤 견종인가요?",
            "{kw} 전에 골든두들 특징이 궁금해요",
            "골든리트리버와 푸들 교배가 맞나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"골든두들은 골든리트리버와 푸들의 이종교배로 태어난 하이브리드견입니다. "
            f"온순한 성격과 곱슬·물결 코트 성향을 함께 지니는 경우가 많으며, "
            f"{kw} 상담에서 세대(F1·F1b 등) 차이도 안내합니다."
        ),
    },
    {
        "questions": [
            "골든두들비용·분양가는 어느 정도인가요?",
            "{kw} 가격대가 궁금해요",
            "미니골든두들분양 비용도 안내되나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"사이즈·부모견 라인·시기에 따라 분양가가 달라집니다. "
            f"{phone}으로 문의하시면 {brand}가 현재 가능한 라인과 예상 비용을 안내합니다."
        ),
    },
    {
        "questions": [
            "골든두들은 털이 많이 빠지나요?",
            "{kw} 전 털빠짐·알레르기가 걱정돼요",
            "미용은 얼마나 자주 해야 하나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"푸들 유전으로 털빠짐이 상대적으로 적을 수 있으나 개체마다 차이가 있습니다. "
            f"정기 브러싱과 미용은 필수에 가깝고, {kw} 상담 시 코트 타입별 관리법을 안내합니다."
        ),
    },
    {
        "questions": [
            "미니골든두들과 일반 사이즈 차이가 뭔가요?",
            "{kw} 시 사이즈 선택이 고민돼요",
            "아파트에서도 골든두들 키울 수 있나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"미니골든두들은 상대적으로 작은 체형을 목표로 한 라인으로, 주거 환경에 따라 "
            f"선택이 달라집니다. {brand}는 활동량·가족 구성까지 고려해 {kw} 사이즈를 함께 고릅니다."
        ),
    },
    {
        "questions": [
            "오시두들·버니두들·파티두들과 뭐가 다른가요?",
            "두들 종류 비교도 해주시나요?",
            "{kw}와 다른 두들 견종 차이가 궁금해요",
        ],
        "answer": lambda kw, brand, phone: (
            f"오시두들(오스트레일리안 셰퍼드×푸들), 버니두들(버니즈×푸들), "
            f"파티두들(파티 컬러 패턴) 등은 외형·기질 포인트가 다릅니다. "
            f"{kw} 상담에서 가정에 맞는 타입을 비교해 드립니다."
        ),
    },
    {
        "questions": [
            "분양 후에도 케어 상담이 가능한가요?",
            "입양 이후 사후 안내도 해주시나요?",
            "{kw} 이후에도 문의할 수 있나요?",
        ],
        "answer": lambda kw, brand, phone: (
            f"네, 사료·산책·미용·사회화 등 일상 케어 궁금증을 전화로 이어갈 수 있습니다. "
            f"{kw}{_ro_euro(kw)} 시작한 두들 라이프가 안정되도록 {brand}가 돕습니다."
        ),
    },
]


def _has_batchim(word: str) -> bool:
    """한글 음절의 받침(종성) 유무 판별 - 조사(은/는, 을/를, 과/와) 선택용."""
    trimmed = word.strip()
    if not trimmed:
        return False
    last = trimmed[-1]
    code = ord(last)
    if code < 0xAC00 or code > 0xD7A3:
        return False
    return (code - 0xAC00) % 28 != 0


def _eun_neun(word: str) -> str:
    return "은" if _has_batchim(word) else "는"


def _eul_reul(word: str) -> str:
    return "을" if _has_batchim(word) else "를"


def _gwa_wa(word: str) -> str:
    return "과" if _has_batchim(word) else "와"


def _ro_euro(word: str) -> str:
    """로/으로 - 받침 있으면 '으로', 없거나 'ㄹ' 받침이면 '로'."""
    trimmed = word.strip()
    if trimmed:
        code = ord(trimmed[-1])
        if 0xAC00 <= code <= 0xD7A3 and (code - 0xAC00) % 28 == 8:
            return "로"  # ㄹ받침
    return "으로" if _has_batchim(word) else "로"


_KW_EUN_NEUN_RE = re.compile(r"\{kw\}(는|은)")
_KW_EUL_REUL_RE = re.compile(r"\{kw\}(를|을)")
_KW_GWA_WA_RE = re.compile(r"\{kw\}(과|와)")
_KW_RO_EURO_RE = re.compile(r"\{kw\}(으로|로)")


def _fill(template: str, kw: str, brand: str, phone: str) -> str:
    """{kw} 뒤에 붙는 조사를 키워드 받침에 맞게 자동 교정한 뒤 치환한다."""
    out = _KW_EUN_NEUN_RE.sub(kw + _eun_neun(kw), template)
    out = _KW_EUL_REUL_RE.sub(kw + _eul_reul(kw), out)
    out = _KW_GWA_WA_RE.sub(kw + _gwa_wa(kw), out)
    out = _KW_RO_EURO_RE.sub(kw + _ro_euro(kw), out)
    return out.format(kw=kw, brand=brand, phone=phone)


def build_content(
    keyword: str,
    idx: int,
    image_url: str = "",
    image_base: str = "",
    image_count: Optional[int] = None,
) -> Dict[str, Any]:
    kw = keyword.strip() or "골든두들분양"
    brand = BRAND
    phone = PHONE

    rng = _rng(kw, idx, "main")
    rng2 = _rng(kw, idx, "v2")
    rng3 = _rng(kw, idx, "v3")

    tone = _pick(rng, TONE_WORDS)
    tone2 = _pick(rng2, TONE_WORDS)
    verb = _pick(rng, VERB_WORDS)

    def t(template: str) -> str:
        return _fill(template, kw, brand, phone)

    # ---------- 메타 / 히어로 ----------
    title = t(_pick(rng, TITLE_TEMPLATES))
    related_pool = _shuffled(rng3, [f"{kw} {s}" for s in RELATED_SUFFIXES] + list(GENERIC_RELATED))
    related_intents = related_pool[:8]
    meta_desc = (
        f"{kw} 안내 - {brand}는 골든리트리버×푸들 하이브리드 골든두들분양 {verb}를 제공합니다. "
        f"골든두들비용·성격·털빠짐·미니골든두들·두들 종류까지 {tone} 안내합니다. "
        f"문의 {phone}."
    )
    meta_keywords_list: List[str] = []
    for kw_item in [kw, brand] + related_intents[:6] + ["골든두들분양", "미니골든두들분양"]:
        if kw_item not in meta_keywords_list:
            meta_keywords_list.append(kw_item)
    meta_keywords = ", ".join(meta_keywords_list[:12])

    h1 = f"{kw} - {brand} 골든두들분양 상담"
    hero_title_line1 = kw
    hero_title_line2 = _pick(rng2, HERO_LINE2_POOL)
    hero_badge = t(_pick(rng3, HERO_BADGE_POOL))
    hero_subtitle = t(_pick(rng, HERO_SUBTITLES))
    hero_bar = f"{kw} 상담, 전화 {phone}"

    # ---------- 소개 / 미션 ----------
    lead_in = t(_pick(rng2, LEAD_INS))
    mission_section = {
        "h2": t(_pick(rng, MISSION_H2)),
        "paragraphs": [
            lead_in,
            f"{kw}{_eun_neun(kw)} 단순한 견종 검색이 아니라, 앞으로의 생활 리듬과 케어 방식을 "
            f"함께 정하는 과정입니다. {brand}는 골든리트리버와 푸들의 장점을 이어받은 "
            f"골든두들의 성격·코트·사이즈를 {tone} 설명해 드립니다.",
            f"분양가·초기 준비물·미용 주기·활동량이 궁금하시다면, 절차와 예상 비용을 먼저 "
            f"전화로 {verb}받으실 수 있습니다. 상담 신청서 없이 전화 한 통으로 충분합니다.",
            f"미니골든두들분양부터 오시두들·버니두들·파티두들 비교까지, 가정에 맞는 선택을 "
            f"돕습니다. {kw} 문의는 {phone}로 안내드립니다.",
        ],
    }

    # ---------- 핵심 서비스 6개 (처음/끝 고정, 중간 4개 셔플) ----------
    middle = _shuffled(rng, SERVICE_DEFS[1:5])
    ordered_services = [SERVICE_DEFS[0], *middle, SERVICE_DEFS[5]]
    services = []
    for i, svc in enumerate(ordered_services):
        svc_rng = _rng(kw, idx, f"svc{i}")
        services.append(
            {
                "title": t(_pick(svc_rng, svc["titles"])),
                "description": svc["desc"](kw, brand, phone, tone if i % 2 == 0 else tone2),
            }
        )
    services_title = t(_pick(rng, SERVICES_H2))
    services_intro = (
        f"{kw} 문의 시 {brand}가 제공하는 핵심 서비스 6가지를 순서대로 확인해 보세요. "
        f"전화 상담부터 분양 후 케어까지 하나의 흐름으로 이어집니다."
    )

    # ---------- 분양·케어 안내 ----------
    facility_section = {
        "h2": t(_pick(rng2, FACILITY_H2)),
        "paragraphs": [
            f"{brand}는 골든두들분양을 중심으로, 사이즈·코트·성격 맞춤 상담을 운영합니다. "
            f"{kw} 상담에서는 주거 형태와 가족 구성을 듣고 미니·미디엄 라인의 차이를 "
            f"쉽게 정리해 드립니다.",
            f"골든두들은 온순하고 사람을 좋아하는 성향이 많지만, 개체마다 활동량과 털 타입이 "
            f"다릅니다. 브러싱·미용·사회화 포인트를 {tone} 안내하며, 분양 후에도 "
            f"일상 케어 궁금증을 이어갑니다.",
            f"보호자님이 가장 궁금해하시는 분양가·일정·두들 종류 비교는 전화로 투명하게 "
            f"{verb}합니다. {kw}{_eul_reul(kw)} 계기로 만난 인연이 오래가도록 최선을 다합니다.",
        ],
    }

    # ---------- 세 가지 약속 ----------
    promise_titles = list(_pick(rng, PROMISE_TITLE_SETS))
    promise_descs = [
        f"{kw} 상담은 보호자님의 생활 환경을 먼저 헤아립니다. 사이즈·성격·케어 여유를 함께 맞춥니다.",
        "분양가·코트 관리·두들 종류 비교까지 끝까지 친절히 안내하고, 분양 후에도 케어 상담을 이어갑니다.",
        f"비용과 절차를 명확히 알려 드립니다. {kw} 상담부터 분양 후 안내까지 투명한 소통이 신뢰의 시작입니다.",
    ]
    promises = [
        {"title": title, "description": promise_descs[i]} for i, title in enumerate(promise_titles)
    ]
    promises_title = t(_pick(rng2, PROMISE_H2))

    # ---------- 4단계 절차 ----------
    process_title = t(_pick(rng3, PROCESS_H2))
    process_steps = [
        {
            "step": "01",
            "title": "전화 상담",
            "description": f"{kw} 상담 전화({phone})로 연락 주세요. 원하는 사이즈, 생활 환경, "
            f"관심 두들 타입을 편안하게 상담해 드립니다.",
        },
        {
            "step": "02",
            "title": "맞춤 안내",
            "description": f"주거·가족 구성에 맞는 사이즈·코트·예상 비용을 {tone} 설명합니다. "
            f"미니골든두들과 다른 두들 종류도 함께 비교합니다.",
        },
        {
            "step": "03",
            "title": "분양 조율",
            "description": f"가능한 라인과 일정을 조율하고, 초기 준비물·접종·케어 포인트를 "
            f"정리합니다. {kw} 관련 궁금증도 이 단계에서 해소합니다.",
        },
        {
            "step": "04",
            "title": "분양 후 케어",
            "description": f"분양 이후에도 사료·미용·사회화 상담을 이어갑니다. {kw} 이후 "
            f"두들 라이프가 안정되도록 {brand}가 돕습니다.",
        },
    ]

    # ---------- 관련 검색 의도 ----------
    related_section = {
        "h2": t(_pick(rng3, RELATED_H2)),
        "paragraphs": [
            f"{kw}{_eul_reul(kw)} 찾아보신 분들은 {', '.join(related_intents[:3])} 등도 함께 확인합니다. "
            f"{brand}는 이런 궁금증에도 전화 한 통으로 답해 드립니다.",
            f"아래 키워드는 {kw}{_gwa_wa(kw)} 함께 자주 검색되는 관련 검색어입니다. 궁금한 항목이 있다면 "
            f"상담 시 함께 문의해 주세요.",
        ],
    }

    # ---------- FAQ 6~7개 ----------
    faq_count = 6 + (rng2.randrange(2))
    faq_order = _shuffled(rng2, list(range(len(FAQ_DEFS))))[:faq_count]
    faqs = []
    for def_index in faq_order:
        faq_def = FAQ_DEFS[def_index]
        q_rng = _rng(kw, idx, f"faq{def_index}")
        faqs.append(
            {
                "q": t(_pick(q_rng, faq_def["questions"])),
                "a": faq_def["answer"](kw, brand, phone),
            }
        )

    cta_text = t(_pick(rng, CTA_TEMPLATES))

    now = datetime.utcnow().isoformat() + "Z"
    return {
        "slug": slugify(kw, idx),
        "keyword": kw,
        "title": title,
        "metaDescription": meta_desc,
        "metaKeywords": meta_keywords,
        "h1": h1,
        "heroSubtitle": hero_subtitle,
        "heroBadge": hero_badge,
        "heroTitleLine1": hero_title_line1,
        "heroTitleLine2": hero_title_line2,
        "heroBar": hero_bar,
        "sections": [mission_section, facility_section, related_section],
        "servicesTitle": services_title,
        "servicesIntro": services_intro,
        "services": services,
        "promisesTitle": promises_title,
        "promises": promises,
        "processTitle": process_title,
        "processSteps": process_steps,
        "relatedIntents": related_intents,
        "faqs": faqs,
        "images": image_urls(
            6,
            _seed_int(kw, idx, "img"),
            image_url=image_url,
            image_base=image_base,
            image_count=image_count,
        ),
        "ctaText": cta_text,
        "createdAt": now,
        "updatedAt": now,
    }


def write_html(page: Dict[str, Any], site_url: str) -> str:
    imgs = "".join(
        f'<figure><img src="{u}" alt="{page["keyword"]} 골든두들분양 안내 {i+1}" loading="lazy"/></figure>'
        for i, u in enumerate(page["images"])
    )
    sections = ""
    for sec in page["sections"]:
        ps = "".join(f"<p>{p}</p>" for p in sec["paragraphs"])
        sections += f"<section><h2>{sec['h2']}</h2>{ps}</section>"

    services_html = ""
    if page.get("services"):
        cards = "".join(
            f"<article><h3>{s['title']}</h3><p>{s['description']}</p></article>"
            for s in page["services"]
        )
        services_html = (
            f"<section><h2>{page.get('servicesTitle', '핵심 서비스')}</h2>"
            f"<p>{page.get('servicesIntro', '')}</p>{cards}</section>"
        )

    promises_html = ""
    if page.get("promises"):
        items = "".join(
            f"<li><strong>{p['title']}</strong><p>{p['description']}</p></li>"
            for p in page["promises"]
        )
        promises_html = f"<section><h2>{page.get('promisesTitle', '세 가지 약속')}</h2><ol>{items}</ol></section>"

    process_html = ""
    if page.get("processSteps"):
        items = "".join(
            f"<li><span>{s['step']}</span><strong>{s['title']}</strong><p>{s['description']}</p></li>"
            for s in page["processSteps"]
        )
        process_html = f"<section><h2>{page.get('processTitle', '진행 절차')}</h2><ol>{items}</ol></section>"

    related_html = ""
    if page.get("relatedIntents"):
        chips = "".join(f"<span>#{kw}</span>" for kw in page["relatedIntents"])
        related_html = f"<section><h2>관련 검색어</h2><div>{chips}</div></section>"

    faqs = "".join(
        f"<details><summary>{f['q']}</summary><p>{f['a']}</p></details>"
        for f in page["faqs"]
    )
    url = f"{site_url.rstrip('/')}/guide/{page['slug']}"
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<title>{page['title']}</title>
<meta name="description" content="{page['metaDescription']}"/>
<meta name="keywords" content="{page['metaKeywords']}"/>
<link rel="canonical" href="{url}"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="{page['title']}"/>
<meta property="og:description" content="{page['metaDescription']}"/>
<meta property="og:url" content="{url}"/>
<meta property="og:image" content="{page['images'][0] if page['images'] else ''}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="{page['title']}"/>
<meta name="twitter:description" content="{page['metaDescription']}"/>
</head>
<body>
<header><a href="{site_url}">{SITE_NAME}</a></header>
<article>
<h1>{page['h1']}</h1>
<p>{page['heroSubtitle']}</p>
{sections}
{services_html}
{promises_html}
{process_html}
{related_html}
{imgs}
<section><h2>FAQ</h2>{faqs}</section>
<p><a href="tel:{PHONE_TEL}">{page['ctaText']}</a></p>
</article>
</body>
</html>"""


def generate_batch(
    keywords: List[str],
    out_dir: str,
    site_url: str,
    sync_public: str = "",
    image_url: str = "",
    image_base: str = "",
    image_count: Optional[int] = None,
) -> List[str]:
    import json
    import os

    os.makedirs(out_dir, exist_ok=True)
    pages_dir = os.path.join(out_dir, "pages")
    os.makedirs(pages_dir, exist_ok=True)
    slugs: List[str] = []
    urls: List[str] = []
    for i, kw in enumerate(keywords, 1):
        page = build_content(
            kw,
            i,
            image_url=image_url,
            image_base=image_base,
            image_count=image_count,
        )
        slugs.append(page["slug"])
        with open(os.path.join(pages_dir, f"{page['slug']}.json"), "w", encoding="utf-8") as f:
            json.dump(page, f, ensure_ascii=False, indent=2)
        html = write_html(page, site_url)
        with open(os.path.join(out_dir, f"{page['slug']}.html"), "w", encoding="utf-8") as f:
            f.write(html)
        urls.append(f"{site_url.rstrip('/')}/guide/{quote(page['slug'])}")
    index = {"slugs": slugs, "updatedAt": datetime.utcnow().isoformat() + "Z"}
    with open(os.path.join(out_dir, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "urls.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(urls))
    if sync_public:
        pub_pages = os.path.join(sync_public, "pages")
        os.makedirs(pub_pages, exist_ok=True)
        existing = {"slugs": [], "updatedAt": ""}
        idx_path = os.path.join(sync_public, "index.json")
        if os.path.isfile(idx_path):
            with open(idx_path, encoding="utf-8") as f:
                existing = json.load(f)
        for slug in slugs:
            src = os.path.join(pages_dir, f"{slug}.json")
            dst = os.path.join(pub_pages, f"{slug}.json")
            with open(src, encoding="utf-8") as f:
                data = f.read()
            with open(dst, "w", encoding="utf-8") as f:
                f.write(data)
            if slug not in existing["slugs"]:
                existing["slugs"].insert(0, slug)
        existing["updatedAt"] = datetime.utcnow().isoformat() + "Z"
        with open(idx_path, "w", encoding="utf-8") as f:
            json.dump(existing, f, ensure_ascii=False, indent=2)
    return urls
