# vvtoonA
<div style="text-align:center">
    <img src='logo.png' alt='logo'>
</div>

## BUILD
* bun + express
* ORM
    - Sequelize
    - Drizzle
    - TypeORM
* DB
    - RDBMS: MySQL -> PostgreSQL
    - NoSQL: Redis (아마)
* Auth (한다면)
    - Passport
    - Kakao OAuth

## ERD   
<div style="text-align:center">
    <img src='vvtoonA.png' alt='logo'>
</div>

## INTRO
* 웹툰 보는데 여기저기 산재해 있어서 하나에서 몰아보고 싶다(북마크).
* 기왕이면 업데이트된 회차를 알림으로 받아보고 싶다.
    - 그래서 IOS 앱으로 만들려고 했다가 하기의 이유로 접고 그냥 SSE로 백엔드에서 보내는 것만 테스트하기로
* nodeJS로 프로젝트를 하고싶다(스프링부트 무거워).
* 기왕이면 bun도 써보고 싶다.
* JWT 구현 귀찮으므로 OAuth로 회원관리 할 건데 그것도 귀찮아서 할지 안 할지는 모르겠다.
* 애초에 프론트엔드를 하게 될지 모르겠다.
    - 한다면 SVELTE로 SSR 하거나 (일단 RestAPI 만들긴 하겠지만) -> svelte kit으로 CSR
    - Flutter 간단히 배워서 앱 만들거임 -> google에서 drop함
    - 원래는 SwiftUI 하고 있었는데 애플 개발자 등록할 돈이 없음
* ElasticSearch로 검색 최적화(인덱싱)
* embeddings를 통해 웹툰 추천

## GOAL
* 기본적인 UI는 [폴센트](https://fallcent.com)를 참고
* 웹툰 URL 링크를 등록하면 해당 웹툰의 최신 회차 알림
    - API가 있을리 없으니 크롤링해서 SSE로 보내기(예상)
* 해당 웹툰의 마지막으로 읽은 회차도 등록(내가 어디까지 읽었었나 기록하기 쉽게)
* 알림은 On/Off 가능
* 일단은 백엔드 API 구현을 목표
    - 끝나면(끝났는데도 취업이 안 되면) 프론트엔드
        1. 웹에서 svelte 써서 SSR로 -> CSR(백엔드 바꾸기 귀찮음)
        2. Flutter로 구현(예정) -> google에서 drop했기 떄문에 한다면 native로 하거나 hybrid로
* AI 써먹어봐야지 -> 웹툰 추천
    - ollama embed 써서(chatGPT 토큰 비싸)
* CI/CD
    - 일단 CI는 github actions로 docker hub에 push(local용)
    - 쿠버네티스나 dagger 써보고 싶지만 모르겠음 귀찮음