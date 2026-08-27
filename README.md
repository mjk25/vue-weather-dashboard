# vue-weather-dashboard

### P108 김민주

날씨 대시보드 SPA입니다.
주요 도시의 현재 날씨를 한 화면에서 보고,
검색, 상세 조회, 단위 전환 기능을 가지고 있습니다.

## 기능

- **지역별 현재 날씨**: 서울, 수원, 부산, 제주, 강릉 5개 도시의 기온, 날씨, 습도를 카드로 표시
- **전체 지역 평균 기온**: 조회에 성공한 도시들의 평균 기온을 검색 카드 제목 옆에 표시. 마우스를 올리면 평균에 포함된 도시와 각 도시의 기온을 팝오버로 보여줌
- **도시 검색**: 입력한 도시명으로 카드 목록 필터링
- **상세 화면**: 카드에서 상세보기를 누르면 `/weather/:cityId`로 이동. 해당 도시의 기온·날씨·습도·풍속을 OpenWeatherMap에서 조회해 표시하고, 옆에 위치를 OpenStreetMap 지도로 함께 보여줌 (등록되지 않은 ID는 404 처리)
- **섭씨/화씨 전환**: 상단 버튼으로 단위를 바꾸면 모든 화면의 기온 표시가 함께 바뀜 (Pinia로 상태 공유). 버튼에는 Element Plus 툴팁 안내가 붙음
- About / FAQ 정적 페이지

메인 화면과 상세 화면 모두 OpenWeatherMap API에서 실시간 날씨를 가져옵니다.
<img width="400" alt="스크린샷 2026-08-27 오후 4 59 25" src="https://github.com/user-attachments/assets/caca3880-594a-45a2-acd7-82e5febe9508" />

## 기술 스택

Vue 3, Vue Router, Pinia, Axios, Element Plus, Vite, TypeScript

## 설정

```sh
npm install
```

OpenWeatherMap API 키가 필요합니다. 프로젝트 루트에 `.env` 파일을 만들고 키를 넣어 주세요.

```
VITE_OPENWEATHER_API_KEY=발급받은_키
```

`.env`는 `.gitignore`에 등록되어 Git에 올라가지 않습니다. API 키 같은 값은 이 파일로만 관리합니다.

## 실행

```sh
npm run dev        # 개발 서버
npm run build      # 타입 체크 + 프로덕션 빌드
npm run lint       # oxlint + eslint
npm run deploy     # 빌드 후 gh-pages로 GitHub Pages 배포
```

## 코드 품질 관리

- ESLint(+ oxlint)로 제출 과제를 점검하여 Error를 확인했습니다. `npm run lint`로 실행하며, `--fix` 옵션이 걸려 있어 자동 수정 가능한 항목은 함께 정리됩니다.
- API 키는 `.env`(Git 미포함) 환경 변수로만 관리하여 저장소에 업로드되지 않도록 했습니다.

## 빌드 & 배포

1. `npm run build`로 프로젝트를 빌드하면 `dist/`에 정적 파일이 생성됩니다.
2. `dist/` 정적 파일을 서버(GitHub Pages)에 호스팅한 뒤 브라우저에서 동작을 확인합니다.
   - `npm run deploy`가 빌드 → `index.html`을 `404.html`로 복사(SPA 라우팅 대응) → `gh-pages` 브랜치 배포까지 수행합니다.
   - 배포 URL: `https://mjk25.github.io/vue-weather-dashboard/`

## 구조

```
src/
├── components/weather/   # SearchBar, WeatherCard, BaseDashboardCard, UnitToggler
├── composables/          # useTemperature - 단위 설정에 맞춘 기온 변환
├── data/                 # cities - 도시 메타(id·이름·조회명) 공유
├── services/             # weatherApi - OpenWeatherMap 호출
├── stores/               # configStore - 온도 단위 상태
├── router/               # 라우트 정의, cityId 유효성 가드
└── views/                # Home, Detail, About, FAQ, NotFound
```

## 인사이트 — 기능별로 배운 Vue 함수/기능

### 반응형 상태 (`ref`, `computed`)

- **`ref`**: `weatherList`, `searchQuery`, `selectedCityId` 등 화면에서 바뀌는 값을 담는다. 스크립트에서는 `.value`로 접근하고 템플릿에서는 자동 언랩된다.
- **`computed`**: 원본 상태에서 파생되는 값은 직접 계산하지 않고 `computed`로 정의했다.
  - `filteredWeatherList` — 검색어에 따라 도시 목록을 필터링 (검색 기능)
  - `loadedCities` / `averageCelsius` — 조회 성공한 도시만 모아 평균 기온 계산 (전체 평균 기능)
  - `configStore.unitSymbol`, `useTemperature`의 `displayTemp` — 단위 설정에 따라 기호와 값을 변환 (단위 전환 기능)
  - 의존하는 `ref`가 바뀌면 자동으로 다시 계산되고 결과는 캐시된다.

### 감시자 (`watch`, `watchEffect`)

- **`watch(source, callback)`**: 지정한 소스가 **바뀔 때만** 콜백 실행. `selectedCityInfo`(상태바 문구)가 변할 때 콘솔에 로그를 남기는 데 사용. 감시 대상을 명시적으로 지정한다는 점이 핵심.
- **`watchEffect`**: 콜백을 **즉시 한 번 실행**하면서 그 안에서 접근한 반응형 값(`searchQuery`)을 자동으로 의존성으로 수집. 소스를 따로 지정할 필요가 없다.
- 정리: "특정 값 하나가 바뀐 전/후 값이 필요하다" → `watch`, "여러 반응형 값에 의존하는 사이드 이펙트를 바로 돌리고 싶다" → `watchEffect`.

### 생명주기 (`onMounted`)

- API 호출은 `onMounted` 안에서 실행. DOM에 마운트된 뒤 실행되므로 초기 렌더를 막지 않고, `weatherList.value[index]`를 나중에 채워 넣으면 반응형으로 화면이 갱신된다 (메인 날씨 조회).
- 상세 화면도 `onMounted`에서 `route.params.cityId` → `findCityById`로 조회명을 찾아 `fetchCurrentWeather`를 호출하고, `loading` / `errorMessage` 상태로 로딩·실패를 구분해 렌더한다.
- 상세 화면의 지도는 API 응답의 `coord`(위경도)로 OpenStreetMap 임베드 URL을 `computed`로 만들어 `<iframe>`에 넣는다. 링크만으로는 지도가 안 뜨고, 키가 필요 없는 OSM `export/embed.html`을 iframe으로 띄우는 방식.

### 컴포저블 (`useTemperature`)

- 단위 변환 로직을 `composables/useTemperature.js`로 분리해 `WeatherCard`, `WeatherDetailView`, 평균 기온에서 재사용.
- 인자를 값이 아니라 **getter 함수**(`() => props.cityItem.temp`)로 받는 것이 포인트. 그래야 컴포저블 내부 `computed`가 원본의 반응성을 잃지 않는다.

### 전역 상태 (Pinia)

- **`defineStore`의 setup 문법**: `ref`(`unit`) + `computed`(`unitSymbol`) + 함수(`toggleUnit`)를 그대로 반환. 컴포넌트 `<script setup>`과 같은 방식으로 작성된다.
- `UnitToggler`에서 상태를 바꾸면 `useTemperature`를 쓰는 모든 화면의 기온 표시가 함께 갱신된다 (단위 전환의 상태 공유).

### 부모-자식 통신 (`defineProps`, `defineEmits`)

- **props down**: `WeatherCard`에 `:city-item`, `:selected` 전달.
- **events up**: 자식은 상태를 직접 바꾸지 않고 `emit('select-card', ...)`, `emit('update-query', ...)`로 알리면 부모가 처리.
- `SearchBar`는 `v-model` 대신 `:value` + `@input`으로 단방향 흐름을 직접 구현.

### 계층 건너뛰기 (`provide` / `inject`)

- `App.vue`에서 `provide('appTitle', ...)`, `WeatherAboutView`에서 `inject('appTitle', 기본값)`. props를 중간 컴포넌트로 계속 넘기지 않고 조상 → 후손으로 바로 전달.

### 슬롯 (`slot`, `$slots`)

- `BaseDashboardCard`가 이름 있는 슬롯(`#title`)과 기본 슬롯으로 레이아웃 틀만 제공.
- `v-if="$slots.title"`로 슬롯이 실제로 넘어왔을 때만 헤더를 렌더.

### 라우팅 (Vue Router)

- **`useRouter` / `useRoute`**: 이동은 `router.push({ name, params })`, 현재 URL 파라미터는 `route.params.cityId`.
- **동적 라우트** `/weather/:cityId` + **lazy import** `component: () => import(...)`로 코드 스플리팅.
- **`router.beforeEach` 가드**: 등록되지 않은 `cityId`면 `{ name: 'NotFound' }` 반환해 404 화면으로 리다이렉트.
- **catch-all** `/:pathMatch(.*)*` + `redirect`로 정의되지 않은 모든 경로 처리.

### 템플릿 문법

- `v-for` + `:key`, `v-if / v-else`로 목록·조건 렌더 (FAQ 아코디언, 검색 결과 없음 처리).
- `@click.stop`으로 카드 클릭과 상세보기 버튼 클릭의 이벤트 버블링 분리 (`WeatherCard`).

### UI 라이브러리 (Element Plus)

- `main.ts`에서 `app.use(ElementPlus)`로 전역 등록하고 CSS를 import하면 컴포넌트를 별도 import 없이 템플릿에서 바로 쓸 수 있다.
- `el-tooltip` — 단위 변경 버튼에 설명 툴팁 (`UnitToggler`).
- `el-popover` + `#reference` 슬롯 — 평균 기온 박스에 마우스를 올리면 평균에 포함된 도시 목록을 띄운다 (`WeatherHomeView`).
- 직접 만든 슬롯/이벤트 패턴 위에 필요한 부분만 골라 얹는 식으로 도입.
