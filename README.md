# 골든두들 클럽 (Golden Doodle Club)

골든리트리버 × 푸들 하이브리드 골든두들분양 사이트 (Next.js 15)

> 달빛쉘터·메종드꼬똥과 **Blob / IndexNow / 환경변수를 공유하지 마세요.**

## 로컬 실행

```bash
npm install
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin (`infocs` / `infocs070207`)

## 로컬 대량 발행

```bat
tools\webdoc\run.bat
```

exe: `tools\webdoc\build_exe.bat` → `골든두들클럽웹문서생성기.exe`

## 환경변수

`.env.example` · `VERCEL_SETUP.txt` 참고

| 키 | 설명 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://doodleclub.vercel.app` |
| `NEXT_PUBLIC_PHONE` | 상담 전화 (필수 권장) |
| `NEXT_PUBLIC_KAKAO_URL` | 카톡 URL (선택) |
| `ADMIN_JWT_SECRET` | 관리자 JWT |
| `INDEXNOW_KEY` | `9d632b19a797e6473fec14b25c553aa8` |
| `BLOB_READ_WRITE_TOKEN` | **doodleclub 전용** Blob만 |
| `GEMINI_API_KEY` | 선택 |

## IndexNow

- 키 파일: `public/9d632b19a797e6473fec14b25c553aa8.txt`
- 배포 후 `https://도메인/9d632b19a797e6473fec14b25c553aa8.txt` 접근 확인

## 이미지 CDN

`https://image.cattery.co.kr/doodle` (01.webp ~ 40.webp)
