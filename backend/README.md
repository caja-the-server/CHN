# CHN 백엔드

## 디렉토리 개요

작성중

## 라우트 엔드포인트

- `/api`
  - `/auth`
    - `POST /verify-auth-token`
      - 인증 토큰 사용 가능 여부 확인
    - `POST /signup`
      - 회원가입
    - `POST /signin`
      - 로그인
    - `POST /signout`
      - 로그아웃
    - `GET /me`
      - 현재 로그인한 유저 정보 확인
    - `POST /update-password`
      - 현재 로그인한 유저 비번 업데이트
  - `/users`
    - `GET /:username`
      - 유저 정보 조회
    - `PATCH /`
      - 유저 정보 업데이트
    - `DELETE /`
      - 유저 삭제
  - `/categories`
    - `GET /`
      - 전체 리스트 조회
    - `POST /`
      - 카테고리 추가
    - `PATCH /:id`
      - 카테고리 정보 업데이트
    - `DELETE /:id`
      - 카테고리 삭제
  - `/articles`
    - `GET /:id`
      - 기사 조회
    - `GET /`
      - 카테고리 별 기사 조회
    - `POST /`
      - 기사 추가
    - `PATCH /:id`
      - 기사 정보 업데이트
    - `DELETE /:id`
      - 기사 삭제
  - `/images`
    - `GET /:name`
      - 이미지 조회
    - `POST /`
      - 이미지 업로드
